from graph import app

print("--- Starting AI Humanizer Loop Test ---")

# Sample "Robotic" input (Low Burstiness)
# Sentences have almost identical lengths (6-7 words) to trigger Math Fail.
input_text = ("""
The project was completed on time.
The team worked very hard daily.
The code is clean and efficient.
I am happy with the result.
The testing phase is now finished.
""")
inputs = {
    "input_text": input_text,
    "max_iterations": 3,
    "is_robotic": True, # Init state
    "style_samples": []
}

# Run the graph
final_draft = ""
# 'recursion_limit' protects against infinite loops if logic fails
for output in app.stream(inputs, {"recursion_limit": 10}):
    # stream returns dictionaries with key = node_name, value = node_return
    for key, value in output.items():
        print(f"Finished Step: {key}")
        if key == "pre_critic":
            if value.get('skip_rewriting'):
                final_draft = value['current_draft']
                print(f"    >> Early Exit Triggered: {final_draft[:50]}...")

        if key == "writer":
            final_draft = value['current_draft']
            print(f"Draft: {final_draft}") # Print full draft
        if key == "critic":
            print(f"Feedback: {value.get('critique_feedback')}")

print("\n--- Loop Finished ---")
print("\n=== FINAL OUTPUT ===")
print(final_draft)

