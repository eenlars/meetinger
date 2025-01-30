export const usd_per_million_output_tokens = {
  'deepseek-chat': 0.28,
  'deepseek-reasoner': 2.19,
}

export const usd_per_million_input_tokens = {
  'deepseek-chat': 0.14,
  'deepseek-reasoner': 0.55,
}

// Price calculation breakdown:
// 1. Whisper audio processing: $0.006/min
// 2. Deepseek-chat processing:
//    - 140 words per minute (audio length)
//    - 0.75 words per token → ~187 tokens per minute (140 / 0.75)
//    - Cost: 187 tokens/min * $0.14/million = $0.00002618/min
export const usd_per_minute = {
  'whisper-1': 0.006,
  'whisper-and-deepseek-chat':
    0.006 +
    (140 / 0.75 / 1_000_000) * (usd_per_million_input_tokens['deepseek-chat'] + usd_per_million_output_tokens['deepseek-chat']),
}
