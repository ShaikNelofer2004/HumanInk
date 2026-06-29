import os
import json
import re
import numpy as np
from nltk.tokenize import sent_tokenize, word_tokenize
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
from utils import calculate_burstiness, derive_dna_threshold

load_dotenv()

class GatekeeperAgent:
    def __init__(self):
        # The Gatekeeper uses a fast model for the semantic check
        gatekeeper_key = os.getenv("GROQ_API_KEY_GATEKEEPER")
        
        self.llm = None
        if gatekeeper_key:
            self.llm = ChatGroq(
                model_name="openai/gpt-oss-20b", 
                temperature=0.0,
                api_key=gatekeeper_key
            )
        else:
            print("WARNING: GROQ_API_KEY_GATEKEEPER not found. Semantic gate will be skipped.")

    def evaluate(self, text: str, dna_profile: dict = None) -> dict:
        """
        Evaluates if the text is already 'human enough' to skip the rewriting loop.

        When a Custom DNA is active (dna_profile provided with style_instructions),
        the Math Gate uses a personalized threshold derived from the user's actual
        writing variance instead of global hardcoded values.

        The Semantic Gate is also made DNA-aware: the user's documented quirks are
        passed to the LLM so intentional stylistic choices are not flagged as errors.

        Returns a dictionary with 'skip_rewriting' (bool) and 'reason' (str).
        """
        is_custom_dna = bool(dna_profile and dna_profile.get("style_instructions"))

        # --- 1. SMART THRESHOLDS (The Math Gate) ---
        burstiness = calculate_burstiness(text)
        print(f"    [Gatekeeper] Input Burstiness: {burstiness:.2f}")
        
        sentences = sent_tokenize(text)
        lengths = [len(word_tokenize(s)) for s in sentences]
        avg_length = np.mean(lengths) if lengths else 0
        print(f"    [Gatekeeper] Avg Sentence Length: {avg_length:.2f}")

        if is_custom_dna:
            # Dynamic Calibration: derive threshold from the user's DNA
            required_burstiness = derive_dna_threshold(dna_profile)
            print(f"    [Gatekeeper] Mode: DNA-Calibrated | Threshold: {required_burstiness:.2f}")
        else:
            # Global thresholds for Default Profile
            required_burstiness = 7.0 if avg_length > 20 else 4.0
            print(f"    [Gatekeeper] Mode: Global | Threshold: {required_burstiness:.2f}")

        if burstiness < required_burstiness:
            reason = f"FAILED Math Gate (Burstiness {burstiness:.2f} < required {required_burstiness:.2f})."
            print(f"    [Gatekeeper] >> {reason} Rewrite required.")
            return {"skip_rewriting": False, "reason": reason}

        print("    [Gatekeeper] >> PASSED Math Gate. Verifying with Semantic Gate...")

        # --- 2. DNA-AWARE SEMANTIC GATE (The LLM Check) ---
        if not self.llm:
            return {"skip_rewriting": True, "reason": "Passed Math Gate (Semantic check disabled due to missing API key)."}

        # Build a DNA-aware context block for the Semantic Gate
        dna_context = ""
        if is_custom_dna:
            quirks = dna_profile.get("Quirks", [])
            tone   = dna_profile.get("Tone", "")
            if quirks or tone:
                quirk_str = ", ".join(quirks) if quirks else "none noted"
                dna_context = (
                    f"\n\nIMPORTANT — This user's writing DNA has these documented intentional quirks: {quirk_str}. "
                    f"Their natural tone is: {tone}. "
                    "Do NOT flag any of these documented patterns as errors or problems — they are deliberate stylistic choices, not flaws."
                )

        prompt = ChatPromptTemplate.from_template(
            "You are an expert Editor. Analyze the following text.\n"
            "Determine if it is **High-Quality, Natural Human Writing**.\n\n"
            "TEXT: {text}\n\n"
            "The text requires 'Humanization' (Rewrite) if:\n"
            "1. It contains unintentional grammar errors.\n"
            "2. It has 'AI Watermarks' (delve, tapestry, landscape, moreover, testament).\n"
            "3. It has robotic, repetitive flow clearly NOT matching any stated writing style.\n"
            "{dna_context}\n\n"
            "Respond ONLY with a JSON object: {{ \"needs_humanization\": boolean, \"reason\": \"short reason\" }}"
        )
        
        try:
            chain = prompt | self.llm
            response = chain.invoke({"text": text, "dna_context": dna_context})
            
            # Regex extract JSON safely
            json_match = re.search(r"\{.*\}", response.content, re.DOTALL)
            if json_match:
                result = json.loads(json_match.group(0))
                needs_humanization = result.get("needs_humanization", True)
                reason = result.get("reason", "Unknown")
                
                if needs_humanization:
                    print(f"    [Gatekeeper] BLOCKED by Semantic Gate: {reason}")
                    return {"skip_rewriting": False, "reason": f"Semantic Gate failed: {reason}"}
                else:
                    print(f"    [Gatekeeper] PASSED all gates: {reason}")
                    return {"skip_rewriting": True, "reason": f"Passed all gates: {reason}"}
                    
        except Exception as e:
            print(f"    [Gatekeeper] !! Error in Semantic Gate: {e}. Proceeding to rewrite.")
            
        # Default fallback if parsing fails
        return {"skip_rewriting": False, "reason": "Failed to parse semantic evaluation, defaulting to rewrite."}
