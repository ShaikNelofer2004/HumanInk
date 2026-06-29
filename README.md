<div align="center">
  <img src="frontend/public/logo_wordmark.png" alt="HumanInk Logo" width="300"/>
  <br/><br/>
  <p><strong>The AI Text Humanizer that doesn't just "rewrite" — it clones your digital DNA.</strong></p>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active_Development-blue" alt="Status"/>
  <img src="https://img.shields.io/badge/Backend-FastAPI-green" alt="Python"/>
  <img src="https://img.shields.io/badge/Frontend-React_+_Vite-61dafb" alt="Frontend"/>
  <img src="https://img.shields.io/badge/AI-Gemini_Flash_|_Llama_3.3-orange" alt="AI"/>
  <img src="https://img.shields.io/badge/Architecture-Reflexion_Loop-purple" alt="Architecture"/>
  <img src="https://img.shields.io/badge/Auth-Clerk-blueviolet" alt="Clerk Auth"/>
  <img src="https://img.shields.io/badge/Database-Supabase-3ecf8e" alt="Supabase DB"/>
</p>

**HumanInk** is a multi-agent AI pipeline that rewrites LLM-generated text to authentically match a user's unique human neural rhythm. Unlike generic rewriters that simply synonym-swap, HumanInk uses an adversarial **Reflexion Loop** — an iterative Draft → Critique → Refine pipeline powered by LangGraph. 

It now ships with a full-featured **Premium React SaaS frontend**, **Clerk Authentication**, **Supabase cloud database**, **Credit Systems**, **Multiple DNA Profiles**, and a **real-time SSE streaming** command center.

---

## 🆚 Real-World Comparison

We took a standardized **ChatGPT-generated bio** and processed it through leading competitors (*"Humanise AI"* and *"aihumanize.io"*) versus **HumanInk** (using a casual DNA profile).

| Feature |  Humanise AI |  aihumanize.io |  HumanInk (Custom DNA) |
| :--- | :--- | :--- | :--- |
| **Opening Hook** | *"Presently, I am finishing..."* <br> *(Passive, wordy)* | *"I am a senior... **is** studying..."* <br> *(Grammar Error! Clunky)* | *"I'm currently an undergrad..."* <br> *(Direct, active, clean)* |
| **Sentence Structure** | *"One of the most favorite projects..."* <br> *(Awkward rhythm)* | *"...through the building of... where capabilities are applied in conjunction..."* <br> *(Painful run-on sentence)* | *"Lately, I've been leading..."* <br> *(Natural flow)* |
| **Quirks & Style** | *"Most of my time has been utilized to dive deep..."* <br> *(Robotic filler)* | *"My primary passion is... fortunate to lead..."* <br> *(Generic Cover Letter style)* | *"I love the challenge of building—especially when it's hard."* <br> *(Enforced em-dash, authentic passion)* |
| **Verdict** | **FAIL:** Thesaurus shuffle. | **FAIL:** Structural & Grammar issues. | **WIN:** Sounds exactly like the author. |

---

## ✨ What's New (Latest Updates)

### ☁️ True Cloud SaaS Architecture
- **Supabase Integration:** Replaced local JSON files with a highly scalable Supabase PostgreSQL database. Your profiles, credits, and settings are fully synced to the cloud.
- **Clerk Authentication:** Enterprise-grade security. Only authenticated users can process text, completely stopping unauthorized API abuse.
- **Credit & Tier System:** Built-in credit tracking with a beautifully redesigned "Top Notch" SaaS pricing modal showcasing Free (10 credits) and Premium (150 credits, 800 words) tiers.

### 🧬 Multiple DNA Profiles
- **Profile Dashboard:** Extract, save, and manage multiple unique writing styles. Switch between them instantly.
- **Smart Setup Skipping:** Users who just want to write can skip DNA extraction. The system automatically provisions and saves a "Default Profile" to their database row seamlessly.
- **Strict Quirk Enforcement:** The system doesn't just copy your tone; it mathematically enforces your specific punctuation habits (like em-dashes or Oxford commas).

