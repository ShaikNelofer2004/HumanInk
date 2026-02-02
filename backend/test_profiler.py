from agents.profiler import ProfilerAgent
import json

def test_profiler():
    print("--- Initializing Profiler Agent ---")
    profiler = ProfilerAgent()
    
    # Sample text: Mimicking a specific style (e.g., fast-paced, tech-bro)
    samples = [
         "I’ve learned that progress doesn’t always come from big breakthroughs. Sometimes it’s just about showing up every day and making small improvements where you can.",
         "Technology moves quickly, but people don’t always move at the same pace. That’s why it’s important to build tools that actually help, not just impress.",
         "Good work takes patience. You test, you fail, you adjust, and you try again. Over time, those small efforts start adding up in ways you didn’t expect."
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
