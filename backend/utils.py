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
