from utils import calculate_burstiness, calculate_grade_level, calculate_unique_ratio, detect_ai_watermarks
# Importing from the new package structure to verify it works
from agents import WriterAgent, CriticAgent, ProfilerAgent

robotic_text = "The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog."
human_text = "Hey, did you see that? The fox just jumped! It was crazy fast."
watermark_text = "Moreover, we must delve into the crucial realm of AI."

print("--- Robotic Text ---")
print(f"Burstiness: {calculate_burstiness(robotic_text)}")
print(f"Grade: {calculate_grade_level(robotic_text)}")

print("\n--- Human Text ---")
print(f"Burstiness: {calculate_burstiness(human_text)}")
print(f"Grade: {calculate_grade_level(human_text)}")

print("\n--- Watermark Check ---")
print(f"Found: {detect_ai_watermarks(watermark_text)}")
