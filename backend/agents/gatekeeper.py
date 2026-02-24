import os
import json
import re
import numpy as np
from nltk.tokenize import sent_tokenize, word_tokenize
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
from utils import calculate_burstiness

load_dotenv()

class GatekeeperAgent:
    def __init__(self):
        # The Gatekeeper uses a fast model for the semantic check
        gatekeeper_key = os.getenv("GROQ_API_KEY_GATEKEEPER")
        
        self.llm = None
        if gatekeeper_key:
            self.llm = ChatGroq(
                model_name="llama-3.1-8b-instant", 
                temperature=0.0,
                api_key=gatekeeper_key
            )
        else:
            print("WARNING: GROQ_API_KEY_GATEKEEPER not found. Semantic gate will be skipped.")

    def evaluate(self, text: str) -> dict:
        """
        Evaluates if the text is already 'human enough' to skip the rewriting loop.
        Returns a dictionary with 'skip_rewriting' (bool) and 'reason' (str).
        """
        # --- 1. SMART THRESHOLDS (The Math Gate) ---
        burstiness = calculate_burstiness(text)
        print(f"    [Gatekeeper] Input Burstiness: {burstiness:.2f}")
        
        sentences = sent_tokenize(text)
        lengths = [len(word_tokenize(s)) for s in sentences]
        avg_length = np.mean(lengths) if lengths else 0
        print(f"    [Gatekeeper] Avg Sentence Length: {avg_length:.2f}")

        # Intelligent Thresholding
        # If text is "Dense/Academic" (Avg Length > 20), require higher burstiness to pass.
        required_burstiness = 7.0 if avg_length > 20 else 4.0

        if burstiness < required_burstiness:
            reason = f"FAILED Math Check (Burstiness {burstiness:.2f} < {required_burstiness})."
            print(f"    [Gatekeeper] >> {reason} Rewrite required.")
            return {"skip_rewriting": False, "reason": reason}

        print("    [Gatekeeper] >> PASSED Math Check. Verifying with Semantic Gate...")

        # --- 2. LLM GATEKEEPER (The Semantic Gate) ---
        if not self.llm:
            return {"skip_rewriting": True, "reason": "Passed Math Check (Semantic check disabled due to missing API key)."}

        prompt = ChatPromptTemplate.from_template(
            "You are an expert Editor. Analyze the following text.\n"
            "Determine if it is **High-Quality, Natural Human Writing**.\n\n"
            "TEXT: {text}\n\n"
            "The text requires 'Humanization' (Rewrite) if:\n"
            "1. It contains grammar errors (e.g., 'I am a senior... is studying').\n"
            "2. It has 'AI Watermarks' (delve, tapestry, landscape).\n"
            "3. It has painful run-on sentences or robotic flow.\n\n"
            "Respond ONLY with a JSON object: {{ \"needs_humanization\": boolean, \"reason\": \"short reason\" }}"
        )
        
        try:
            chain = prompt | self.llm
            response = chain.invoke({"text": text})
            
            # Regex extract JSON safely
            json_match = re.search(r"\{.*\}", response.content, re.DOTALL)
            if json_match:
                result = json.loads(json_match.group(0))
                # Default to true if the LLM didn't return a clear boolean
                needs_humanization = result.get("needs_humanization", True)
                reason = result.get("reason", "Unknown")
                
                if needs_humanization:
                    print(f"    [Gatekeeper] 🛑 Text needs work: {reason}")
                    return {"skip_rewriting": False, "reason": f"Semantic check failed: {reason}"}
                else:
                    print(f"    [Gatekeeper] ✅ Text is High-Quality Human: {reason}")
                    return {"skip_rewriting": True, "reason": f"Passed all checks: {reason}"}
                    
        except Exception as e:
            print(f"    [Gatekeeper] !! Error: {e}. Proceeding to rewrite to be safe.")
            
        # Default fallback if parsing fails or error occurs
        return {"skip_rewriting": False, "reason": "Failed to parse semantic evaluation, defaulting to rewrite."}
