"""
latex_utils.py — LaTeX-Aware Pre/Post Processing for Academic Mode

Extracts LaTeX tokens (commands, environments, math, citations) and replaces
them with safe placeholders before humanization, then re-injects them after.
"""

import re

# Environments that contain MATH/CODE/FIGURES — strip entire block (content is not prose)
NON_PROSE_ENVS = (
    r'equation\*?', r'align\*?', r'multline\*?', r'gather\*?',
    r'eqnarray\*?', r'math', r'displaymath',
    r'figure\*?', r'table\*?', r'tabular', r'array',
    r'algorithm\*?', r'algorithmic', r'lstlisting', r'verbatim',
    r'tikzpicture', r'pgfpicture', r'pspicture',
)
NON_PROSE_ENV_RE = r'\\begin\{(' + '|'.join(NON_PROSE_ENVS) + r')\}.*?\\end\{\1\}'

# Environments that contain PROSE — strip only the \begin{} and \end{} TAGS, keep content
PROSE_ENVS = (
    r'abstract', r'document', r'titlepage', r'quotation', r'quote',
    r'itemize', r'enumerate', r'description',
)
PROSE_ENV_TAG_RE = r'\\(?:begin|end)\{(' + '|'.join(PROSE_ENVS) + r')\}'

# Patterns ordered from most specific to least specific to avoid partial matches
LATEX_PATTERNS = [
    # Non-prose full environments (math, figures, tables, code): strip entire block
    (NON_PROSE_ENV_RE, 'ENV'),
    # Display math: $$ ... $$ or \[ ... \]
    (r'\$\$.*?\$\$', 'DMATH'),
    (r'\\\[.*?\\\]', 'DMATH'),
    # Inline math: $ ... $
    (r'\$[^\$\n]+?\$', 'IMATH'),
    # Citations: \cite{...}, \citep{...}, \citet{...}
    (r'\\cite[a-z]*\{[^}]+\}', 'CITE'),
    # Labels and references: \ref{...}, \label{...}, \eqref{...}
    (r'\\(?:ref|label|eqref|autoref|pageref)\{[^}]+\}', 'REF'),
    # Figures and tables: \includegraphics, \caption
    (r'\\includegraphics(?:\[[^\]]*\])?\{[^}]+\}', 'FIG'),
    # Footnotes
    (r'\\footnote\{[^}]+\}', 'FOOT'),
    # URL
    (r'\\url\{[^}]+\}', 'URL'),
    (r'\\href\{[^}]+\}\{[^}]+\}', 'URL'),
    # Generic commands with arguments: \command{arg}
    (r'\\[a-zA-Z]+(?:\[[^\]]*\])?\{[^}]*\}', 'CMD'),
    # Simple commands: \newline, \textbf etc (no argument)
    (r'\\[a-zA-Z]+\b', 'CMD'),
    # Percentage lines (LaTeX comments)
    (r'%.*', 'COMMENT'),
]

def extract_latex_tokens(text: str) -> tuple[str, dict]:
    """
    Scans the input text, extracts all LaTeX tokens, replaces them with
    numbered placeholders, and returns the cleaned prose + token map.
    
    Strategy:
    - Non-prose environments (math, figures, tables): entire block → placeholder
    - Prose environments (abstract, document): only the \\begin/\\end TAGS → placeholder
      so the content is preserved for the Writer to rewrite
    
    Returns:
        clean_text: str — prose-only text safe for NLP humanization
        token_map: dict — {placeholder: original_latex_token}
    """
    token_map = {}
    counter = [0]  # mutable for closure

    def replace_match(match, token_type):
        key = f"<<LATEX_{token_type}_{counter[0]:04d}>>"
        token_map[key] = match.group(0)
        counter[0] += 1
        return f" {key} "

    clean_text = text
    
    # Step 1: Strip non-prose environment BLOCKS entirely
    clean_text = re.sub(
        NON_PROSE_ENV_RE,
        lambda m: replace_match(m, 'ENV'),
        clean_text,
        flags=re.DOTALL | re.IGNORECASE
    )
    
    # Step 2: Strip only the TAGS of prose environments (keep content)
    clean_text = re.sub(
        PROSE_ENV_TAG_RE,
        lambda m: replace_match(m, 'TAG'),
        clean_text,
        flags=re.IGNORECASE
    )
    
    # Step 3: Apply all other patterns
    for pattern, token_type in LATEX_PATTERNS:
        clean_text = re.sub(
            pattern,
            lambda m, tt=token_type: replace_match(m, tt),
            clean_text,
            flags=re.DOTALL | re.IGNORECASE
        )

    return clean_text.strip(), token_map


