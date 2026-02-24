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

### 1. The Profiler Agent 🕵️‍♂️
Before writing anything, the **Profiler Agent** processes user samples to extract a unique **Style Fingerprint**:
*   **Sentence Rhythm:** Do you use punchy short sentences? or long, academic ones?
*   **Vocabulary:** Do you use formal or casual words?
*   **Quirks:** Do you use em-dashes? Do you start sentences with "And"?

### 2. The Gatekeeper 🚪
When input text is submitted, it first passes through the Gatekeeper to see if it even *needs* to be rewritten, saving time and tokens. It uses a two-step check:
*   **Math Gate (Adaptive Math):** Filters obviously robotic text mathematically. Normal text needs Burstiness > **4.0**. Dense/Academic text needs Burstiness > **7.0**. If this fails, the text is sent to the Writer.
*   **LLM Gatekeeper (Semantic Intelligence):** If the math passes, an LLM checks for grammar errors, robotic flow, and AI watermarks. If it passes this, the text goes straight to the **Final Output**. If not, it enters the Loop.

### 3. The Reflexion Loop (Writer & Critic) ⚔️
If the text fails the Gatekeeper, it enters an iterative refinement loop until it reaches human-level quality.

#### A. The Writer Agent (The Drafter) ✍️
*   **Chain-of-Thought Planning:** The Writer uses reasoning to "Plan" edits to match the exact *Style Fingerprint* before generating the draft.
*   **Style Injection:** It actively applies your quirks and vocabulary to the generated text.

#### B. The Critic Agent (Dual-Brain Evaluation) ⚖️
The Critic evaluates the Writer's draft using two "brains" to calculate a **Weighted Score**:
*   **Math Brain (NLTK/TextStat):** Checks Burstiness (40% weight) and Vocabulary/Unique Words (30% weight).
*   **Editor Brain (LLM Coherence):** Ensures the text fundamentally makes syntactic sense (30% weight).
*   **The Verdict:** If the combined score is **> 75**, the text is approved and sent to **Final Output**. If it's less, the Critic sends feedback back to the Writer to **Refine** it again.

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
