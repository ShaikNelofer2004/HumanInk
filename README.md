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

## 🌟 The "Secret Sauce"

Most humanizers sound like "different AI." HumanInk sounds like **YOU**.

### 1. The Personal Style Profiler 🕵️‍♂️
Before writing a single word, our **Profiler Agent** analyzes your past writing (emails, essays, blogs) to extract your unique **Style Fingerprint**:
*   **Sentence Rhythm:** Do you use punchy short sentences? or long, academic ones?
*   **Vocabulary:** Do you say "utilize" or "use"?
*   **Quirks:** Do you use em-dashes? Do you start sentences with "And"?

### 2. The Adversarial Loop (Writer vs. Critic) ⚔️
We don't just output the first draft. We simulate an editor-writer fight:
*   **The Writer (Agent A):** Drafts content using your *Style Fingerprint*. Now uses **Chain-of-Thought (CoT)** reasoning to "Plan" edits before writing, ensuring higher quality.
*   **The Critic (Agent B):** An aggressive "Detective" agent that uses **Weighted Scoring** to evaluate text quality (Burstiness + Vocabulary + Coherence).
*   **The Loop:** If the Critic says "Too robotic (Variance < 3.0)", the Writer **rewrites it** until it passes.

### 3. Smart Thresholds (The Semantic Gate) 🧠
We don't just rely on one number. The **Pre-Critic Gate** intelligently adapts its strictness:
*   **Normal Text:** Requires Burstiness > **4.0**.
*   **Dense/Academic Text:** If sentences are long (Avg > 20 words), we insist on higher variance (Burstiness > **7.0**) to prevent "pseudo-intellectual" AI patterns from slipping through.
*   **AI Watermarks:** If words like "delve" or "landscape" appear, we **force a rewrite** regardless of the score.

---

## 🏗️ Architecture

```mermaid
graph TD

    User((User)) -->|Provides Input Text| PreCritic[Pre-Critic Gate]

    PreCritic -->|Checks Semantics Density| DecisionGate{Safe?}
    DecisionGate -->|Yes - High Burstiness| Output[Final Output Early Exit]
    DecisionGate -->|No - AI Detected| Writer[WAS Writer Agent]

    User -->|Optional Writing Samples| Profiler

    Profiler -->|Creates Style Profile JSON| Style[Style Fingerprint]

    Style -->|Inject Style| Writer[WAS Writer Agent]

    Writer -->|Draft| Critic[CAS Critic Agent]

    Critic -->|Mathematician Brain| Tools[Python Tools NLTK TextStat]
    Tools -->|Burstiness Score| Critic

    Critic -->|Editor Brain| SemanticCheck[LLM Coherence Check]

    Critic --> Decision{Human Quality Met}

    Decision -->|No Burstiness < 5.0| Writer
    Decision -->|Yes| Output


```

---

## 🛠️ Tech Stack

*   **Backend:** Python (FastAPI)
*   **Orchestration:** LangGraph (Cyclic flow control)
*   **AI Models:**
    *   **Writer/Profiler:** Gemini Flash Preview (High Speed/Creativity)
    *   **Critic:** Llama 3 70B (via Groq) + Python Analysis Tools
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
    git clone https://github.com/yourusername/humanink.git
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
    
    ```

4.  **Run the Profiler Test:**
    ```bash
    python backend/test_profiler.py

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