### 🎚️ Paraphrase Depth Control
- **Light Touch:** Fixes robotic phrasing while strictly maintaining original length and structure.
- **Balanced:** Restructures sentences and maps vocabulary to your DNA, strictly enforcing a ±5% word count margin.
- **Full Reconstruction:** Complete narrative freedom to break up paragraphs, add storytelling hooks, and expand length dynamically (capped at 125%).

### 🎓 Academic Mode & LaTeX Support
- **Discipline-Specific Baseline:** Calibrated profiles for Computer Science, Medicine, Humanities, etc.
- **100% LaTeX-Safe:** Math environments, citations, and formulas are fully preserved and re-injected automatically.

### 🖥️ Premium UX & Command Center
- **Cinematic Frontend:** Fully glassmorphic design featuring kinetic typography, legal modals, immersive glow effects, and an interactive agent pipeline rail.
- **Cold-Start Handling:** Intelligent frontend loading states that inform users if the backend is waking up from a sleep state.
- **Live SSE Streaming:** Watch the agents "think" and process in real-time with near-zero latency.

---

## 🌟 The Pipeline — "Secret Sauce"

### 1. The Profiler Agent 🕵️
Before rewriting anything, the **Profiler Agent** processes your writing samples to extract a **Style Fingerprint** covering:
- **Sentence Rhythm** (Short punchy cadences vs. long compound sentences)
- **Vocabulary** (Formal elevated language vs. everyday casual terminology)
- **Quirks & Habits** (Em-dash frequency, conjunction openers, Oxford comma usage)

### 2. The Gatekeeper 🚪
Multi-stage screening before entering the loop:
- **Adaptive Math:** Burstiness score threshold adjusts based on average sentence length.
- **Semantic Intelligence:** LLM scans for grammar errors, run-on sentences, and "AI Watermarks" (words like *delve*, *tapestry*, *testament*).

### 3. The Reflexion Loop (Writer & Critic) ⚔️
- **The Writer Agent ✍️:** Analyzes robotic patterns, plans targeted changes, and enforces your exact stylistic DNA constraints based on your chosen Paraphrase Depth.
- **The Critic Agent ⚖️:** Evaluates the draft using a weighted Human Score formula (`Burstiness` + `Vocabulary` + `Coherence`). If it scores < 75, feedback is sent back to the Writer for a retry.

---

## 🏗️ Architecture

![Architecture Diagram](assets/HumanInk_Arch.png)

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Clerk |
| **Backend** | Python, FastAPI, Uvicorn, Supabase (PostgreSQL) |
| **AI Orchestration** | LangGraph (cyclic StateGraph) |
| **Writer / Profiler** | Gemini Flash Preview (high creativity) |
| **Critic / Gatekeeper** | Llama 3.3 70B / Llama 3.1 8B via Groq |

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Gemini API Key (Google AI Studio)
- Groq API Key (for Llama 3 agents)
- Clerk API Keys (Frontend)
- Supabase API Keys (Backend)

### Installation

1. **Clone & Install Backend:**
    ```bash
    git clone https://github.com/ShaikNelofer2004/humanink.git
    cd humanink/backend
    pip install -r requirements.txt
    ```

2. **Install Frontend:**
    ```bash
    cd ../frontend
    npm install
    ```

3. **Set up Environment Variables:**
    **Backend (`backend/.env`):**
    ```env
    GOOGLE_API_KEY=your_gemini_key_here
    GROQ_API_KEY=your_groq_key_here
    OPENROUTER_API_KEY=your_openrouter_key_here
    GROQ_API_KEY_GATEKEEPER=your_gatekeeper_key_here
    SUPABASE_URL=your_supabase_url
    SUPABASE_KEY=your_supabase_service_key
    ```
    
    **Frontend (`frontend/.env`):**
    ```env
    VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
    ```

### Running Locally

1. **Start the Backend:**
    ```bash
    cd backend
    python -m uvicorn main:app --reload --port 8000
    ```

