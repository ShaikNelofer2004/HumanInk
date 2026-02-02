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
            "You MUST avoid robotic patterns, repetitive sentence structures, and 'AI watermark' words (like 'delve', 'moreover')."
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
            # Handle Gemini's list of content blocks
            return " ".join([block['text'] for block in content if 'text' in block])
        return str(content)
