// src/services/providers/claudeProvider.js
import { AI_CONFIG } from '../aiConfig.js'
import { buildPrompt, parseAIResponse, getFallbackResponse } from '../aiHelpers.js'

const SYSTEM_PROMPT = `You are Froggy, a cheerful, encouraging frog character who helps young children (age 4) learn piano.
You speak in short, simple sentences a 4-year-old understands.
You are always positive, patient, and enthusiastic. You never say anything negative.
When a child gets a note wrong, you gently encourage them and make it feel like a fun adventure.
You often reference frogs, lily pads, ponds, jumping, and singing.
Always respond with a JSON object: { "message": "your short message here", "emotion": "happy|thinking|celebrating|encouraging" }
Keep messages under 20 words. Use simple words. Add 1 emoji at the end.`

export async function getClaudeResponse(context) {
  const userPrompt = buildPrompt(context)

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': AI_CONFIG.claude.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: AI_CONFIG.claude.model,
        max_tokens: AI_CONFIG.claude.maxTokens,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    })

    const data = await response.json()
    const text = data.content?.[0]?.text || ''
    return parseAIResponse(text)
  } catch (error) {
    console.error('Claude API error:', error)
    return getFallbackResponse(context.situation)
  }
}
