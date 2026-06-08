from fastapi import FastAPI, Request, HTTPException, Security, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import json
import asyncio
import jwt
from jwt import PyJWKClient

# Import graph components
from graph import app as langgraph_app, profiler
from latex_utils import (
    extract_latex_tokens,
    reinjert_latex_tokens,
    is_latex_document,
    get_field_profile
)
from section_detector import detect_section

# Import database module
from database import get_user_profiles, upsert_user_profile

app = FastAPI()

# Enable CORS for React frontend (Fully permissive for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Clerk Authentication Setup ---
security = HTTPBearer()
# JWKS URL derived from your publishable key (summary-civet-91.clerk.accounts.dev)
JWKS_URL = "https://summary-civet-91.clerk.accounts.dev/.well-known/jwks.json"
jwks_client = PyJWKClient(JWKS_URL)

def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    try:
        signing_key = jwks_client.get_signing_key_from_jwt(credentials.credentials)
        payload = jwt.decode(
            credentials.credentials,
            signing_key.key,
            algorithms=["RS256"],
            options={"verify_aud": False}
        )
        return payload
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid or expired token: {str(e)}")
# ----------------------------------

class ProfileRequest(BaseModel):
    samples: str

class HumanizeRequest(BaseModel):
    input_text: str
    style_profile: Dict[str, Any] = None
    max_iterations: int = 3
    academic_mode: bool = False
    field_id: Optional[str] = None
    section_override: Optional[str] = None
    paraphrase_depth: int = 1  # 0=Light Touch  1=Balanced  2=Full Reconstruction

import uuid

class ProfileSaveRequest(BaseModel):
    profile: Dict[str, Any]

class ActiveProfileRequest(BaseModel):
    activeProfileId: Optional[str] = None

def migrate_to_v2(profile_data):
    if not profile_data:
        return {"version": 2, "activeProfileId": None, "profiles": [], "credits": 10}
    
    if profile_data.get("version") == 2:
        if "credits" not in profile_data:
            profile_data["credits"] = 10
        return profile_data
    
    # Legacy migration
    default_id = str(uuid.uuid4())
    name = profile_data.get("archetype", "Legacy Profile")
    if name.startswith("The "):
        name = name[4:]
    profile_data["id"] = default_id
    profile_data["name"] = name
    return {
        "version": 2,
        "activeProfileId": default_id,
        "profiles": [profile_data],
        "credits": 10
    }

@app.get("/api/profiles")
async def fetch_profiles(user: dict = Depends(verify_token)):
    """Fetches the saved DNA profile for the authenticated user from Supabase."""
    clerk_id = user.get("sub")
    if not clerk_id:
        raise HTTPException(status_code=401, detail="No user ID found in token")
        
    profile_data = get_user_profiles(clerk_id)
    migrated_data = migrate_to_v2(profile_data)
    
    # If it was migrated from legacy, save the v2 format back
    if profile_data and profile_data.get("version") != 2:
        upsert_user_profile(clerk_id, migrated_data)
        
    return {"profileData": migrated_data}

@app.post("/api/profile/extract")
async def extract_profile(req: ProfileRequest, user: dict = Depends(verify_token)):
    """Takes writing samples and uses the Profiler Agent to extract the Style Fingerprint."""
    samples_list = [s.strip() for s in req.samples.split("\n\n") if len(s.strip()) > 10]
    if not samples_list:
        samples_list = [req.samples]
        
    profile = profiler.extract_style(samples_list)
    return {"profile": profile}

