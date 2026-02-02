import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv

load_dotenv()

class ProfilerAgent:
    def __init__(self):
        # Brain 3: The Profiler (Deep Analysis)
        # Uses Gemini 1.5 Pro because style extraction requires high reasoning capabilities.
        self.llm = ChatGoogleGenerativeAI(model="gemini-3-flash-preview", temperature=0.5)

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
        try:
            response = chain.invoke({"text": combined_text})
            # Clean possible markdown
            content = response.content.replace("```json", "").replace("```", "").strip()
            return json.loads(content)
        except Exception as e:
            print(f"Profiler Error: {e}")
            # Fallback profile
            return {
                "Sentence_Length_Variance": "Medium",
                "Tone": "Neutral",
                "Common_Connectors": [],
                "Quirks": ["Standard punctuation"],
                "Vocabulary_Level": "Standard"
            }
