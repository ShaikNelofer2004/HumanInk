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
    
    if burstiness >= 4.0:
        print("    >> Text is sufficiently human. Skipping rewrite.")
        return {
            "skip_rewriting": True, 
            "current_draft": state["input_text"], 
            "is_robotic": False,
            "style_profile": {} # Not needed
        }
    
    print("    >> Text needs humanization. Proceeding to Profiler.")
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
