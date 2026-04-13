# HumanInk — Product Roadmap & Technical Uplevel Ideas

> **Positioning**: A multi-agent AI pipeline that rewrites LLM-generated text to authentically match the user's unique human neural rhythm. Legally and commercially equivalent to Grammarly or Quillbot — but far more technically sophisticated.

---

## Part 1: Tackling Advanced Detection Systems

### 1.1 — How Turnitin Works (and Where to Attack)

Turnitin runs **two separate detection engines simultaneously**:

| Engine | What It Checks | HumanInk Status |
|---|---|---|
| **AI Writing Detector** | Statistical perplexity + burstiness variance | ✅ Already addressed by Critic/Writer loop |
| **Plagiarism Engine** | Literal phrase overlap against 70B+ documents | ⚠️ Not yet addressed |
| **Stylometric Consistency** | Does the entire doc sound like one person? | ⚠️ Partially addressed |
| **Syntactic Fingerprinting** | Are sentence structures suspiciously uniform? | ❌ Not yet addressed |

---

### 1.2 — New Agent Ideas to Counter Advanced Detection

#### 🔴 Agent: Syntactic Reconstructor
**What it does:** Goes beyond rhythmic styling to deeply restructure sentence grammar.
- Swap passive ↔ active voice intelligently
- Convert relative clauses → participial phrases
- Replace academic boilerplate transitions ("Furthermore", "Moreover") with natural spoken equivalents ("On top of that", "What this means is...")
- Randomize sentence opening patterns (pronoun vs gerund vs noun-phrase openers)

**Why it works:** Turnitin's AI engine flags "too-clean" syntactic uniformity. This agent deliberately roughens the structural fingerprint.

---

