// src/services/aiService.js
import { AI_CONFIG } from './aiConfig.js'
import { getClaudeResponse } from './providers/claudeProvider.js'
import { getGeminiResponse } from './providers/geminiProvider.js'

/**
 * Get a character response from the AI guide (Froggy)
 * @param {object} context
 * @param {string} context.situation - "correct_note" | "wrong_note" | "song_complete" | "greeting" | "hint"
 * @param {string} context.noteName - The note being targeted (e.g. "C")
 * @param {string} context.songName - Current song name
 * @param {number} context.wrongAttempts - How many times child got it wrong
 * @param {string} context.childName - Optional child's name
 * @returns {Promise<{message: string, emotion: string}>}
 */
export async function getFroggyResponse(context) {
  const provider = AI_CONFIG.provider
  if (provider === 'gemini') {
    return getGeminiResponse(context)
  }
  return getClaudeResponse(context) // default
}
