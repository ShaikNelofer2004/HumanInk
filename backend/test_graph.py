from graph import app

print("--- Starting AI Humanizer Loop Test ---")

# Sample "Robotic" input input
input_text = ("""
I’m a Computer Science and Engineering undergraduate at SRM University AP with a strong focus on Artificial Intelligence and Machine Learning. I enjoy building real-world systems that combine AI with full-stack development, especially in areas like autonomous agents, fraud detection, and intelligent web applications.
 I’ve led an international collaboration project developing multi-agent AI systems inspired by Manus AI, where I worked on agent orchestration, reasoning pipelines, and system integration. I’ve also completed an AIML internship where I built an Online Fraud Detection System using XGBoost and deployed it as a Streamlit web app for real-time predictions.
 My technical stack includes Python, Java, C++, Flask, React, TensorFlow, PyTorch, LangChain, and databases like MySQL and MongoDB. I enjoy solving problems using DSA concepts and building scalable AI-driven applications. With a current GPA of 9.05, I’m highly motivated to learn, collaborate, and contribute meaningfully as an intern while gaining hands-on industry experience.
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

