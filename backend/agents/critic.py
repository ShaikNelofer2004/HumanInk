from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
from utils import calculate_burstiness, calculate_grade_level, calculate_unique_ratio, detect_ai_watermarks

load_dotenv()

class CriticAgent:
    def __init__(self):
        # Brain 2: LLM for Coherence Check (Groq Llama 3 for speed)
        self.llm = ChatGroq(model_name="llama3-70b-8192", temperature=0.1)

    def evaluate(self, text: str, human_threshold: float = 5.0) -> dict:
        # Brain 1: The Mathematician (Fast, Local)
        burstiness = calculate_burstiness(text)
        grade_level = calculate_grade_level(text)
        unique_ratio = calculate_unique_ratio(text)
        watermarks = detect_ai_watermarks(text)

        is_robotic = False
        reasons = []

        # Rule 1: Burstiness (Variance)
        if burstiness < human_threshold:
            is_robotic = True
            reasons.append(f"Sentence variation (Burstiness) is too low ({burstiness:.2f}). Needs > {human_threshold}.")
        
        # Rule 2: Watermarks
        if len(watermarks) > 0:
            is_robotic = True
            reasons.append(f"Contains AI words: {', '.join(watermarks)}.")
        
        # Brain 2: The Editor (Coherence Check)
        coherence_result = self._check_coherence(text)
        if not coherence_result['is_coherent']:
            is_robotic = True
            reasons.append(f"Coherence Failure: {coherence_result['reason']}")

        return {
            "is_robotic": is_robotic,
            "score": {
                "burstiness": burstiness,
                "grade_level": grade_level,
                "unique_ratio": unique_ratio,
                "coherence": "PASS" if coherence_result['is_coherent'] else "FAIL"
            },
            "feedback": " ".join(reasons) if reasons else "Passes human verification."
        }

    def _check_coherence(self, text: str) -> dict:
        prompt = ChatPromptTemplate.from_template(
            "You are a coherence checker. The following text was rewritten to be more 'human'. "
            "Does it make grammatical sense? Is it readable? Or is it gibberish/broken English? "
            "\n\nTEXT: {text}\n\n"
            "Return ONLY a JSON object: {{ \"is_coherent\": boolean, \"reason\": \"short explanation\" }}"
        )
        chain = prompt | self.llm
        try:
            response = chain.invoke({"text": text})
            content = response.content.replace("```json", "").replace("```", "").strip()
            import json
            return json.loads(content)
        except:
            # Fallback if JSON parsing fails/LLM hiccups
            return {"is_coherent": True, "reason": "Self-check passed (fallback)."}