@app.post("/api/profile")
async def save_profile(req: ProfileSaveRequest, user: dict = Depends(verify_token)):
    """Appends a new DNA profile to the user's account."""
    clerk_id = user.get("sub")
    if not clerk_id:
        raise HTTPException(status_code=401, detail="No user ID found in token")
        
    current_data = migrate_to_v2(get_user_profiles(clerk_id))
    
    new_profile = req.profile
    if "id" not in new_profile:
        new_profile["id"] = str(uuid.uuid4())
        
    # Upsert the profile: update if id exists, else append
    existing_idx = next((i for i, p in enumerate(current_data["profiles"]) if p["id"] == new_profile["id"]), None)
    if existing_idx is not None:
        current_data["profiles"][existing_idx] = new_profile
    else:
        current_data["profiles"].append(new_profile)
        
    current_data["activeProfileId"] = new_profile["id"]
    
    upsert_user_profile(clerk_id, current_data)
    return {"profileData": current_data}

@app.post("/api/profile/active")
async def set_active_profile(req: ActiveProfileRequest, user: dict = Depends(verify_token)):
    clerk_id = user.get("sub")
    if not clerk_id:
        raise HTTPException(status_code=401)
        
    current_data = migrate_to_v2(get_user_profiles(clerk_id))
    current_data["activeProfileId"] = req.activeProfileId
    
    upsert_user_profile(clerk_id, current_data)
    return {"profileData": current_data}

@app.delete("/api/profile/{profile_id}")
async def delete_profile(profile_id: str, user: dict = Depends(verify_token)):
    clerk_id = user.get("sub")
    if not clerk_id:
        raise HTTPException(status_code=401)
        
    current_data = migrate_to_v2(get_user_profiles(clerk_id))
    current_data["profiles"] = [p for p in current_data["profiles"] if p["id"] != profile_id]
    
    if current_data["activeProfileId"] == profile_id:
        current_data["activeProfileId"] = current_data["profiles"][0]["id"] if len(current_data["profiles"]) > 0 else None
        
    upsert_user_profile(clerk_id, current_data)
    return {"profileData": current_data}

