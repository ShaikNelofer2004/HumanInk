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
**Goal:** Learn *how* you write, not just *what* you write.
Before rewriting anything, the **Profiler Agent** (powered by Llama-3.3-70B) processes a set of your writing samples to extract a unique **Style Fingerprint**. It looks beyond simple tone and focuses on the mechanics of your writing:
*   **Sentence Rhythm:** Do you heavily favor punchy, rapid-fire sentences, or do you lean towards long, academically structured compound sentences?
*   **Vocabulary:** Do you use formal, elevated language ("utilize," "moreover"), or do you prefer casual, everyday terminology?
*   **Quirks & Habits:** Do you overuse em-dashes? Do you frequently start sentences with conjunctions like "And" or "But"? Are you a strict adherent to the Oxford comma?

### 2. The Gatekeeper 🚪
**Goal:** Don't fix what isn't broken.
When input text is submitted, it first passes through the Gatekeeper. This multi-stage screening prevents unnecessary API calls and time-consuming rewriting if the text is already "human enough."
*   **Stage 1: Adaptive Math:** This is a deterministic mathematical filter. If the text is a generally standard email or paragraph (Avg Sentence Length < 20), it requires a Burstiness score of **> 4.0**. If it's a dense academic paper (Avg Sentence Length > 20), it demands a higher Burstiness score of **> 7.0**, as AI models notoriously generate monotonous dense text.
*   **Stage 2: Semantic Intelligence:** If the math checks out, a high-speed LLM (Llama-3.1-8B) semantically analyzes the text. It actively searches for grammar errors, awkward run-on sentences, and glaring "AI Watermarks" (words like *delve*, *tapestry*, *testament*). 
*   **The Routing:** If the text survives both stages, it skips the entire loop and goes straight to the **Final Output**. If it fails, it is passed to the Writer.

### 3. The Reflexion Loop (Writer & Critic) ⚔️
**Goal:** The Adversarial Showdown.
If the text fails the Gatekeeper, it enters an iterative refinement loop. Here, two agents battle it out until the text reaches a human-level threshold.

#### A. The Writer Agent (The Drafter) ✍️
*   **Chain-of-Thought Planning:** The Writer uses a CoT process to "Plan" its edits first. It reviews the original text, reviews your *Style Fingerprint*, and plans 3 specific changes before generating the actual draft.
*   **Style Injection:** It actively applies your quirks and vocabulary choices to the generated draft, attempting to perfectly mimic your voice while maintaining the original meaning.

#### B. The Critic Agent (Dual-Brain Evaluation) ⚖️
The Critic mathematically and semantically evaluates the Writer's draft to calculate a nuanced **Human Score (0-100)**:
*   **Math Brain:** Uses NLTK and TextStat to evaluate Burstiness (40% weight) and the ratio of Unique Words (30% weight) to prevent repetitive phrasing.
*   **Editor Brain:** Uses an LLM to ensure the text fundamentally makes syntactic sense and is coherent (30% weight).
*   **The Verdict:** If the final score is **> 75**, the text escapes the loop and is sent to **Final Output**. If it's **< 75**, the Critic rejects the draft and sends specific, actionable feedback back to the Writer to **Refine** the text again. This continues until the threshold is met.

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
