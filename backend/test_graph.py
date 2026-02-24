from graph import app

print("--- Starting AI Humanizer Loop Test ---")

# Sample "Robotic" input (Low Burstiness)
# Sentences have almost identical lengths (6-7 words) to trigger Math Fail.
input_text = ("""
I want to work in your company because it aligns well with my technical background and the kind of real-world problems I’m interested in solving. Through my internships and projects, I’ve worked extensively on AI/ML systems, backend development, and applied machine learning—especially in areas like fraud detection, NLP, and multi-agent AI platforms.

Your company’s focus on building scalable, production-ready technology matches my experience of taking models beyond theory—designing pipelines, evaluating performance, and deploying solutions using tools like Python, FastAPI, Flask, and ML frameworks. I’m particularly interested in contributing to teams where I can apply my problem-solving skills, learn from experienced engineers, and work on systems that have real impact.

Overall, I see this role as a strong opportunity to grow as a software/AI engineer while adding value through my hands-on experience, strong fundamentals, and willingness to learn.
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

