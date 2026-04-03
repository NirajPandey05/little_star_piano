// src/services/aiConfig.js
export const AI_CONFIG = {
  provider: import.meta.env.VITE_AI_PROVIDER || 'claude', // "claude" or "gemini"
  claude: {
    apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
    model: 'claude-sonnet-4-20250514',
    maxTokens: 150,
  },
  gemini: {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
    model: 'gemini-2.0-flash',
    maxTokens: 150,
  },
}
