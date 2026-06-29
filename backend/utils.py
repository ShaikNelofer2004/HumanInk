import textstat
import numpy as np
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from collections import Counter

# Ensure NLTK data is downloaded
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')
    nltk.download('punkt_tab')

def calculate_burstiness(text: str) -> float:
    """
    Calculates the standard deviation of sentence lengths (Burstiness).
    Higher std_dev = More "Human-like" (usually).
    Low std_dev = "Robotic/Monotone".
    """
    sentences = sent_tokenize(text)
    if not sentences:
        return 0.0
    
    # Count words per sentence
    lengths = [len(word_tokenize(s)) for s in sentences]
    
    # Calculate Standard Deviation
    std_dev = float(np.std(lengths))
    print(f"DEBUG: Sentences: {len(sentences)}, Lengths: {lengths}, StdDev: {std_dev}")
    return std_dev

def calculate_grade_level(text: str) -> float:
    """
    Calculates Flesch-Kincaid Grade Level.
    Humans fluctuate; AI often targets a specific range (10-12).
    """
    return textstat.flesch_kincaid_grade(text)

def calculate_unique_ratio(text: str) -> float:
    """
    Calculates the ratio of unique words to total words (Hapax Legomena indicator).
    """
    words = word_tokenize(text.lower())
    if not words:
        return 0.0
        
    # Filter out non-alphabetic tokens to be strict
    words = [w for w in words if w.isalpha()]
    
    if not words:
        return 0.0

    unique_words = set(words)
    return len(unique_words) / len(words)

def detect_ai_watermarks(text: str) -> list[str]:
    """
    Checks for common 'AI' words.
    """
    banned = ["delve", "underscore", "tapestry", "realm", "crucial", "moreover", "landscape", "testament"]
    found = []
    lower_text = text.lower()
    for word in banned:
        if word in lower_text:
            found.append(word)
    return found

def derive_dna_threshold(dna_profile: dict) -> float:
    """
    Derives a personalized burstiness pass-threshold from the user's DNA profile.

    Priority order:
      1. Numeric 'burstiness_score' saved during profiling (most precise).
         Threshold = max(1.0, burstiness_score * 0.6)
         Rationale: text needs to hit at least 60% of the user's natural variance to pass.
      2. String 'Sentence_Length_Variance' field from the Profiler.
         High  -> 2.5  (user bursts naturally; low bar to pass)
         Low   -> 1.5  (user writes flat; very low bar)
         Medium-> 4.0  (global default)
      3. Keyword scan of 'style_instructions' as a secondary signal.
      4. Global default (4.0) if no signal found.
    """
    # --- Priority 1: Numeric burstiness score (most precise) ---
    numeric_score = dna_profile.get("burstiness_score")
    if numeric_score is not None:
        try:
            score = float(numeric_score)
            threshold = max(1.0, round(score * 0.6, 2))
            print(f"    [Gatekeeper] DNA numeric burstiness={score:.2f} -> threshold={threshold:.2f}")
            return threshold
        except (TypeError, ValueError):
            pass

    # --- Priority 2: String Sentence_Length_Variance ---
    variance_str = str(dna_profile.get("Sentence_Length_Variance", "")).lower()
    if "high" in variance_str:
        return 2.5
    elif "low" in variance_str:
        return 1.5

    # --- Priority 3: Keyword scan of style_instructions ---
    style_instructions = str(dna_profile.get("style_instructions", "")).lower()
    low_keywords  = ["short", "punchy", "concise", "hemingway", "minimal", "terse"]
    high_keywords = ["complex", "verbose", "academic", "dense", "elaborate", "formal"]
    if any(k in style_instructions for k in low_keywords):
        return 1.8
    if any(k in style_instructions for k in high_keywords):
        return 5.0

    # --- Priority 4: Global default ---
    return 4.0
