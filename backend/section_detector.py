"""
section_detector.py — Academic Section Detection & Rule Engine

Detects the type of academic section (Abstract, Introduction, Methodology, etc.)
from the input text and returns section-specific rewriting rules for the Writer agent.
"""

import re
from typing import Optional

# ─── Section Definitions ──────────────────────────────────────────────────────

SECTION_RULES = {
    "abstract": {
        "label": "Abstract",
        "emoji": "📋",
        "tense": "present / past mixed",
        "voice": "balanced",
        "hedging": False,
        "allow_first_person": False,
        "density": "high",  # every sentence must carry information
        "writer_rules": (
            "This is an ABSTRACT section. Apply these strict rules:\n"
            "- Tense: Use present tense for general facts, past tense for what was done ('We propose...' vs 'We evaluated...')\n"
            "- Voice: Mix active and passive. Do NOT make it entirely passive.\n"
            "- Length: Keep sentences concise. No sentence should exceed 30 words.\n"
            "- No hedging ('may suggest', 'appears to'). Abstracts state results directly.\n"
            "- No first person 'I'. 'We' is acceptable for multi-author papers.\n"
            "- Do NOT add any information not in the original abstract.\n"
            "- End with a sentence about implications or significance."
        )
    },
    "introduction": {
        "label": "Introduction",
        "emoji": "🚪",
        "tense": "present",
        "voice": "active preferred",
        "hedging": True,
        "allow_first_person": True,
        "density": "medium",
        "writer_rules": (
            "This is an INTRODUCTION section. Apply these rules:\n"
            "- Tense: Predominantly present tense for background, motivation, and problem statement.\n"
            "- Voice: Active voice strongly preferred. Use passive only when agent is unknown/unimportant.\n"
            "- Flow: Must motivate the reader — start broad, narrow to the specific problem.\n"
            "- The last paragraph should outline the paper structure ('The rest of this paper is organized...').\n"
            "- Sentence variety is critical: mix 1-sentence paragraphs with multi-sentence ones.\n"
            "- Hedging is appropriate when discussing related work limitations."
        )
    },
    "literature_review": {
        "label": "Literature Review",
        "emoji": "📚",
        "tense": "past / present",
        "voice": "passive preferred",
        "hedging": True,
        "allow_first_person": False,
        "density": "medium",
        "writer_rules": (
            "This is a LITERATURE REVIEW / RELATED WORK section. Apply these rules:\n"
            "- Tense: Past tense for describing what specific studies did ('Smith et al. (2021) proposed...').\n"
            "  Present tense for stating established facts ('This technique is widely used in...').\n"
            "- Voice: Mixed. Use 'X et al. proposed...' constructions to vary sentence openers.\n"
            "- Do NOT start every sentence with a citation. Vary the structure:\n"
            "  Good: 'Several approaches have addressed this, including the work of [CITE]...'\n"
            "  Bad: '[CITE] proposed X. [CITE] developed Y. [CITE] showed Z.'\n"
            "- Group related works thematically, not chronologically.\n"
            "- End with a gap statement: what existing work fails to address."
        )
    },
    "methodology": {
        "label": "Methodology",
        "emoji": "⚙️",
        "tense": "past",
        "voice": "passive",
        "hedging": False,
        "allow_first_person": False,
        "density": "very high",
        "writer_rules": (
            "This is a METHODOLOGY / METHODS section. Apply these strict rules:\n"
            "- Tense: PAST tense throughout ('Data was collected...', 'The model was trained...').\n"
            "- Voice: PASSIVE voice is standard and expected ('Participants were selected...', 'The threshold was set to...').\n"
            "- Precision over variety: exact numbers, units, and technical terms must be preserved exactly.\n"
            "- No hedging. Methods are stated as facts.\n"
            "- Sentence structure should be clear and sequential — follow the actual procedure order.\n"
            "- Do NOT simplify technical specifications to sound more natural.\n"
            "- Vary sentence LENGTH but not sentence STRUCTURE drastically."
        )
    },
    "results": {
        "label": "Results",
        "emoji": "📊",
        "tense": "past",
        "voice": "passive preferred",
        "hedging": False,
        "allow_first_person": False,
        "density": "high",
        "writer_rules": (
            "This is a RESULTS section. Apply these rules:\n"
            "- Tense: Past tense ('The model achieved...', 'Accuracy improved by...').\n"
            "- Voice: Mixed but lean passive when describing what the data showed.\n"
            "- Be data-forward: numbers, percentages, and metrics must be preserved exactly.\n"
            "- NO interpretation or speculation here — only report what was observed.\n"
            "- Do NOT add words like 'surprisingly', 'impressively', or 'unfortunately'.\n"
            "- Reference figures/tables naturally: 'As shown in Table 1...' or 'Figure 2 illustrates...'\n"
            "- Vary sentence openers to avoid starting every sentence with 'The'."
        )
    },
    "discussion": {
        "label": "Discussion",
        "emoji": "💬",
        "tense": "present / past",
        "voice": "active preferred",
        "hedging": True,
        "allow_first_person": True,
        "density": "medium",
        "writer_rules": (
            "This is a DISCUSSION section. Apply these rules:\n"
            "- Tense: Present tense for interpretation ('These results suggest...'), past for referring to findings.\n"
            "- Voice: Active preferred ('We attribute this to...', 'This finding supports...').\n"
            "- HEDGING IS MANDATORY here: 'may suggest', 'appears to indicate', 'could be explained by'.\n"
            "- Compare results to prior work and explain agreements/disagreements.\n"
            "- Acknowledge limitations honestly without undermining the work.\n"
            "- Sentence variety is highest here — mix short interpretive statements with longer analytical ones.\n"
            "- Avoid overly certain language ('proves', 'demonstrates definitively')."
        )
    },
    "conclusion": {
        "label": "Conclusion",
        "emoji": "🏁",
        "tense": "present / past",
        "voice": "active",
        "hedging": False,
        "allow_first_person": True,
        "density": "medium",
        "writer_rules": (
            "This is a CONCLUSION section. Apply these rules:\n"
            "- Tense: Past for summarizing what was done, present for implications.\n"
            "- Voice: Active and direct. Conclusions should feel confident.\n"
            "- Structure: Brief summary → key contributions → limitations → future work.\n"
            "- Do NOT introduce new findings or arguments not in the paper.\n"
            "- Avoid starting with 'In conclusion,' or 'To summarize,' — these are AI red flags.\n"
            "- Keep it punchy: shorter paragraphs, shorter sentences than Discussion.\n"
            "- End with a forward-looking sentence about future research directions."
        )
    },
    "general": {
        "label": "General Academic",
        "emoji": "📄",
        "tense": "mixed",
        "voice": "balanced",
        "hedging": True,
        "allow_first_person": False,
        "density": "medium",
        "writer_rules": (
            "This is a general academic text. Apply standard academic writing rules:\n"
            "- Vary sentence length significantly (mix short and long sentences).\n"
            "- Remove AI boilerplate: 'Furthermore', 'Moreover', 'It is evident that', 'In conclusion'.\n"
            "- Maintain academic credibility — no casual or conversational language.\n"
            "- Use appropriate hedging where claims are not fully established.\n"
            "- Do NOT add any information not in the original."
        )
    }
}

