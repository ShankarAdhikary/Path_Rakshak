import { useState, useRef } from 'react'

const LANGUAGE_MAP = {
  hi: 'hi-IN',
  en: 'en-US',
  // Add more locales here as new languages are supported in Settings
}

export default function useVoiceInput() {
  const [transcript, setTranscript] = useState('')
  const [listening, setListening] = useState(false)
  const recRef = useRef(null)

  const supported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  function startListening() {
    if (!supported) return
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const rec = new SpeechRecognition()
    const lang = localStorage.getItem('acciguard_language') || 'en'
    rec.lang = LANGUAGE_MAP[lang] || 'en-US'
    rec.continuous = false
    rec.interimResults = false
    rec.onresult = e => setTranscript(e.results[0][0].transcript)
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    recRef.current = rec
    rec.start()
    setListening(true)
  }

  function stopListening() {
    recRef.current?.stop()
    setListening(false)
  }

  return { transcript, listening, startListening, stopListening, supported }
}
