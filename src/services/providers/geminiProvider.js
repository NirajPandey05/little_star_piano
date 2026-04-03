// src/services/providers/geminiProvider.js
import { AI_CONFIG } from '../aiConfig.js'
import { buildPrompt, parseAIResponse, getFallbackResponse } from '../aiHelpers.js'

const SYSTEM_INSTRUCTION = `You are Froggy, a cheerful, encouraging frog character who helps young children (age 4) learn piano.
You speak in short, simple sentences a 4-year-old understands.
You are always positive, patient, and enthusiastic. You never say anything negative.
Always respond with a JSON object: { "message": "your short message here", "emotion": "happy|thinking|celebrating|encouraging" }
Keep messages under 20 words. Use simple words. Add 1 emoji at the end.`

export async function getGeminiResponse(context) {
  const userPrompt = buildPrompt(context)
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${AI_CONFIG.gemini.model}:generateContent?key=${AI_CONFIG.gemini.apiKey}`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents: [{ parts: [{ text: userPrompt }] }],
        generationConfig: { maxOutputTokens: AI_CONFIG.gemini.maxTokens },
      }),
    })

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    return parseAIResponse(text)
  } catch (error) {
    console.error('Gemini API error:', error)
    return getFallbackResponse(context.situation)
  }
}
