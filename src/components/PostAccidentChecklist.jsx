import { useState } from 'react'

const SECTIONS = [
  {
    title: '📸 Evidence Collection',
    color: 'border-blue-700 bg-blue-900/20',
    items: [
      'Photograph all vehicles from multiple angles',
      'Photo of skid marks, road conditions, traffic signs',
      'Screenshot map showing accident location',
      'Photo of your injuries before treatment',
      'Video walkthrough of accident scene',
    ],
  },
  {
    title: '📋 Information Exchange',
    color: 'border-yellow-700 bg-yellow-900/20',
    items: [
      'Other driver name, phone, address',
      'Other vehicle: registration, make, model, color',
      'Other driver insurance company + policy number',
      'Witness names and contact numbers',
      'Police officer name and badge number',
    ],
  },
  {
    title: '🏥 Medical',
    color: 'border-red-700 bg-red-900/20',
    items: [
      'Seek medical attention even if feeling okay',
      'Keep all medical records and bills',
      'Document all symptoms in writing with dates',
      'Follow-up doctor appointments scheduled',
    ],
  },
  {
    title: '📑 Legal & Insurance',
    color: 'border-green-700 bg-green-900/20',
    items: [
      'File FIR (First Information Report) with police',
      'Note FIR number for reference',
      'Notify insurance company within 24 hours',
      'Do NOT sign any documents from other party',
      'Keep copy of all documents filed',
    ],
  },
]

export default function PostAccidentChecklist() {
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem('acciguard_post_checklist')) || {} } catch { return {} }
  })

  function toggle(key) {
    const next = { ...checked, [key]: !checked[key] }
    setChecked(next)
    try { localStorage.setItem('acciguard_post_checklist', JSON.stringify(next)) } catch {}
  }

  const total = SECTIONS.reduce((s, sec) => s + sec.items.length, 0)
  const done = Object.values(checked).filter(Boolean).length

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-bold text-lg">📋 Post-Accident Checklist</h2>
        <span className="text-sm text-slate-400">{done}/{total}</span>
      </div>
      <div className="w-full h-2 bg-slate-700 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${total ? (done/total)*100 : 0}%` }} />
      </div>

      {SECTIONS.map(sec => (
        <div key={sec.title} className={`border rounded-xl p-4 mb-4 ${sec.color}`}>
          <p className="font-semibold mb-3">{sec.title}</p>
          {sec.items.map((item, idx) => {
            const key = `${sec.title}-${idx}`
            return (
              <button key={idx} onClick={() => toggle(key)} className="w-full flex items-start gap-3 py-2 text-left">
                <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border ${checked[key] ? 'bg-green-600 border-green-600' : 'border-slate-500'}`}>
                  {checked[key] && <span className="text-white text-xs">✓</span>}
                </div>
                <p className={`text-sm ${checked[key] ? 'line-through text-slate-500' : 'text-slate-200'}`}>{item}</p>
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
