from typing import TypedDict, Annotated, List, Dict, Any
from langgraph.graph import StateGraph, END
from agents import WriterAgent, CriticAgent, ProfilerAgent
from utils import calculate_burstiness

# Define the State of the Graph
class AgentState(TypedDict):
    input_text: str
    style_samples: List[str]  # Optional: User provided samples
    style_profile: Dict[str, Any]       # Extracted or Default profile
    current_draft: str
    critique_feedback: str
    iteration_count: int
    max_iterations: int
    is_robotic: bool
    skip_rewriting: bool # New flag for Early Exit

# Initialize Agents
writer = WriterAgent()
critic = CriticAgent()
profiler = ProfilerAgent()

def pre_critic_node(state: AgentState):
    """
    Step 0: Pre-Critic Analysis.
    Check if the input text is ALREADY human enough.
    """
    print("--- Node: Pre-Critic (Early Analysis) ---")
    burstiness = calculate_burstiness(state["input_text"])
    print(f"    Input Burstiness: {burstiness:.2f}")
    
    import numpy as np
    from nltk.tokenize import sent_tokenize, word_tokenize
    
    sentences = sent_tokenize(state["input_text"])
    lengths = [len(word_tokenize(s)) for s in sentences]
    avg_length = np.mean(lengths) if lengths else 0
    
    # --- 1. SMART THRESHOLDS (The Math Gate) ---
    import numpy as np
    from nltk.tokenize import sent_tokenize, word_tokenize
    
    sentences = sent_tokenize(state["input_text"])
    lengths = [len(word_tokenize(s)) for s in sentences]
    avg_length = np.mean(lengths) if lengths else 0
    
    print(f"    Avg Sentence Length: {avg_length:.2f}")

    # Intelligent Thresholding
    # If text is "Dense/Academic" (Avg Length > 20), require higher burstiness to pass.
    required_burstiness = 7.0 if avg_length > 20 else 4.0

    if burstiness < required_burstiness:
        print(f"    >> FAILED Math Check (Burstiness {burstiness:.2f} < {required_burstiness}). Rewrite required.")
        return {"skip_rewriting": False}

    print(f"    >> PASSED Math Check. Verifying with Gatekeeper...")

    # --- 2. LLM GATEKEEPER (The Semantic Gate) ---
    # Uses a separate Groq Key to avoid rate-limit clashes
    from langchain_groq import ChatGroq
    from langchain_core.prompts import ChatPromptTemplate
    import os
    
    gatekeeper_key = os.getenv("GROQ_API_KEY_GATEKEEPER")
    if not gatekeeper_key:
        print("    !! Missing GROQ_API_KEY_GATEKEEPER. Skipping Gatekeeper check (since Math passed).")
        return {"skip_rewriting": True, "current_draft": state["input_text"], "is_robotic": False, "style_profile": {}}

    llm = ChatGroq(
        model_name="llama-3.1-8b-instant", 
        temperature=0.0,
        api_key=gatekeeper_key
    )
    
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
        chain = prompt | llm
        response = chain.invoke({"text": state["input_text"]})
        import json, re
        # Regex extract JSON
        json_match = re.search(r"\{.*\}", response.content, re.DOTALL)
        if json_match:
            result = json.loads(json_match.group(0))
            needs_humanization = result.get("needs_humanization", True) # Default to True (Rewrite) if unsure
            reason = result.get("reason", "Unknown")
            
            if needs_humanization:
                print(f"    (Gatekeeper) 🛑 Text needs work: {reason}")
                return {"skip_rewriting": False}
            else:
                print(f"    (Gatekeeper) ✅ Text is High-Quality Human: {reason}")
                return {
                    "skip_rewriting": True, 
                    "current_draft": state["input_text"], 
                    "is_robotic": False,
                    "style_profile": {} 
                }
    except Exception as e:
        print(f"    !! Gatekeeper Error: {e}. Proceeding to rewrite to be safe.")
        return {"skip_rewriting": False}

    # If we get here, something weird happened, just rewrite
    return {"skip_rewriting": False}

def profiler_node(state: AgentState):
    """
    Step 1: Determine the style profile.
    """
    samples = state.get("style_samples", [])
    
    if samples:
        print("--- Node: Profiler (Extracting Style) ---")
        profile = profiler.extract_style(samples)
    else:
        print("--- Node: Profiler (Using Default) ---")
        profile = {
            "tone": "Natural, Balanced",
            "sentence_structure": "Varied length, mix of simple and compound sentences.",
            "quirks": "Uses contractions (e.g., 'don't' instead of 'do not'). Avoids overly formal transition words."
        }
    
    return {"style_profile": profile, "iteration_count": 0, "current_draft": state["input_text"]}

def writer_node(state: AgentState):
    """
    Step 2: Generate a draft.
    Fallback Logic: If writer returns empty, keep previous draft.
    """
    print(f"--- Node: Writer (Iteration {state['iteration_count'] + 1}) ---")
    
    # Generate draft
    draft = writer.write_draft(
        input_text=state["input_text"], # Always rewrite original source
        style_profile=state.get("style_profile"),
        feedback=state.get("critique_feedback")
    )
    
    # Fallback: Validation
    if not draft or not draft.strip():
        print("    !! Writer returned empty draft. Falling back to previous version !!")
        draft = state["current_draft"]
        
    return {
        "current_draft": draft, 
        "iteration_count": state["iteration_count"] + 1
    }

def critic_node(state: AgentState):
    """
    Step 3: Evaluate the draft.
    """
    print("--- Node: Critic (Evaluating) ---")
    result = critic.evaluate(state["current_draft"], human_threshold=5.0)
    
    print(f"    Verdict: {'ROBOTIC' if result['is_robotic'] else 'HUMAN'}")
    print(f"    Score: {result.get('score', 'N/A')}")
    print(f"    Feedback: {result['feedback']}")
    
    return {
        "is_robotic": result["is_robotic"],
        "critique_feedback": result["feedback"]
    }

def should_start_process(state: AgentState):
    """
    Condition: Pre-Critic check.
    """
    if state.get("skip_rewriting"):
        return "end"
    return "continue"

def should_continue_loop(state: AgentState):
    """
    Condition: Post-Critic loop check.
    """
    if not state["is_robotic"]:
        return "end"
    if state["iteration_count"] >= state["max_iterations"]:
        print("--- Max Iterations Reached ---")
        return "end"
    return "continue"

# Build the Graph
workflow = StateGraph(AgentState)

workflow.add_node("pre_critic", pre_critic_node)
workflow.add_node("profiler", profiler_node)
workflow.add_node("writer", writer_node)
workflow.add_node("critic", critic_node)

# Entry Point
workflow.set_entry_point("pre_critic")

# Conditional Edge 1: Pre-Critic -> Profiler OR End
workflow.add_conditional_edges(
    "pre_critic",
    should_start_process,
    {
        "continue": "profiler",
        "end": END
    }
)

# Standard Edges
workflow.add_edge("profiler", "writer")
workflow.add_edge("writer", "critic")

# Conditional Edge 2: Critic -> Writer OR End (Loop)
workflow.add_conditional_edges(
    "critic",
    should_continue_loop,
    {
        "continue": "writer",
        "end": END
    }
)

# Compile
app = workflow.compile()
