import { useState } from 'react'

const STEPS = [
  { id: 1, time: '0–2 min', urgency: 'critical', text: 'Ensure you and others are safe — move away from traffic', checked: false },
  { id: 2, time: '0–2 min', urgency: 'critical', text: 'Call 112 (India) or local emergency number immediately', checked: false },
  { id: 3, time: '2–5 min', urgency: 'critical', text: 'Do NOT move the victim if spinal injury is suspected', checked: false },
  { id: 4, time: '2–5 min', urgency: 'critical', text: 'Control severe bleeding: apply firm pressure with cloth', checked: false },
  { id: 5, time: '5–10 min', urgency: 'urgent', text: 'Keep victim conscious: talk to them, check breathing', checked: false },
  { id: 6, time: '5–10 min', urgency: 'urgent', text: 'Cover victim with blanket/jacket to prevent shock', checked: false },
  { id: 7, time: '10–20 min', urgency: 'important', text: 'Take photos of the scene for insurance/police report', checked: false },
  { id: 8, time: '10–20 min', urgency: 'important', text: 'Collect witness names and contact information', checked: false },
  { id: 9, time: '20–40 min', urgency: 'normal', text: 'Note other vehicle details (number plate, insurance)', checked: false },
  { id: 10, time: '20–40 min', urgency: 'normal', text: 'Do not admit fault at scene', checked: false },
  { id: 11, time: '40–60 min', urgency: 'normal', text: 'Request copy of police report / FIR number', checked: false },
  { id: 12, time: '40–60 min', urgency: 'normal', text: 'Contact insurance company as soon as stable', checked: false },
]

const URGENCY_STYLES = {
  critical: { bg: 'bg-red-900/40 border-red-700', badge: 'bg-red-600', label: '🔴 Critical' },
  urgent: { bg: 'bg-orange-900/40 border-orange-700', badge: 'bg-orange-600', label: '🟠 Urgent' },
  important: { bg: 'bg-yellow-900/40 border-yellow-700', badge: 'bg-yellow-600', label: '🟡 Important' },
  normal: { bg: 'bg-slate-800/40 border-slate-600', badge: 'bg-slate-600', label: '🟢 When Stable' },
}

export default function GoldenHourChecklist({ elapsed = 0 }) {
  const [items, setItems] = useState(STEPS)

  function toggle(id) {
    setItems(prev => prev.map(s => s.id === id ? { ...s, checked: !s.checked } : s))
  }

  const done = items.filter(i => i.checked).length

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg">Golden Hour Checklist</h2>
        <span className="text-sm text-slate-400">{done}/{items.length} done</span>
      </div>

      {/* Progress */}
      <div className="w-full h-2 bg-slate-700 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-green-500 rounded-full transition-all"
          style={{ width: `${(done / items.length) * 100}%` }}
        />
      </div>

      <div className="space-y-2">
        {items.map(item => {
          const style = URGENCY_STYLES[item.urgency]
          return (
            <button
              key={item.id}
              onClick={() => toggle(item.id)}
              className={`w-full text-left p-4 rounded-xl border flex items-start gap-3 transition-opacity ${style.bg} ${item.checked ? 'opacity-50' : ''}`}
            >
              <div className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${item.checked ? 'bg-green-600 border-green-600' : 'border-slate-500'}`}>
                {item.checked && <span className="text-white text-xs">✓</span>}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${style.badge} text-white`}>{item.time}</span>
                </div>
                <p className={`text-sm ${item.checked ? 'line-through text-slate-500' : 'text-slate-200'}`}>{item.text}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
