from graph import app

print("--- Starting AI Humanizer Loop Test ---")

# Sample "Robotic" input input
input_text = ("""
I am a senior at SRM University AP is studying Computer Science and Engineering, and my primary passion is developing AI and ML solutions through the building of robust real-world systems where the capabilities of AI are applied in conjunction with the capabilities of a full-stack application (i.e., autonomous agents, fraud detection solutions, and intelligent web apps).
I have been fortunate to lead an international collaboration project to develop a multi-agent AI system inspired by Manus AI, which required the design and implementation of agent orchestration, reasoning pipelines, and system integration, as well as an AIML internship building an XGBoost online fraud detection system and deploying it as a Streamlit web app to provide real-time prediction capabilities.
I have an excellent technical background, with a primary skill set in Python, Java, C++, Flask, React, TensorFlow, PyTorch, LangChain, and numerous databases (MySQL, MongoDB). I enjoy applying problem-solving techniques using DSA principles and developing scalable AI-driven applications. My current GPA is 9.05, I am motivated and willing to learn, collaborate and contribute to the internship experience and gain practical working knowledge of the industry.
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