@app.post("/api/humanize/stream")
async def humanize_stream(req: HumanizeRequest, user: dict = Depends(verify_token)):
    """Runs the LangGraph Reflexion Loop and streams events using SSE."""
    clerk_id = user.get("sub")
    if not clerk_id:
        raise HTTPException(status_code=401, detail="Unauthorized. Please sign in.")
        
    # Check Credits
    current_data = migrate_to_v2(get_user_profiles(clerk_id))
    credits_remaining = current_data.get("credits", 0)
    if credits_remaining <= 0:
        raise HTTPException(status_code=402, detail="No credits remaining. Please upgrade to Pro.")

    raw_input = req.input_text
    word_count = len(raw_input.split())
    if word_count > 100:
        raise HTTPException(status_code=400, detail="Text exceeds the 100 word limit for free accounts.")

    # Deduct Credit and Save
    current_data["credits"] = credits_remaining - 1
    upsert_user_profile(clerk_id, current_data)

    # ── Academic Mode: Pre-Processing ────────────────────────────────────────
    token_map = {}
    effective_profile = req.style_profile or {}
    detected_section = None

    if req.academic_mode:
        # Step 1: Load field baseline profile
        if req.field_id and not effective_profile.get("style_instructions"):
            field_profile = get_field_profile(req.field_id)
            effective_profile = {**field_profile, **(effective_profile or {})}

        # Step 2: Section detection (auto or manual override)
        if req.section_override:
            from section_detector import get_section_rules
            rules = get_section_rules(req.section_override)
            detected_section = {
                "section_id": req.section_override,
                "label": rules["label"],
                "emoji": rules["emoji"],
                "confidence": "manual",
                "detection_method": "user_override",
                "writer_rules": rules["writer_rules"]
            }
        else:
            detected_section = detect_section(raw_input)

        # Inject section-specific rules into the style profile for the Writer
        effective_profile["section_type"] = detected_section["section_id"]
        effective_profile["section_label"] = detected_section["label"]
        effective_profile["section_writer_rules"] = detected_section["writer_rules"]

        # Step 3: Strip LaTeX tokens, save to token_map
        if is_latex_document(raw_input) or req.field_id:
            clean_input, token_map = extract_latex_tokens(raw_input)
            effective_profile["latex_note"] = (
                "CRITICAL: The input text contains <<LATEX_*>> placeholders. "
                "You MUST preserve ALL placeholders EXACTLY as-is in your output. "
                "Do NOT translate, paraphrase, or remove any <<LATEX_*>> token. "
                "Only rewrite the surrounding natural language prose."
            )
        else:
            clean_input = raw_input
    else:
        clean_input = raw_input

    # ── Paraphrase Depth — inject into profile for Writer ────────────────────────
    word_count = len(clean_input.split())
    DEPTH_INSTRUCTIONS = {
        0: (
            "PARAPHRASE DEPTH: LIGHT TOUCH.\n"
            "Make only minimal changes. Your priorities in order:\n"
            "1. Vary sentence length — break up any uniform-length runs.\n"
            "2. Remove obvious AI boilerplate words (Furthermore, Moreover, It is worth noting).\n"
            "3. Do NOT restructure sentences, change vocabulary dramatically, or alter meaning.\n"
            "Preserve the original phrasing as much as possible.\n"
            f"**LENGTH CONSTRAINT:** The original text is {word_count} words. You may reduce the length slightly, but your output MUST be at least {int(word_count * 0.85)} words."
        ),
        1: (
            "PARAPHRASE DEPTH: BALANCED.\n"
            "Rewrite naturally but don't overdo it. Your priorities:\n"
            "1. Vary sentence length and structure meaningfully.\n"
            "2. Replace AI-watermark vocabulary with natural alternatives.\n"
            "3. Restructure 1-2 sentences per paragraph for flow.\n"
            "Preserve the core meaning and all key facts exactly.\n"
            f"**LENGTH CONSTRAINT:** The original text is {word_count} words. Your output MUST be roughly the same length (between {int(word_count * 0.95)} and {int(word_count * 1.05)} words)."
        ),
        2: (
            "PARAPHRASE DEPTH: FULL RECONSTRUCTION.\n"
            "Aggressively reconstruct the text at every level. Your priorities:\n"
            "1. Rewrite every sentence with a different grammatical structure than the original.\n"
            "2. Replace vocabulary throughout — use synonyms, rephrasings, and reorderings.\n"
            "3. Convert passive constructions to active and vice versa throughout.\n"
            "4. Break long sentences into short ones and merge short sentences into complex ones.\n"
            "You may restructure paragraph order if it improves naturalness. Preserve all facts.\n"
            f"**LENGTH CONSTRAINT:** The original text is {word_count} words. You MUST aggressively expand on concepts to increase the length. Your output MUST be strictly between {int(word_count * 1.10)} and {int(word_count * 1.40)} words."
        ),
    }
    depth = max(0, min(2, req.paraphrase_depth))  # clamp to 0-2
    effective_profile["paraphrase_depth"] = depth
    effective_profile["paraphrase_depth_instruction"] = DEPTH_INSTRUCTIONS[depth]
    # ────────────────────────────────────────────────────────────────────────

    initial_state = {
        "input_text": clean_input,
        "style_samples": [],
        "style_profile": effective_profile,
        "current_draft": "",
        "critique_feedback": "",
        "iteration_count": 0,
        "max_iterations": req.max_iterations,
        "is_robotic": True,
        "skip_rewriting": False
    }

    async def event_generator():
        # Using stream method which yields updates
        try:
            for event in langgraph_app.stream(initial_state):
                # event is a dictionary with the node name as key
                for node_name, state_update in event.items():
                    # Formatting as SSE
                    
                    status_message = f"Processing inside {node_name}..."
                    if node_name == "pre_critic":
                        if state_update.get("skip_rewriting"):
                            status_message = "Gatekeeper: Passed! Excellent human text."
                        else:
                            status_message = "Gatekeeper: Failed. Forwarding to Writer..."
                    elif node_name == "writer":
                        status_message = f"Writer: Drafting iteration {state_update.get('iteration_count', 0)}..."
                    elif node_name == "critic":
                        is_robotic = state_update.get("is_robotic")
                        status_message = f"Critic Evaluated: {'Robotic' if is_robotic else 'Passed'}"
                    
                    # Yield the event status
                    yield f"data: {json.dumps({'type': 'status', 'node': node_name, 'message': status_message})}\n\n"
                    
                    # Small delay so frontend animations can catch up visually
                    await asyncio.sleep(0.5)
            
            # Retrieve final state (usually inside the last event dict)
            # langgraph_app.stream yields state updates, not the full final state easily in a single block without manual tracking.
            # But we can just use latest values. We will fetch the final result from the graph itself or trust the last state update.
            # Wait, `app.invoke` returns final state. `app.stream` yields state updates.
            # We can capture the last output.
            pass
            
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"
            
        # At the very end, we need the final draft. Since langgraph app state is accessible, 
        # actually getting the final state from stream requires tracking.
        # Let's run a quick secondary lookup, or just keep track
        
    
    # Let's redefine the generator with state tracking to return the final draft safely.
    async def comprehensive_event_generator():
        final_draft = ""
        final_score_status = "N/A"
        try:
            # ── Stream detected section to frontend immediately ───────────────
            if req.academic_mode and detected_section:
                section_msg = detected_section['emoji'] + " Section Detected: " + detected_section['label'] + " (" + detected_section['confidence'] + " confidence)"
                section_event = {
                    "type": "section_detected",
                    "section_id": detected_section["section_id"],
                    "label": detected_section["label"],
                    "emoji": detected_section["emoji"],
                    "confidence": detected_section["confidence"],
                    "message": section_msg
                }
                yield f"data: {json.dumps(section_event)}\n\n"
                await asyncio.sleep(0.05)
            # ─────────────────────────────────────────────────────────────────
            # We must use sync iteration if app.stream is sync, or run in executor.
            # LangGraph standard stream is sync if app is standard StateGraph.
            for event in langgraph_app.stream(initial_state):
                for node_name, state_update in event.items():
                    status_message = f"Executing {node_name} agent..."
                    score = 0
                    
                    if node_name == "pre_critic":
                        if state_update.get("skip_rewriting"):
                            status_message = "Gatekeeper: Text is already Human!"
                            final_draft = state_update.get("current_draft")
                            final_score_status = "Passed"
                        else:
                            status_message = "Gatekeeper: Math/Semantic failed. Sending to loop."
                    
                    elif node_name == "writer":
                        status_message = f"Writer: Drafting iteration {state_update.get('iteration_count')}..."
                        final_draft = state_update.get("current_draft", final_draft)
                    
                    elif node_name == "critic":
                        msg = state_update.get("critique_feedback", "")
                        # Try to parse the score out if possible if we want a number (not strictly provided by current Critic output)
                        final_score_status = "Passed" if not state_update.get("is_robotic") else "Failed"
                        status_message = f"Critic evaluation complete. Verdict: {final_score_status}"

                    yield f"data: {json.dumps({'type': 'status', 'node': node_name, 'message': status_message, 'score': final_score_status})}\n\n"
                    await asyncio.sleep(0.1)
            
            # ── Academic Mode: Re-inject LaTeX tokens into final output ──────
            if req.academic_mode and token_map:
                final_draft = reinjert_latex_tokens(final_draft, token_map)
                yield f"data: {json.dumps({'type': 'status', 'node': 'latex', 'message': 'LaTeX-Safe: Re-injecting preserved tokens...', 'score': final_score_status})}\n\n"
                await asyncio.sleep(0.1)
            # ─────────────────────────────────────────────────────────────────

            # Send Final Output
            yield f"data: {json.dumps({'type': 'complete', 'output': final_draft})}\n\n"
            
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"
            
    return StreamingResponse(comprehensive_event_generator(), media_type="text/event-stream")

