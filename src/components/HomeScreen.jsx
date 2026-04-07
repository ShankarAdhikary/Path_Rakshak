import { useState } from 'react'
import SOSButton from './SOSButton'

const TYPES = [
  { id: 'Road Accident', emoji: '🚗', label: 'Road Accident', color: 'border-red-600 bg-red-950/40' },
  { id: 'Medical Emergency', emoji: '🏥', label: 'Medical Emergency', color: 'border-orange-600 bg-orange-950/40' },
  { id: 'Vehicle Breakdown', emoji: '🔧', label: 'Vehicle Breakdown', color: 'border-yellow-600 bg-yellow-950/40' },
]

export default function HomeScreen({ onActivate }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="flex flex-col items-center px-4 pt-8 pb-4 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-red-500 mb-1">🛡️ AcciGuard AI</h1>
        <p className="text-slate-400 text-sm">Golden Hour Companion</p>
      </div>

      <div className="flex flex-col items-center mb-10">
        <p className="text-slate-300 text-sm mb-6">Tap SOS for immediate emergency assistance</p>
        <SOSButton onPress={() => setShowModal(true)} />
      </div>

      <p className="text-slate-400 text-xs mb-4">— or select emergency type —</p>

      <div className="w-full grid grid-cols-1 gap-3">
        {TYPES.map(t => (
          <button
            key={t.id}
            onClick={() => onActivate(t.id)}
            className={`flex items-center gap-4 p-4 rounded-xl border ${t.color} text-left w-full min-h-[56px]`}
          >
            <span className="text-3xl">{t.emoji}</span>
            <div>
              <p className="font-semibold text-slate-100">{t.label}</p>
              <p className="text-xs text-slate-400">Tap to get immediate help</p>
            </div>
            <span className="ml-auto text-slate-400">›</span>
          </button>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-center mb-2">🚨 Emergency Type</h2>
            <p className="text-slate-400 text-sm text-center mb-6">Select what happened</p>
            {TYPES.map(t => (
              <button
                key={t.id}
                onClick={() => { setShowModal(false); onActivate(t.id) }}
                className={`flex items-center gap-4 p-4 rounded-xl border ${t.color} w-full mb-3`}
              >
                <span className="text-2xl">{t.emoji}</span>
                <span className="font-medium">{t.label}</span>
              </button>
            ))}
            <button onClick={() => setShowModal(false)} className="w-full py-3 text-slate-400 text-sm">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
