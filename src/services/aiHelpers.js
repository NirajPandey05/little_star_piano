// src/services/aiHelpers.js
// Shared helpers used by both claudeProvider and geminiProvider

export function buildPrompt(context) {
  const { situation, noteName, songName, wrongAttempts } = context
  const prompts = {
    correct_note: `The child just played the note ${noteName} correctly! Celebrate!`,
    wrong_note: `The child played the wrong note. They were trying to play ${noteName}. This is attempt ${wrongAttempts}. Encourage gently.`,
    song_complete: `The child just finished playing ${songName}! They did amazing! Celebrate big!`,
    greeting: `Greet the child and invite them to play piano with you today.`,
    hint: `Give a fun hint to help the child find the ${noteName} key. Keep it playful.`,
  }
  return prompts[situation] || prompts.greeting
}

export function parseAIResponse(text) {
  try {
    const clean = text.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
  } catch {
    return { message: text.slice(0, 100), emotion: 'happy' }
  }
}

export function getFallbackResponse(situation) {
  const fallbacks = {
    correct_note: { message: "Yes! You got it! 🐸", emotion: "celebrating" },
    wrong_note: { message: "Keep trying, you're so close! 🌟", emotion: "encouraging" },
    song_complete: { message: "AMAZING! You finished the song! 🎉", emotion: "celebrating" },
    greeting: { message: "Hi! I'm Froggy! Let's play piano together! 🐸", emotion: "happy" },
    hint: { message: "Look for the key near the middle! 🎵", emotion: "thinking" },
  }
  return fallbacks[situation] || fallbacks.greeting
}
