import json
import os
import re
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
from utils import calculate_burstiness

load_dotenv()

class ProfilerAgent:
    def __init__(self):
        # Brain 3: The Profiler (Deep Analysis)
        # Using OpenRouter with a high-quality model (Llama 3.3 70B) for style extraction
        self.llm = ChatOpenAI(
            model="meta-llama/llama-3.3-70b-instruct", 
            temperature=0.5,
            base_url="https://openrouter.ai/api/v1",
            api_key=os.getenv("OPENROUTER_API_KEY")
        )

    def extract_style(self, samples: list[str]) -> dict:
        combined_text = "\n\n---\n\n".join(samples)
        
        system_instruction = (
            "You are an expert Linguistic Stylist. Your job is to analyze the user's writing samples "
            "and create a 'Style Fingerprint' so a Ghostwriter can mimic them perfectly.\n"
            "Ignore the topic/content. Focus ONLY on the syntax, rhythm, and habits.\n\n"
            "Output a JSON object with EXACTLY these keys:\n"
            "- 'Sentence_Length_Variance': (String) e.g., 'High (mix of short/long)' or 'Low (consistent medium length)'.\n"
            "- 'Tone': (String) e.g., 'Casual and sarcastic', 'Academic and dry'.\n"
            "- 'Common_Connectors': (List of strings) Specific transition words frequently used (e.g., 'However', 'Plus', 'So').\n"
            "- 'Quirks': (List of strings) Specific habits (e.g., 'Uses em-dashes often', 'No Oxford comma', 'Starts sentences with And/But').\n"
            "- 'Vocabulary_Level': (String) e.g., 'Simple/Conversational', 'Complex/Academic'."
        )

        prompt = ChatPromptTemplate.from_messages([
            ("system", system_instruction),
            ("user", "Analyze these samples:\n\n{text}")
        ])

        chain = prompt | self.llm
        profile = {}
        try:
            response = chain.invoke({"text": combined_text})
            content = response.content.strip()
            # Try to find JSON block
            json_match = re.search(r"\{.*\}", content, re.DOTALL)
            if json_match:
                json_str = json_match.group(0)
                profile = json.loads(json_str)
            else:
                # If no brackets found, try raw (rare)
                profile = json.loads(content)
        except Exception as e:
            print(f"Profiler JSON Error: {e}")
            # Fallback profile
            profile = {
                "Sentence_Length_Variance": "Medium",
                "Tone": "Neutral",
                "Common_Connectors": [],
                "Quirks": ["Standard punctuation"],
                "Vocabulary_Level": "Standard"
            }

        # --- Q2 Implementation: Save numeric burstiness score from actual samples ---
        # This gives the Gatekeeper a precise, numeric target instead of a vague string.
        try:
            burstiness_score = calculate_burstiness(combined_text)
            profile["burstiness_score"] = round(burstiness_score, 3)
            print(f"    [Profiler] Saved numeric burstiness_score: {burstiness_score:.3f}")
        except Exception as e:
            print(f"    [Profiler] Could not compute burstiness_score: {e}")

        return profile