def reinjert_latex_tokens(humanized_text: str, token_map: dict) -> str:
    """
    Re-injects the stored LaTeX tokens back into the humanized text
    by replacing placeholders with their original values.
    
    The Writer LLM is instructed to preserve placeholders, so they
    should appear in the output in similar positions.
    """
    result = humanized_text
    for placeholder, original in token_map.items():
        result = result.replace(placeholder, original)
    
    # Clean up any orphaned placeholder patterns that the LLM may have garbled
    result = re.sub(r'<<LATEX_[A-Z]+_\d{4}>>', '', result)
    return result.strip()


def is_latex_document(text: str) -> bool:
    """
    Heuristic check: does this text contain significant LaTeX markup?
    Returns True if it looks like an academic LaTeX document.
    """
    latex_indicators = [
        r'\\cite\{',
        r'\$.*?\$',
        r'\\begin\{',
        r'\\section\{',
        r'\\label\{',
        r'\\ref\{',
    ]
    matches = sum(1 for p in latex_indicators if re.search(p, text, re.DOTALL))
    return matches >= 2


# ─── Academic Field Baseline Profiles ─────────────────────────────────────────

ACADEMIC_FIELD_PROFILES = {
    "cs": {
        "archetype": "Academic — Computer Science",
        "tone": "Academic",
        "field_id": "cs",
        "field_label": "Computer Science",
        "style_instructions": (
            "Write in a precise, technical academic style suitable for a top-tier Computer Science "
            "conference or journal (e.g., ACM, IEEE). Use active and passive voice in a balanced way. "
            "Keep sentences concise and direct. Avoid hedging unless discussing limitations. "
            "Technical terms should be used accurately. Do NOT use casual language, colloquialisms, "
            "or filler phrases. Sentence lengths must vary — mix short declarative sentences with "
            "longer explanatory ones. Avoid starting consecutive sentences with 'The'."
        )
    },
    "medicine": {
        "archetype": "Academic — Medicine / Bio",
        "tone": "Academic",
        "field_id": "medicine",
        "field_label": "Medicine / Bio",
        "style_instructions": (
            "Write in a formal biomedical academic style suitable for journals like NEJM, Lancet, or PLOS. "
            "Favour passive voice constructions ('It was observed that...', 'Results suggest...'). "
            "Use hedging language to convey uncertainty ('may indicate', 'appears to', 'is consistent with'). "
            "Employ domain-precise vocabulary. Sentence lengths should vary between short factual statements "
            "and longer analytical sentences. Avoid colloquial language entirely."
        )
    },
    "humanities": {
        "archetype": "Academic — Humanities",
        "tone": "Academic",
        "field_id": "humanities",
        "field_label": "Humanities",
        "style_instructions": (
            "Write in a rich, analytical humanities academic style suitable for journals like PMLA or Critical Inquiry. "
            "First-person voice is acceptable ('I argue that...', 'This essay contends...'). "
            "Use rhetorical questions sparingly for effect. Employ em-dashes for asides and elaborations. "
            "Sentence structure should be varied and at times complex, with subordinate clauses. "
            "Vocabulary should be sophisticated but not impenetrable. Avoid bullet points — use flowing prose."
        )
    },
    "law": {
        "archetype": "Academic — Law / Social Sci.",
        "tone": "Academic",
        "field_id": "law",
        "field_label": "Law / Social Sciences",
        "style_instructions": (
            "Write in the formal, measured style of legal scholarship or social science journals. "
            "Use precise, unambiguous language. Passive voice is common for describing procedures or findings. "
            "Hedging qualifiers are appropriate ('arguably', 'it may be contended', 'evidence suggests'). "
            "Structure paragraphs with clear topic sentences. Sentence lengths should vary but avoid overly "
            "short, blunt sentences. Do not use colloquialisms or informal register."
        )
    },
    "business": {
        "archetype": "Academic — Business",
        "tone": "Academic",
        "field_id": "business",
        "field_label": "Business",
        "style_instructions": (
            "Write in a professional, data-driven academic style suitable for journals like HBR Academic or JOM. "
            "Use active voice where possible. Be direct and evidence-forward. Reference quantitative findings "
            "naturally in prose. Avoid excessive jargon but use strategic management vocabulary accurately. "
            "Sentence lengths should vary — short punchy statements mixed with analytical elaboration."
        )
    },
    "general": {
        "archetype": "Academic — General",
        "tone": "Academic",
        "field_id": "general",
        "field_label": "General Academic",
        "style_instructions": (
            "Write in a clear, rigorous academic style suitable for a broad interdisciplinary audience. "
            "Balance active and passive voice. Use hedging language where appropriate. "
            "Vocabulary should be precise but accessible. Sentence structures must vary — "
            "avoid monotonous uniform length. Avoid informal phrasing, casual contractions, "
            "and AI boilerplate transitions like 'Furthermore', 'Moreover', 'It is evident that'."
        )
    }
}

def get_field_profile(field_id: str) -> dict:
    """Returns the academic style profile dict for a given field ID."""
    return ACADEMIC_FIELD_PROFILES.get(field_id, ACADEMIC_FIELD_PROFILES["general"])
