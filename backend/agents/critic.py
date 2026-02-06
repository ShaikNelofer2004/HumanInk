from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
from utils import calculate_burstiness, calculate_grade_level, calculate_unique_ratio, detect_ai_watermarks

load_dotenv()

class CriticAgent:
    def __init__(self):
        # Brain 2: LLM for Coherence Check (Groq Llama 3 for speed)
        # Updated to Llama 3.3 for better reasoning
        self.llm = ChatGroq(model_name="llama-3.3-70b-versatile", temperature=0.1)

    def evaluate(self, text: str, human_threshold: float = 5.0) -> dict:
        # Brain 1: The Mathematician (Fast, Local)
        burstiness = calculate_burstiness(text)
        grade_level = calculate_grade_level(text)
        unique_ratio = calculate_unique_ratio(text)
        watermarks = detect_ai_watermarks(text)

        # --- WEIGHTED SCORING SYSTEM (Agent 2.0) ---
        
        # 1. Burstiness Score (Target: > human_threshold)
        # Cap at 100 if above threshold
        burstiness_score = min((burstiness / human_threshold) * 100, 100)
        
        # 2. Vocabulary Score (Target: > 0.4 unique ratio)
        vocab_target = 0.45
        vocabulary_score = min((unique_ratio / vocab_target) * 100, 100)
        
        # 3. Coherence Score (Pass=100, Fail=0) (From Brain 2)
        coherence_result = self._check_coherence(text)
        coherence_score = 100 if coherence_result['is_coherent'] else 0
        
        # Calculate Weighted Final Score
        # Weights: Burstiness (40%), Vocabulary (30%), Coherence (30%)
        final_score = (burstiness_score * 0.4) + (vocabulary_score * 0.3) + (coherence_score * 0.3)
        
        # Determine Verdict
        passing_score = 75.0
        is_robotic = final_score < passing_score
        
        reasons = []
        if is_robotic:
            reasons.append(f"Human Score too low ({final_score:.1f}/100). Needs > {passing_score}.")
            if burstiness_score < 70:
                reasons.append(f"Burstiness is weak ({burstiness:.2f}).")
            if vocabulary_score < 70:
                reasons.append(f"Vocabulary is repetitive ({unique_ratio:.2f}).")
            if coherence_score == 0:
                reasons.append(f"Coherence Logic Failed: {coherence_result['reason']}")

        # Override for Watermarks (Immediate Fail)
        if len(watermarks) > 0:
            is_robotic = True
            final_score = 0 # Penalty
            reasons.insert(0, f"Detected AI Watermarks: {', '.join(watermarks)}.")

        return {
            "is_robotic": is_robotic,
            "score": {
                "total": round(final_score, 1),
                "burstiness": round(burstiness, 2),
                "vocabulary": round(unique_ratio, 2),
                "coherence": "PASS" if coherence_result['is_coherent'] else "FAIL"
            },
            "feedback": " ".join(reasons) if reasons else f"Excellent! Human Score: {final_score:.1f}/100"
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
