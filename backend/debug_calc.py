import numpy as np
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize

# Ensure NLTK data (same as utils.py)
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')
    nltk.download('punkt_tab')

input_text = (
    "Education is changing fast. It’s no longer enough to just hand out a textbook and hope for the best; the real focus now is on personalized learning. New adaptive tools have changed the game by letting teachers tweak their lessons for every student’s unique pace and needs. It works. Students stay more engaged, and the whole classroom feels more inclusive because of it. But let’s be clear: tech isn't a magic fix. Teachers are still the most important part of the equation, acting as the mentors who actually guide the journey. When you pair human connection with smart innovation, you build a foundation that actually lasts."
)

print(f"--- Input Text ---\n{input_text}\n")

sentences = sent_tokenize(input_text)
print(f"--- Sentences ({len(sentences)}) ---")
for i, s in enumerate(sentences):
    print(f"{i+1}: {s}")

print("\n--- Word Counts per Sentence ---")
lengths = []
for s in sentences:
    words = word_tokenize(s)
    count = len(words)
    lengths.append(count)
    print(f"'{s[:20]}...': {count} tokens")

print(f"\nLengths List: {lengths}")
std_dev = float(np.std(lengths))
print(f"Calculated Burstiness (Std Dev): {std_dev}")

mean = np.mean(lengths)
print(f"Mean Length: {mean}")
