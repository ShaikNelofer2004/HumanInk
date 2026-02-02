from graph import app

print("--- Starting AI Humanizer Loop Test ---")

# Sample "Robotic" input input
input_text = (
"In the rapidly evolving landscape of digital education, it is imperative to underscore the significance of personalized learning methodologies. Furthermore, the integration of adaptive technologies has revolutionized the pedagogical framework, allowing educators to tailor instruction to the unique needs of each student. Moreover, this paradigm shift not only enhances academic engagement but also fosters a culture of inclusivity within the classroom environment. Additionally, it is crucial to recognize that while technology serves as a powerful tool, the role of the teacher remains paramount in guiding the educational journey. In conclusion, the synergy between human mentorship and technological innovation creates a robust foundation for future learning endeavors")
inputs = {
    "input_text": input_text,
    "max_iterations": 3,
    "is_robotic": True, # Init state
    "style_samples": [
         "I’ve learned that progress doesn’t always come from big breakthroughs. Sometimes it’s just about showing up every day and making small improvements where you can.",
         "Technology moves quickly, but people don’t always move at the same pace. That’s why it’s important to build tools that actually help, not just impress.",
         "Good work takes patience. You test, you fail, you adjust, and you try again. Over time, those small efforts start adding up in ways you didn’t expect."
    ]
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