# ─── Detection Logic ──────────────────────────────────────────────────────────

# LaTeX section command patterns
LATEX_SECTION_PATTERNS = [
    (r'\\(?:sub)*section\*?\{[^}]*(?:abstract)[^}]*\}', 'abstract'),
    (r'\\(?:sub)*section\*?\{[^}]*(?:introduction|background)[^}]*\}', 'introduction'),
    (r'\\(?:sub)*section\*?\{[^}]*(?:related.work|literature.review|prior.work)[^}]*\}', 'literature_review'),
    (r'\\(?:sub)*section\*?\{[^}]*(?:method|methodology|approach|experimental.setup|system.design)[^}]*\}', 'methodology'),
    (r'\\(?:sub)*section\*?\{[^}]*(?:result|experiment|evaluation|performance|benchmark)[^}]*\}', 'results'),
    (r'\\(?:sub)*section\*?\{[^}]*(?:discussion|analysis|interpretation)[^}]*\}', 'discussion'),
    (r'\\(?:sub)*section\*?\{[^}]*(?:conclusion|future.work|summary)[^}]*\}', 'conclusion'),
    (r'\\begin\{abstract\}', 'abstract'),
]

# Keyword heuristics for plain-text detection
KEYWORD_HEURISTICS = {
    'abstract': [
        r'\bthis paper (proposes|presents|introduces|investigates)\b',
        r'\bwe (propose|present|introduce|develop|demonstrate)\b',
        r'\bexperimental results (show|demonstrate|indicate)\b',
        r'\bthe proposed (system|method|approach|framework)\b',
    ],
    'introduction': [
        r'\bin recent years\b',
        r'\bhas become (a|an) (major|significant|growing|critical)\b',
        r'\bthe rest of this paper is (organized|structured)\b',
        r'\bmotivat(ed|ing|ion)\b.{0,80}\bproblem\b',
        r'\bthe main contribution(s)? of this (paper|work)\b',
    ],
    'literature_review': [
        r'\b(et al\.?|et al,)\b.{0,60}\b(proposed|developed|introduced|showed)\b',
        r'\brelated work\b',
        r'\bexisting (approach|method|technique|work)s?\b',
        r'\bprior (work|studies|research|art)\b',
        r'\bvarious (approach|method|technique)s? have been (proposed|developed)\b',
    ],
    'methodology': [
        r'\bwe (collected|used|employed|applied|implemented|trained|evaluated)\b',
        r'\bthe dataset (was|were|consists)\b',
        r'\bparticipants were (selected|recruited|randomly)\b',
        r'\bthe model was (trained|tested|evaluated|fine-tuned)\b',
        r'\b(hyperparameter|threshold|learning rate|batch size|epoch)\b',
    ],
    'results': [
        r'\b(achieved|attained|obtained|recorded) (an? )?(accuracy|score|f1|precision|recall|improvement)\b',
        r'\boutperform(s|ed)?\b',
        r'\btable \d+ (shows|presents|summarizes)\b',
        r'\bfigure \d+ (illustrates|shows|depicts)\b',
        r'\bimproved by \d+(\.\d+)?[%\s]',
    ],
    'discussion': [
        r'\bthese (results|findings) suggest\b',
        r'\bmay (be due to|explain|indicate|suggest)\b',
        r'\bconsistent with (previous|prior|existing)\b',
        r'\blimitation(s)? of (this|our) (study|work|approach)\b',
        r'\bwe attribute (this|these) to\b',
    ],
    'conclusion': [
        r'\bin this (paper|work|study), we (proposed|presented|introduced|demonstrated)\b',
        r'\bfuture (work|research|direction)\b',
        r'\bwe have (shown|demonstrated|presented)\b',
        r'\bthis work (contributes?|addresses?|presents?)\b',
        r'\bin summary\b',
    ],
}


