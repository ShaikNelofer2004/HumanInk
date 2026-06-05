<div align="center">
  <img src="assets/humanink.png" alt="HumanInk Logo" width="400"/>
  <h1>HumanInk</h1>
  <p><strong>The AI Text Humanizer that doesn't just "rewrite" — it clones your style.</strong></p>
</div>

![Status](https://img.shields.io/badge/Status-Active_Development-blue)
![Python](https://img.shields.io/badge/Backend-FastAPI-green)
![Frontend](https://img.shields.io/badge/Frontend-React_+_Vite-61dafb)
![AI](https://img.shields.io/badge/AI-Gemini_Flash-orange)
![Architecture](https://img.shields.io/badge/Architecture-Reflexion_Loop-purple)
![LaTeX](https://img.shields.io/badge/Academic_Mode-LaTeX_Safe-emerald)

**HumanInk** is a multi-agent AI pipeline that rewrites LLM-generated text to authentically match a user's unique human neural rhythm. Unlike generic rewriters that simply synonym-swap, HumanInk uses an adversarial **Reflexion Loop** — an iterative Draft → Critique → Refine pipeline powered by LangGraph — where a Writer agent generates text and a Critic agent evaluates it using quantitative linguistic metrics and semantic checks. It now ships with a full-featured **Premium React SaaS frontend**, **Academic Mode with LaTeX preservation**, and a **real-time SSE streaming** command center.

---

## 🆚 Real-World Comparison

We took a standardized **ChatGPT-generated bio** and processed it through leading competitors (*"Humanise AI"* and *"aihumanize.io"*) versus **HumanInk**.

| Feature |  Humanise AI |  aihumanize.io |  HumanInk Result |
| :--- | :--- | :--- | :--- |
| **Opening Hook** | *"Presently, I am finishing..."* <br> *(Passive, wordy)* | *"I am a senior... **is** studying..."* <br> *(Grammar Error! Clunky)* | *"I'm currently an undergrad..."* <br> *(Direct, active, clean)* |
| **Sentence Structure** | *"One of the most favorite projects..."* <br> *(Awkward rhythm)* | *"...through the building of... where capabilities are applied in conjunction..."* <br> *(Painful run-on sentence)* | *"Lately, I've been leading..."* <br> *(Natural flow)* |
| **Tone** | *"Most of my time has been utilized to dive deep..."* <br> *(Robotic filler)* | *"My primary passion is... fortunate to lead..."* <br> *(Generic Cover Letter style)* | *"I love the challenge of building..."* <br> *(Authentic passion)* |
| **Verdict** | **FAIL:** Thesaurus shuffle. | **FAIL:** Structural & Grammar issues. | **WIN:** Sounds like a real person. |

---

## ✨ What's New

### 🎓 Academic Mode (Section-Aware)
A dedicated pipeline for academic and research writing. When enabled:
- **Field Selector** — Choose from Computer Science, Medicine/Bio, Humanities, Law/Social Sciences, Business, or General Academic. Each field loads a pre-baked style profile calibrated to that discipline's writing conventions.
- **Section-Aware Heuristics** — Auto-detects 7 distinct paper sections (Abstract, Introduction, Literature Review, Methodology, Results, Discussion, Conclusion) based on LaTeX tags or keyword density.
- **Section-Specific Rewriting Rules** — The Writer dynamically adapts to the detected section (e.g., *Results* strictly uses passive voice and past tense with no hedging, while *Discussion* mandates interpretive hedging and present tense).
- **Manual Section Override** — A clean dropdown lets users force a specific section type if the auto-detector misfires.
- **LaTeX-Safe Processing** — The pipeline automatically detects and preserves all LaTeX markup:
  - Math environments (`equation`, `align`, `$$...$$`) → stored as placeholders, re-injected post-rewrite
  - Prose environments (`abstract`, `document`) → only the `\begin{}` / `\end{}` tags are replaced; content flows through the Writer normally
  - Citations (`\cite{}`, `\citep{}`), references (`\ref{}`), inline math (`$...$`) → all preserved verbatim
- **Academic-Aware Writer Prompt** — Separate system instructions prevent casual tone, generic meta-commentary, and boilerplate AI transitions.

### 🖥️ Premium SaaS Frontend (React + Vite)
A full cinematic landing page and command center:

**Landing Page (`Home.jsx`)**
- Giant kinetic typography hero with "HumanInk" word-mask fade
- Infinite scrolling archetype marquee (THE FOUNDER, THE NOVELIST, THE ACADEMIC...)
- Multi-agent pipeline showcase with animated neon pipeline rail
- **Use Cases Bento Grid** — asymmetric 2×2 glassmorphic cards for Cold Email, Academic Research, Creator Content, SEO Copywriting
- Live Typewriter Comparison — Standard LLM output vs HumanInk output animating side-by-side
- **Fat Footer** — 4-column nav (Brand + Product + Resources + Contact), GitHub/Twitter/Discord social icons, `hello@humanink.ai`, and a live "Agent Pipeline Operational" status badge

**Extraction Page (`Extraction.jsx`)**
- 4-stage psychological UX flow: Identify → Input → Scramble → Analyzing
- **Academic Mode toggle** with animated pill switch
- **Field Selector grid** (6 fields, each with unique color glow)
- Skip sample button in Academic Mode → "Use Field Baseline"
- Matrix scramble animation during DNA deconstruction
- Smooth fade/blur/scale exit transitions on all navigation

**Workspace / Command Center (`Workspace.jsx`)**
- 50/50 horizontal split-pane: Target Payload (left) | Synthesized Draft (right)
- **Horizontal Agent Pipeline Rail** — GATEKEEPER → WRITER → CRITIC with live neon glow states
- **Paraphrase Depth Slider** — 3-step intensity control (Light / Balanced / Full) that instructs the Writer agent on how aggressively to restructure sentences and swap vocabulary.
- **Dynamic thinking phrases** while processing ("Examining semantic density...", "Synthesizing burstiness variance...")
- **Copy to Clipboard** button with CheckCircle confirmation flash
- **Live Section Detection Badge** — pulsing emerald `Abstract · high` badge directly in the payload header.
- **Unified Telemetry Strip** — The execution button is neatly nested alongside the `STATUS` / `SCORE` indicators at the bottom right.
- SSE buffer system preventing silent JSON parse errors on split chunks

### ⚡ Real-Time SSE Streaming
- Near-zero latency (reduced sleep delays to 0.1s)
- Trailing buffer handles chunked SSE payloads safely
- Score tracking: Passed/Failed states never overwrite the final Critic grade
- LaTeX re-injection status event streams to UI before final output

---

## 🌟 The Pipeline — "Secret Sauce"

### 1. The Profiler Agent 🕵️
**Goal:** Learn *how* you write, not just *what* you write.

Before rewriting anything, the **Profiler Agent** processes your writing samples to extract a **Style Fingerprint** covering:
- **Sentence Rhythm** — Short punchy cadences vs. long compound academic sentences
- **Vocabulary** — Formal elevated language vs. everyday casual terminology
- **Quirks & Habits** — Em-dash frequency, conjunction openers, Oxford comma usage

In **Academic Mode**, if no samples are provided, a pre-baked field baseline profile is used instead.

### 2. The Gatekeeper 🚪
**Goal:** Don't fix what isn't broken.

Multi-stage screening before entering the loop:
- **Stage 1 — Adaptive Math:** Burstiness score threshold adjusts based on average sentence length (> 4.0 for standard prose, > 7.0 for dense academic text)
- **Stage 2 — Semantic Intelligence:** LLM scans for grammar errors, run-on sentences, and "AI Watermarks" (words like *delve*, *tapestry*, *testament*)
- **Routing:** Pass → skip the loop, go straight to output. Fail → enter the Reflexion Loop.

### 3. The Reflexion Loop (Writer & Critic) ⚔️
**Goal:** The adversarial showdown.

#### A. The Writer Agent ✍️
- **Chain-of-Thought Planning** — Analyzes robotic patterns first, then plans 3 targeted changes before drafting
- **Style Injection** — Applies your DNA fingerprint's quirks and vocabulary to each draft
- **Academic Mode** — Separate system prompt preserving academic register, field-appropriate vocabulary, and LaTeX placeholders

#### B. The Critic Agent ⚖️
Evaluates the draft using a weighted Human Score formula:
> `Score = (Burstiness × 0.4) + (Vocabulary × 0.3) + (Coherence × 0.3)`

- **Math Brain** — NLTK + TextStat evaluate burstiness and unique vocabulary ratio
- **Editor Brain** — LLM checks syntactic coherence and natural flow
- **Verdict** — Score > 75 → escape to Final Output. Score < 75 → feedback sent back to Writer for the next iteration.

### 4. LaTeX Processor (`latex_utils.py`) 📄 *(Academic Mode only)*
Standalone utility that runs before and after the pipeline:
- `extract_latex_tokens()` — Regex-based tokenizer with smart prose vs. non-prose env separation
- `reinjert_latex_tokens()` — Precisely re-injects preserved tokens post-rewrite
- `is_latex_document()` — Auto-detects LaTeX-heavy input
- `get_field_profile()` — Returns field-calibrated style dict for all 6 academic disciplines

---

## 🏗️ Architecture

![Architecture Diagram](assets/HumanInk_Arch.png)

```
[User] → Extraction Page (DNA Sample or Academic Field Select)
       → Workspace (Paste AI Text) → Execute Translation
       ↓
[Backend: FastAPI]
  → Academic Mode? → extract_latex_tokens() → clean prose only
  → LangGraph Pipeline:
       pre_critic → (pass? → skip) → profiler → writer → critic
                                               ↑_________|  (loop if robotic)
  → Academic Mode? → reinjert_latex_tokens() → final output
  → SSE Stream → Frontend
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS v3.4 |
| **Backend** | Python, FastAPI, Uvicorn |
| **AI Orchestration** | LangGraph (cyclic StateGraph) |
| **Writer / Profiler** | Gemini Flash Preview (high creativity) |
| **Critic / Gatekeeper** | Llama 3.3 70B / Llama 3.1 8B via Groq |
| **Analysis Tools** | `nltk`, `textstat`, `numpy` |
| **Streaming** | Server-Sent Events (SSE) |
| **LaTeX Processing** | Custom `latex_utils.py` regex pipeline |

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Gemini API Key (Google AI Studio)
- Groq API Key (for Llama 3 agents)

### Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/ShaikNelofer2004/humanink.git
    cd humanink
    ```

2. **Install Backend Dependencies:**
    ```bash
    cd backend
    pip install -r requirements.txt
    ```

3. **Install Frontend Dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```

4. **Set up Environment Variables:**
    Create a `.env` file in `backend/`:
    ```env
    GOOGLE_API_KEY=your_gemini_key_here
    GROQ_API_KEY=your_groq_key_here
    OPENROUTER_API_KEY=your_openrouter_key_here
    GROQ_API_KEY_GATEKEEPER=your_gatekeeper_key_here
    ```

### Running Locally

5. **Start the Backend:**
    ```bash
    cd backend
    python -m uvicorn main:app --reload --port 8000
    ```

6. **Start the Frontend:**
    ```bash
    cd frontend
    npm run dev
    ```
    Open `http://localhost:5173` in your browser.

### Testing

```bash
# Test the Profiler Agent
python backend/test_profiler.py

# Test the full LangGraph pipeline
python backend/test_graph.py

# Test LaTeX extraction utility
python backend/test_utils.py
```

---

## 📁 Project Structure

```
HumanInk/
├── backend/
│   ├── agents/
│   │   ├── writer.py          # Writer Agent (academic + normal mode)
│   │   ├── critic.py          # Critic Agent (dual-brain evaluation)
│   │   ├── gatekeeper.py      # Gatekeeper Agent (math + semantic)
│   │   └── profiler.py        # Profiler Agent (DNA extraction)
│   ├── graph.py               # LangGraph StateGraph pipeline
│   ├── latex_utils.py         # LaTeX pre/post processor + field profiles
│   ├── main.py                # FastAPI routes + SSE streaming
│   ├── utils.py               # Burstiness calculation utilities
│   └── .env                   # API keys (not committed)
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Home.jsx        # Landing page (hero, pipeline, use cases, footer)
│       │   ├── Extraction.jsx  # DNA setup + Academic Mode flow
│       │   ├── Workspace.jsx   # 50/50 split command center + SSE reader
│       │   └── StatsPanel.jsx  # Telemetry strip (status indicator)
│       ├── App.jsx             # Routing state machine (HOME → EXTRACTION → WORKSPACE)
│       └── index.css           # Tailwind + custom animations (marquee, pipeline, scan)
├── PRODUCT_ROADMAP.md          # Technical roadmap and uplevel ideas
└── README.md
```

---

## 🗺️ Roadmap

See [`PRODUCT_ROADMAP.md`](PRODUCT_ROADMAP.md) for the full technical roadmap. Key upcoming features:

| Priority | Feature |
|---|---|
| 🔴 P0 | Deliberate Imperfection Agent |
| 🔴 P0 | Token-by-token streaming output |
| 🟡 P1 | Syntactic Reconstructor Agent |
| 🟡 P1 | Multiple DNA Profile Slots |
| 🟢 P2 | Chrome Extension |
| 🔵 P3 | API-First B2B Tier |

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Submit a pull request.

---

<div align="center">
  <p>© 2026 HumanInk · Authentic Identity · Zero Fluff</p>
</div>
