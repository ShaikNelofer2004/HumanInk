<div align="center">
  <img src="assets/humanink.png" alt="HumanInk Logo" width="400"/>
  <h1>HumanInk </h1>
</div>

> **The AI Text Humanizer that doesn't just "rewrite" — it clones your style.**

![Status](https://img.shields.io/badge/Status-In_Development-blue)
![Python](https://img.shields.io/badge/Backend-FastAPI-green)
![AI](https://img.shields.io/badge/AI-Gemini_Flash-orange)
![Architecture](https://img.shields.io/badge/Architecture-Reflexion_Loop-purple)

**HumanInk** is a personalized AI writing assistant that rewrites and refines AI Generated text to match a specific human writing style, improving clarity, natural flow, and stylistic consistency while preserving the original meaning. Unlike generic rewriters that simply synonym-swap, HumanInk uses a **Reflexion Loop** — an iterative Draft → Critique → Refine pipeline — where a Writer agent generates text and a Critic agent evaluates it using quantitative linguistic metrics and semantic checks. The system repeats this loop until the output meets human-like quality thresholds or exits early when input is already sufficient.


---

## 🆚 Real-World Comparison

We took a standardized **ChatGPT-generated bio** and processed it through leading competitors (*"Humanise AI"* and *"aihumanize.io"*) versus **HumanInk**.

| Feature |  Humanise AI |  aihumanize.io |  HumanInk Result |
| :--- | :--- | :--- | :--- |
| **Opening Hook** | *"Presently, I am finishing..."* <br> *(Passive, wordy)* | *"I am a senior... **is** studying..."* <br> *(Grammar Error! Clunky)* | *"I’m currently an undergrad..."* <br> *(Direct, active, clean)* |
| **Sentence Structure** | *"One of the most favorite projects..."* <br> *(Awkward rhythm)* | *"...through the building of... where capabilities are applied in conjunction..."* <br> *(Painful run-on sentence)* | *"Lately, I’ve been leading..."* <br> *(Natural flow)* |
| **Tone** | *"Most of my time has been utilized to dive deep..."* <br> *(Robotic filler)* | *"My primary passion is... fortunate to lead..."* <br> *(Generic Cover Letter style)* | *"I love the challenge of building..."* <br> *(Authentic passion)* |
| **Verdict** | **FAIL:** Thesaurus shuffle. | **FAIL:** Structural & Grammar issues. | **WIN:** Sounds like a real person. |

---

## 🌟 The "Secret Sauce"

Most humanizers sound like "different AI." HumanInk sounds like **YOU**.

### 1. The Personal Style Profiler 🕵️‍♂️
Before writing anything, the **Profiler Agent** analyzes your past writing to extract your unique **Style Fingerprint**:
*   **Sentence Rhythm:** Do you use punchy short sentences? or long, academic ones?
*   **Vocabulary:** Do you use formal or casual words?
*   **Quirks:** Do you use em-dashes? Do you start sentences with "And"?

### 2. The Writer (The Drafter) ✍️
The **Writer Agent** generates the actual content using your extracted *Style Fingerprint*.
*   **Chain-of-Thought (CoT):** It uses reasoning to first "Plan" edits to match your style before generating the final draft, ensuring much higher quality output.
*   **Adversarial Looping:** If the draft is rejected later in the pipeline, the Writer receives specific feedback on what to change and rewrites it.

### 3. The Gatekeeper (The Double Gate) 🚪
Before deciding if a rewrite was successful (or if the original text was already good enough), the **Gatekeeper Agent** screens the text:
*   **Gate A (The Math Gate):** Filters obviously robotic text. Normal text needs Burstiness > **4.0**. Dense text (Avg > 20 words/sentence) needs Burstiness > **7.0**.
*   **Gate B (The Semantic Gate):** Uses an LLM to ensure the text isn't gaming the math. It catches grammar errors, run-on sentences, and AI phrase watermarks.

### 4. The Critic (The Judge) ⚖️
If the Gatekeeper passes the text loop, the **Critic Agent** evaluates the draft mathematically using a **Human Score (0-100)**:
> **Formula:** `(Burstiness * 0.4) + (Vocabulary * 0.3) + (Coherence * 0.3)`
*   **Burstiness (40%):** Variance in sentence length.
*   **Vocabulary (30%):** Ratio of unique words (prevents repetition).
*   **Coherence (30%):** Ensuring the text fundamentally makes sense.
*   **Threshold:** A score of **< 75** means the Writer must rewrite again.

---

## 🏗️ Architecture

![Architecture Diagram](assets/HumanInk_Arch.png)

---

## 🛠️ Tech Stack

*   **Backend:** Python (FastAPI)
*   **Orchestration:** LangGraph (Cyclic flow control)
*   **AI Models:**
    *   **Writer/Profiler:** Gemini Flash Preview (High Speed/Creativity)
    *   **Critic:** Llama 3.3 70B (State-of-the-Art Reasoning)
    *   **Gatekeeper:** Llama 3.1 8B (High-Speed Classification)
*   **Analysis Tools:** `nltk`, `textstat`, `numpy`

---

## 🚀 Getting Started

### Prerequisites
*   Python 3.10+
*   Gemini API Key (Google AI Studio)
*   Groq API Key (for Llama 3)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ShaikNelofer2004/humanink.git
    cd humanink
    ```

2.  **Install Backend Dependencies:**
    ```bash
    cd backend
    pip install -r requirements.txt
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in `backend/`:
    ```env
    GOOGLE_API_KEY=your_gemini_key_here
    GROQ_API_KEY=your_groq_key_here
    OPENROUTER_API_KEY=your_openrouter_key_here
    GROQ_API_KEY_GATEKEEPER=your_gatekeeper_key_here
    
    ```

4.  **Run the Profiler Test:**
    ```bash
    python backend/test_profiler.py
    ```

5.  **Run the Graph Test:**
    ```bash
    python backend/test_graph.py
    ```   

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch: `git checkout -b feature/your-feature-name`.
3.  Make your changes and commit them: `git commit -m 'Add some feature'`.
4.  Push to the branch: `git push origin feature/your-feature-name`.
5.  Submit a pull request.
