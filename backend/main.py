from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import json
import asyncio

# Import graph components
from graph import app as langgraph_app, profiler
from latex_utils import (
    extract_latex_tokens,
    reinjert_latex_tokens,
    is_latex_document,
    get_field_profile
)

app = FastAPI()

# Enable CORS for React frontend (Fully permissive for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProfileRequest(BaseModel):
    samples: str

class HumanizeRequest(BaseModel):
    input_text: str
    style_profile: Dict[str, Any] = None
    max_iterations: int = 3
    academic_mode: bool = False
    field_id: Optional[str] = None  # 'cs', 'medicine', 'humanities', 'law', 'business', 'general'

@app.post("/api/profile")
async def extract_profile(req: ProfileRequest):
    """Takes writing samples and uses the Profiler Agent to extract the Style Fingerprint."""
    # Split the big string by newline blocks to form a list
    samples_list = [s.strip() for s in req.samples.split("\n\n") if len(s.strip()) > 10]
    if not samples_list:
        samples_list = [req.samples]
        
    profile = profiler.extract_style(samples_list)
    return {"profile": profile}

@app.post("/api/humanize/stream")
async def humanize_stream(req: HumanizeRequest):
    """Runs the LangGraph Reflexion Loop and streams events using SSE."""
    
    # ── Academic Mode: LaTeX Pre-Processing ──────────────────────────────────
    raw_input = req.input_text
    token_map = {}
    effective_profile = req.style_profile or {}

    if req.academic_mode:
        # Step 1: Auto-detect or use field baseline profile
        if req.field_id and not effective_profile.get("style_instructions"):
            field_profile = get_field_profile(req.field_id)
            effective_profile = {**field_profile, **(effective_profile or {})}
        
        # Step 2: Strip LaTeX tokens, save to token_map
        if is_latex_document(raw_input) or req.field_id:
            clean_input, token_map = extract_latex_tokens(raw_input)
            # Inject placeholder instructions into the style profile for the Writer
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
    # ─────────────────────────────────────────────────────────────────────────

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

