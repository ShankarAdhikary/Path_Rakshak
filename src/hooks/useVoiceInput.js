import { useState, useRef } from 'react'

export default function useVoiceInput() {
  const [transcript, setTranscript] = useState('')
  const [listening, setListening] = useState(false)
  const recRef = useRef(null)

  const supported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  function startListening() {
    if (!supported) return
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const rec = new SpeechRecognition()
    rec.lang = localStorage.getItem('acciguard_language') === 'hi' ? 'hi-IN' : 'en-US'
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