2. **Start the Frontend:**
    ```bash
    cd frontend
    npm run dev
    ```
    Open `http://localhost:5173` in your browser.

---

## 🗺️ Roadmap

See [`PRODUCT_ROADMAP.md`](PRODUCT_ROADMAP.md) for the full technical roadmap. Key upcoming features:

| Priority | Feature | Status |
|---|---|---|
| ✅ | Cloud DB & Authentication | **Done** |
| ✅ | Credit & Premium Tier UI | **Done** |
| ✅ | Multiple DNA Profile Slots | **Done** |
| ✅ | Dynamic Gatekeeper Calibration | **Done** |
| 🔴 P0 | Field DNA Retriever — Domain-Aware Academic Writing | In Development |
| 🔴 P0 | Deliberate Imperfection Agent | Pending |
| 🔴 P0 | Token-by-token streaming output | Pending |
| 🟡 P1 | Parallel Subagent Architecture (remove word limit) | Pending |
| 🟡 P1 | Syntactic Reconstructor Agent | Pending |
| 🟢 P2 | MCP Server — Universal Tool Integration | Pending |
| 🟢 P2 | Chrome Extension | Pending |
| 🔵 P3 | A2A Protocol — Agent-to-Agent Delegation | Pending |
| 🔵 P3 | Skills Marketplace + AGENTS.MD | Pending |
| 🔵 P3 | API-First B2B Tier | Pending |

---

## 🔬 Future Vision — Field DNA Retriever

A planned agent node that fundamentally upgrades Academic Mode from a generic rewriter into a **domain-aware research writing assistant**.

### The Problem
Current Academic Mode uses a fixed field baseline prompt (e.g., "write in a formal academic style"). But a **NeurIPS ML paper** sounds nothing like a **NEJM medical paper**, which sounds nothing like a **Nature physics paper**. A generic prompt produces generic academic writing.

### The Solution
The **Field DNA Retriever** is a new agent in the LangGraph pipeline that:
1. Takes the user's research topic/domain as input
2. Searches **arXiv** and trusted scholarly sources for recent papers in that exact field
3. Extracts structured **style signals** — not content — from those papers:
   - Average sentence length & variance per section
   - Technical vocabulary density
   - Citation rhythm and density
   - Transitional phrase patterns
   - Passive vs. active voice ratio
4. Packages these signals into a **Field DNA profile** (same structure as Personal DNA)
5. Passes the Field DNA to the Writer Agent, which merges it with any existing Personal DNA

### Key Enhancements Planned

| Enhancement | Description |
|---|---|
| **Venue Targeting** | User specifies the target journal/conference (NeurIPS, IEEE CVPR, ICCV, TPAMI, NEJM, Nature) for laser-precise style — not just a broad topic. IEEE papers are sourced via free arXiv preprints using the IEEE Xplore arXiv strategy |
| **Section-Aware Extraction** | Extracts different style signals per section — Abstract, Introduction, Methodology, and Discussion each have distinct conventions |
| **Temporal Freshness Filter** | Only retrieves papers from the last 2 years — writing conventions evolve and stale papers produce outdated voice |
| **High-Impact Weighting** | Papers from top-tier venues (Nature, Science, NeurIPS, IEEE TPAMI) carry more style weight than low-quality sources |
| **Blend Mode** | Writing at the intersection of two fields? Select two venues and blend their Field DNAs proportionally |
| **Smart Caching** | Field DNA for "NeurIPS CS" or "IEEE CVPR" is cached and reused across sessions — no redundant fetches |

### Supported IEEE Venues (via arXiv preprints)
| IEEE Venue | Domain |
|---|---|
| **CVPR / ICCV / ECCV** | Computer Vision |
| **ICASSP** | Signal Processing & Audio |
| **TPAMI** | Pattern Analysis & Machine Intelligence |
| **IEEE Transactions on Neural Networks** | Deep Learning |
| **IEEE Access** | Open Access — Broad Engineering |

