import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv

load_dotenv()

class WriterAgent:
    def __init__(self):
        # Using Gemini 1.5 Pro for high creativity
        self.llm = ChatGoogleGenerativeAI(model="gemini-3-flash-preview", temperature=0.9)

    def write_draft(self, input_text: str, style_profile: dict = None, feedback: str = None) -> str:
        
        system_instruction = (
            "You are a professional ghostwriter. Your goal is to rewrite the input text to sound completely human. "
            "You MUST avoid robotic patterns, repetitive sentence structures, and 'AI watermark' words (like 'delve', 'moreover').\n\n"
            "**STRATEGY: Chain-of-Thought (CoT)**\n"
            "1. **ANALYZE:** First, identify 3 specific robotic patterns in the input.\n"
            "2. **PLAN:** List 3 specific changes you will make to match the style.\n"
            "3. **EXECUTE:** Write the final draft.\n\n"
            "**FORMAT:**\n"
            "You must output your response in two clearly separated sections:\n"
            "---THOUGHTS---\n"
            "(Your analysis and plan here)\n"
            "---DRAFT---\n"
            "(Your final rewriten text here)"
        )

        # Use a placeholder for style profile to avoid brace escaping hell
        if style_profile:
            system_instruction += "\n\nSTRICTLY FOLLOW THIS STYLE PROFILE:\n{style_json}"
        
        user_prompt = "Rewrite the following text:\n\n{input_text}"

        if feedback:
            user_prompt += f"\n\nCRITICAL FEEDBACK FROM PREVIOUS ATTEMPT (FIX THIS): {feedback}"

        prompt = ChatPromptTemplate.from_messages([
            ("system", system_instruction),
            ("user", user_prompt)
        ])

        # Prepare inputs
        chain_inputs = {"input_text": input_text}
        if style_profile:
            chain_inputs["style_json"] = json.dumps(style_profile, indent=2)

        chain = prompt | self.llm
        result = chain.invoke(chain_inputs)
        content = result.content
        if isinstance(content, list):
            content = " ".join([block['text'] for block in content if 'text' in block])
        
        content = str(content)

        # Parse Logic: Separate Thoughts from Draft
        final_draft = content
        if "---DRAFT---" in content:
            parts = content.split("---DRAFT---")
            thoughts = parts[0].replace("---THOUGHTS---", "").strip()
            final_draft = parts[1].strip()
            
            print(f"\n[Writer CoT]\n{thoughts}\n")
        
        return final_draft
