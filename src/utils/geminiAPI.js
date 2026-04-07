export async function generateResponse(apiKey, systemContext, userMessage) {
  const key = apiKey || localStorage.getItem('acciguard_gemini_key') || import.meta.env.VITE_GEMINI_API_KEY
  if (!key) throw new Error('No API key. Please set your Gemini API key in Settings.')

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`
  const body = {
    contents: [
      {
        role: 'user',
        parts: [{ text: `${systemContext}\n\nUser: ${userMessage}` }],
      },
    ],
    generationConfig: { maxOutputTokens: 800, temperature: 0.3 },
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `API error ${res.status}`)
  }

  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI.'
}