### Architecture Position
```
Profiler → [FIELD_DNA_RETRIEVER] → Gatekeeper → Writer → Critic → Output
               ↑ New Agent Node
               Uses: arXiv Search Tool + Web Scraper Tool
               Outputs: Field DNA Profile (merged into Writer context)
```

---

## 🤖 The Agentic Layer

HumanInk is being rebuilt from a product into an agent. These open protocols define how it will talk to — and be used by — the entire AI ecosystem.

### 🔌 MCP — Model Context Protocol *(by Anthropic)*
HumanInk becomes a universal tool plug-in. Any MCP-compatible model — Claude, GPT, Gemini — can call the humanization pipeline directly from their own environment. Write in Notion, get humanized in real time. The Field DNA Retriever also becomes an MCP client, plugging directly into arXiv and IEEE Xplore as live data sources.

**What's unlocked:** Chrome Extension and Workspace integrations (Notion, Google Docs) become trivial MCP calls with zero extra backend work.

---

### 🤝 A2A — Agent-to-Agent Protocol *(by Google)*
Each HumanInk agent publishes a capability card. External AI pipelines discover and hire your Writer, Critic, or Gatekeeper as standalone services — no human in between.

```
External Content Pipeline
  └── discovers WRITER_AGENT via A2A
  └── delegates: "rewrite this paragraph in Nelofer's DNA"
  └── WRITER_AGENT returns humanized text
  └── no HumanInk UI touched
```

**What's unlocked:** The B2B API tier is built automatically. External tools hire your agents directly without you building a separate API product.

---

### ⚡ Subagents — Parallel Processing Architecture *(internal upgrade)*
The current pipeline is linear and sequential. With subagents, each agent spawns specialist children that run simultaneously.

```
Today (Sequential):
Gatekeeper → Profiler → Writer → Critic    [100 word limit]

With Subagents (Parallel):
Orchestrator
  ├── Writer Subagent → Paragraph 1
  ├── Writer Subagent → Paragraph 2
  ├── Writer Subagent → Paragraph 3
  └── Writer Subagent → Paragraph 4     [No word limit]
```

| Component | Today | With Subagents |
|---|---|---|
| **Word limit** | 100 words | Unlimited |
| **Processing** | Sequential | Parallel (3–5× faster) |
| **Profiler** | 1 combined call | 4 specialist subagents |
| **Critic** | 1 combined check | 3 parallel checks |

---

### 🧰 Skills Marketplace *(open standard)*
Each HumanInk capability — DNA extraction, humanization, authenticity scoring — is packaged as a reusable Skill with a standard interface.

```yaml
name: humanize_text
description: Rewrites AI-generated text to match a user's writing DNA
input:
  text: string
  dna_profile: object
output:
  humanized_text: string
  human_score: float
```

Any agent orchestrator (CrewAI, AutoGPT, LangGraph Cloud) can discover and import HumanInk skills. **HumanInk stops being a product and becomes a platform others build on.**

---

### 📄 AGENTS.MD — Agent Identity Standard *(open standard)*
Every HumanInk agent publishes a machine-readable identity card declaring its capabilities, input/output schema, and constraints. The entire AI ecosystem can discover and invoke agents correctly without custom integration code.

```markdown
# WRITER_AGENT
description: Rewrites input text to match a provided style DNA profile
input_schema: { text: string, dna_profile: object, feedback: string? }
output_schema: { draft: string }
constraints: [max_tokens: 2000, temperature: 0.9]
```

**What's unlocked:** HumanInk agents become first-class citizens of the global agent ecosystem — discoverable by any compatible orchestrator.

---

### Protocol Stack Overview

| Protocol | Direction | What It Enables |
|---|---|---|
| **Subagents** | Internal | Parallel processing, no word limit |
| **MCP** | HumanInk → World | Connect to any tool or data source |
| **A2A** | World → HumanInk | External agents hire HumanInk agents |
| **Skills** | HumanInk → World | Capabilities published to orchestrators |
| **AGENTS.MD** | HumanInk → World | Machine-readable agent identity cards |

---

<div align="center">
  <p>© 2026 HumanInk · Authentic Identity · Zero Fluff</p>
</div>