#### 🟡 Agent: Stylometric Lock (Document-Level DNA Enforcement)
**What it does:** Runs a final pass across the **entire document** (not just per-paragraph) to enforce consistent personal style signals.
- Tracks and enforces personal punctuation preferences (em-dash vs comma vs semicolon ratios)
- Locks paragraph rhythm patterns (short intro → expanded body → punchy close → repeat)
- Prevents style drift between sections (the #1 reason full documents get flagged)

**Why it matters:** A single essay that sounds like 3 different people is an instant Turnitin flag.

---

#### 🟢 Agent: Deliberate Imperfection Injector
**What it does:** Humans are **never perfect**. This agent intentionally introduces controlled, natural imperfections.
- Occasional minor redundancies mid-paragraph ("...which is to say, essentially...")
- Strategic informal contractions inside formal text ("it's" instead of "it is" once per 300 words)
- Mid-sentence self-correction patterns ("The system works — or rather, is designed to work — by...")
- Intentional filler hedges ("somewhat", "fairly", "in a sense")

**Why it works:** Turnitin's AI model is specifically trained to flag "zero-noise" text. Real human writing always has micro-imperfections.

---

#### 🔵 Agent: Academic Context Preserver
**What it does:** For academic submissions specifically.
- Detects citation patterns (`Author, YYYY` / `[1]` / footnote markers)
- Preserves and naturally integrates them rather than stripping them during rewrite
- Matches field-specific writing conventions (APA vs Chicago vs MLA)
- Detects subject domain (STEM vs Humanities) and adjusts vocabulary register accordingly

---

### 1.3 — Tackling GPTZero, Originality.ai, and Copyleaks

These tools primarily rely on **perplexity** and **burstiness** scoring:
- **Perplexity**: How "predictable" is each word choice? Low perplexity = AI-written.
- **Burstiness**: Is sentence length variance high (human) or uniform (AI)?

**HumanInk already handles this well.** To push further:
- **Inject domain-specific rare vocabulary** (jargon, field terms) to spike perplexity at key moments
- **Enforce non-uniform paragraph lengths** (1-sentence paragraphs mixed with 8-sentence paragraphs)
- **Break the "topic sentence + 3 points + conclusion" AI structure** completely

---

## Part 2: Technical Uplevels for the Core Pipeline

### 2.1 — Multi-Turn Critic Loop with Memory
**Current:** The Critic evaluates and restarts the Writer if score < 85%.

**Uplevel:** Give the Critic **memory of previous failed drafts** so the Writer doesn't repeat the same mistakes across loops.
```
Critic Memory Format:
{
  "failed_reasons": ["too uniform sentence length", "overused word: 'however'"],
  "iteration": 3,
  "best_score_so_far": 74
}
```
This prevents the loop from re-generating the same bad output and specifically informs the Writer what to fix.

---

### 2.2 — Dynamic Profile Slots (Multiple Writing Modes)
**Current:** One static DNA profile per session.

**Uplevel:** Let users save and switch between **named profile slots**.
- *"Academic Mode"* — formal, dense, citation-aware
- *"Email Mode"* — punchy, short sentences, conversational
- *"Blog Mode"* — storytelling structure, first-person, casual
- *"LinkedIn Mode"* — professional but relatable, achievement-forward

Each slot stores a separate Profiler JSON fingerprint.

---

### 2.3 — Streaming Token-by-Token Output
**Current:** The Writer generates the entire draft and then sends it.

**Uplevel:** Stream word-by-word to the frontend as the Writer LLM generates (like ChatGPT's typewriter stream). This would:
- Dramatically improve perceived speed
- Allow users to see the rewrite in real-time
- Enable mid-generation cancellation

**Technical path:** Switch the Writer LLM call from `invoke()` to `astream()` in LangGraph and pipe tokens directly to the SSE stream.

---

### 2.4 — Tone Gradient Slider (UI Feature)
**Uplevel:** Add a slider in the Workspace UI: `Formal ←————→ Casual`

This would modify a `tone_weight` parameter passed as context to the Writer agent, allowing the same DNA profile to output at different registers without re-running the Profiler.

---

### 2.5 — Batch Mode (Multi-Document Processing)
**Uplevel:** Allow users to upload a `.txt` or `.docx` file and rewrite the entire document in one go, section by section, with a full-document Stylometric Lock pass at the end.

---

## Part 3: Product & SaaS Uplevel Ideas

### 3.1 — Chrome Extension
A lightweight Chrome Extension that:
- Detects text areas on any website (Google Docs, email clients, LinkedIn)
- Shows a floating "Refine with HumanInk" button
- Sends selected text to the HumanInk API and replaces it in-place

This would be the **highest-impact distribution channel** for the product.

---

### 3.2 — API-First Tier (B2B)
Expose a clean REST API so:
- Email marketing SaaS platforms can integrate HumanInk natively
- Academic editing services can white-label the pipeline
- Content agencies can batch-process thousands of articles

**Pricing model:** Per-word token pricing (similar to OpenAI's API)

---

### 3.3 — HumanInk Score Dashboard
A post-generation analytics view showing:
- Before vs After perplexity scores (pulled from a local model)
- Sentence length variance chart
- Vocabulary uniqueness score
- Estimated detection probability across 3 major tools (GPTZero, Originality.ai, Turnitin)

---

### 3.4 — Writing DNA Vault
Users accumulate a **personal writing vault** over time:
- The more samples they feed in, the more refined their DNA Profile
- Profiles can be versioned ("Q1 2026 profile" vs "Q3 2026 profile")
- Samples are hashed and never stored in plaintext for privacy

---

## Part 4: Immediate Priorities (Quick Wins)

| Priority | Feature | Effort | Impact |
|---|---|---|---|
| 🔴 P0 | Deliberate Imperfection Agent | Medium | Very High |
| 🔴 P0 | Streaming token-by-token output | Medium | High |
| 🟡 P1 | Syntactic Reconstructor Agent | High | Very High |
| 🟡 P1 | Multiple Profile Slots (UI) | Low | High |
| 🟡 P1 | Tone Gradient Slider | Low | Medium |
| 🟢 P2 | Chrome Extension MVP | Very High | Very High |
| 🟢 P2 | HumanInk Score Dashboard | Medium | Medium |
| 🔵 P3 | API-First Tier + Pricing | High | Very High |
| 🔵 P3 | Writing DNA Vault | High | Medium |

---

*Last updated: April 2026 | HumanInk Internal Roadmap*