def detect_section(text: str) -> dict:
    """
    Detects the academic section type from the input text.
    
    Priority:
    1. LaTeX section command (most reliable)
    2. Keyword heuristics (scored match)
    3. Fall back to 'general'
    
    Returns:
        dict with keys: section_id, label, emoji, confidence, writer_rules
    """
    text_lower = text.lower()

    # Priority 1: LaTeX section commands
    for pattern, section_id in LATEX_SECTION_PATTERNS:
        if re.search(pattern, text, re.IGNORECASE):
            rules = SECTION_RULES[section_id]
            return {
                "section_id": section_id,
                "label": rules["label"],
                "emoji": rules["emoji"],
                "confidence": "high",
                "detection_method": "latex_command",
                "writer_rules": rules["writer_rules"]
            }

    # Priority 2: Keyword heuristics — scored
    scores = {section_id: 0 for section_id in KEYWORD_HEURISTICS}
    for section_id, patterns in KEYWORD_HEURISTICS.items():
        for pattern in patterns:
            if re.search(pattern, text_lower):
                scores[section_id] += 1

    best_section = max(scores, key=scores.get)
    best_score = scores[best_section]

    if best_score >= 2:
        rules = SECTION_RULES[best_section]
        return {
            "section_id": best_section,
            "label": rules["label"],
            "emoji": rules["emoji"],
            "confidence": "high" if best_score >= 3 else "medium",
            "detection_method": "keyword_heuristic",
            "writer_rules": rules["writer_rules"]
        }
    elif best_score == 1:
        rules = SECTION_RULES[best_section]
        return {
            "section_id": best_section,
            "label": rules["label"],
            "emoji": rules["emoji"],
            "confidence": "low",
            "detection_method": "keyword_heuristic",
            "writer_rules": rules["writer_rules"]
        }

    # Fallback: general academic
    rules = SECTION_RULES["general"]
    return {
        "section_id": "general",
        "label": rules["label"],
        "emoji": rules["emoji"],
        "confidence": "none",
        "detection_method": "fallback",
        "writer_rules": rules["writer_rules"]
    }


def get_section_rules(section_id: str) -> dict:
    """Get the full rules dict for a known section_id."""
    return SECTION_RULES.get(section_id, SECTION_RULES["general"])
