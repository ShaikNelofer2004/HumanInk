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
        
        is_academic = style_profile and style_profile.get("academicMode") or \
                      (style_profile and style_profile.get("tone") == "Academic")
        
        latex_note = style_profile.get("latex_note", "") if style_profile else ""
        depth_instruction = style_profile.get("paraphrase_depth_instruction", "") if style_profile else ""

        if is_academic:
            section_rules = style_profile.get("section_writer_rules", "") if style_profile else ""
            section_label = style_profile.get("section_label", "General Academic") if style_profile else "General Academic"

            system_instruction = (
                "You are an expert academic ghostwriter. Your ONLY job is to REWRITE the provided text "
                "to sound authentically human while preserving the academic register and field-appropriate vocabulary.\n\n"
                "**CRITICAL RULES:**\n"
                "1. NEVER write about what you are doing. NEVER say 'I've put together...' or 'Here is a draft...' "
                "or 'Let me know if you need tweaks.' Just output the rewritten text ONLY.\n"
                "2. ONLY rewrite the PROSE parts. Do NOT modify, remove, or 'explain' any <<LATEX_*>> placeholders "
                "you see — copy them verbatim into the exact same position in your output.\n"
                "3. Vary sentence length — mix short punchy sentences with longer analytical ones.\n"
                "4. Remove AI boilerplate: 'Furthermore', 'Moreover', 'It is evident that', 'In conclusion'.\n"
                "5. Maintain academic credibility — do NOT make the text casual or conversational.\n"
                "6. Do NOT add new content, citations, or claims not in the original.\n\n"
                f"**SECTION-SPECIFIC RULES ({section_label.upper()}):**\n"
                f"{section_rules}\n\n"
                "**FORMAT:**\n"
                "---THOUGHTS---\n"
                f"(Brief note: which section is this [{section_label}], and 2-3 robotic patterns you are fixing)\n"
                "---DRAFT---\n"
                "(Your rewritten academic text ONLY — no preamble, no commentary)"
            )
            if latex_note:
                system_instruction += f"\n\n{latex_note}"
            if depth_instruction:
                system_instruction += f"\n\n**REWRITE INTENSITY:**\n{depth_instruction}"
        else:
            system_instruction = (
                "You are a professional ghostwriter. Your goal is to rewrite the input text to sound completely human. "
                "You MUST avoid robotic patterns, repetitive sentence structures, and 'AI watermark' words (like 'delve', 'moreover').\n\n"
                "**CRITICAL RULES:**\n"
                "1. NEVER write meta-commentary. Output the rewritten text ONLY.\n"
                "2. Vary sentence length significantly.\n"
                "3. Remove transition boilerplate words entirely.\n\n"
                "**STRATEGY: Chain-of-Thought (CoT)**\n"
                "1. **ANALYZE:** First, identify 3 specific robotic patterns in the input.\n"
                "2. **PLAN:** List 3 specific changes you will make to match the style.\n"
                "3. **EXECUTE:** Write the final draft.\n\n"
                "**FORMAT:**\n"
                "---THOUGHTS---\n"
                "(Your analysis and plan here)\n"
                "---DRAFT---\n"
                "(Your final rewritten text here)"
            )
            if depth_instruction:
                system_instruction += f"\n\n**REWRITE INTENSITY:**\n{depth_instruction}"

        if style_profile:
            system_instruction += (
                "\n\nSTRICTLY FOLLOW THIS STYLE PROFILE:\n{style_json}\n\n"
                "CRITICAL: You MUST explicitly use the exact 'Quirks' and 'Common_Connectors' listed in the style profile! "
                "If the profile says 'Uses em-dashes', you MUST use em-dashes. "
                "If it says 'No Oxford comma', you MUST remove them. "
                "Failure to adopt these exact stylistic habits is a failure of your primary directive."
            )
        
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
