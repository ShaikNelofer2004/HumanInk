from agents.profiler import ProfilerAgent
import json

def test_profiler():
    print("--- Initializing Profiler Agent ---")
    profiler = ProfilerAgent()
    
    # Sample text: Mimicking a specific style (e.g., fast-paced, tech-bro)
    samples = [
        "Look, we just need to ship it. Speed is everything. If we break things, fine. We fix them later.",
        "The market moves fast. You blink, you lose. I don't care about clean code right now, I care about user acquisition.",
        "It's simple math. Growth hacking is just finding the leverage point. So let's find it, pull it, and see what happens."
    ]
    
    print(f"--- analyzing {len(samples)} samples ---")
    profile = profiler.extract_style(samples)
    
    print("\n--- Extracted Style Profile ---")
    print(json.dumps(profile, indent=2))

    # Basic Validation
    expected_keys = ["Sentence_Length_Variance", "Tone", "Common_Connectors", "Quirks", "Vocabulary_Level"]
    missing = [k for k in expected_keys if k not in profile]
    
    if missing:
        print(f"\n[FAIL] Missing keys: {missing}")
    else:
        print("\n[PASS] All keys present.")

if __name__ == "__main__":
    test_profiler()
