import { useState, useEffect, useRef } from 'react'
import { generateResponse } from '../utils/geminiAPI'
import useVoiceInput from '../hooks/useVoiceInput'
import useLocation from '../hooks/useLocation'

function getApiKey() {
  return (
    import.meta.env.VITE_GEMINI_API_KEY ||
    localStorage.getItem('acciguard_gemini_key') ||
    ''
  )
}

const INITIAL_PROMPTS = {
  'Road Accident': 'There has been a road accident. What should I do immediately?',
  'Medical Emergency': 'There is a medical emergency. What are the first steps I should take?',
  'Vehicle Breakdown': 'My vehicle has broken down on the road. What should I do to stay safe?',
}

export default function AIChat({ emergencyType }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiKey, setApiKey] = useState(getApiKey)
  const [showKeyInput, setShowKeyInput] = useState(!getApiKey())
  const scrollRef = useRef(null)
  const { lat, lng } = useLocation()
  const { transcript, listening, startListening, supported: voiceSupported } = useVoiceInput()

  useEffect(() => {
    if (transcript) setInput(transcript)
  }, [transcript])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  useEffect(() => {
    const initMsg = INITIAL_PROMPTS[emergencyType] || INITIAL_PROMPTS['Road Accident']
    sendMessage(initMsg, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function sendMessage(text, isAuto = false) {
    const key = getApiKey()
    if (!key) { setShowKeyInput(true); return }
    if (!text.trim()) return
    const userMsg = { role: 'user', text, auto: isAuto }
    setMessages(prev => [...prev, userMsg])
    if (!isAuto) setInput('')
    setLoading(true)
    try {
      const context = `Emergency type: ${emergencyType}. ${lat ? `User location: ${lat.toFixed(4)}, ${lng.toFixed(4)}.` : ''} You are AcciGuard AI, an emergency response assistant. Provide concise, actionable first-aid and emergency guidance. Always recommend calling 112 (India) or local emergency services first.`
      const reply = await generateResponse(key, context, text)
      setMessages(prev => [...prev, { role: 'assistant', text: reply }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', text: `⚠️ Error: ${e.message}. Please check your API key in Settings or call 112 directly.` }])
    } finally {
      setLoading(false)
    }
  }

  function saveKey(k) {
    localStorage.setItem('acciguard_gemini_key', k)
    setApiKey(k)
    setShowKeyInput(false)
  }

  return (
    <div className="flex flex-col h-full" style={{ minHeight: '400px' }}>
      {showKeyInput && (
        <ApiKeyPrompt onSave={saveKey} onClose={() => setShowKeyInput(false)} />
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: '50vh' }}>
        {messages.length === 0 && (
          <div className="text-center text-slate-500 text-sm py-8">
            <p className="text-2xl mb-2">🤖</p>
            <p>AI is ready. Ask anything about your emergency.</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              m.role === 'user'
                ? 'bg-red-700 text-white rounded-br-sm'
                : 'bg-card border border-slate-600 text-slate-100 rounded-bl-sm'
            }`}>
              {m.role === 'assistant' && <span className="text-xs text-slate-400 block mb-1">🤖 AcciGuard AI</span>}
              <p className="whitespace-pre-wrap">{m.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-card border border-slate-600 px-4 py-3 rounded-2xl rounded-bl-sm">
              <span className="text-slate-400 text-sm">🤖 Thinking</span>
              <span className="inline-flex gap-1 ml-2">
                {[0,1,2].map(i => <span key={i} className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-slate-700 p-3 flex gap-2 bg-card">
        {voiceSupported && (
          <button
            onClick={startListening}
            className={`p-3 rounded-xl ${listening ? 'bg-red-600 animate-pulse' : 'bg-slate-700'} text-white min-w-[48px]`}
            aria-label="Voice input"
          >
            🎤
          </button>
        )}
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
          placeholder="Describe the emergency…"
          className="flex-1 bg-slate-800 text-slate-100 px-4 py-3 rounded-xl outline-none border border-slate-600 focus:border-red-500 text-sm"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim()}
          className="bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white px-4 py-3 rounded-xl font-bold min-w-[48px]"
        >
          ➤
        </button>
      </div>

      <div className="px-4 pb-2 text-center">
        <button onClick={() => setShowKeyInput(true)} className="text-xs text-slate-500 underline">
          {apiKey ? 'Change API key' : 'Set Gemini API key'}
        </button>
      </div>
    </div>
  )
}

function ApiKeyPrompt({ onSave, onClose }) {
  const [val, setVal] = useState('')
  return (
    <div className="bg-yellow-900/40 border border-yellow-700 mx-4 mt-4 p-4 rounded-xl">
      <p className="text-yellow-300 text-sm font-bold mb-1">🔑 Gemini API Key Required</p>
      <p className="text-slate-400 text-xs mb-3">Get a free key at <span className="text-blue-400">aistudio.google.com</span></p>
      <input
        value={val}
        onChange={e => setVal(e.target.value)}
        placeholder="AIza..."
        className="w-full bg-slate-800 text-slate-100 px-3 py-2 rounded-lg text-sm border border-slate-600 mb-2"
      />
      <div className="flex gap-2">
        <button onClick={() => onSave(val)} className="flex-1 bg-yellow-600 text-white py-2 rounded-lg text-sm font-bold">Save Key</button>
        <button onClick={onClose} className="px-4 bg-slate-700 text-slate-300 py-2 rounded-lg text-sm">Skip</button>
      </div>
    </div>
  )
}
