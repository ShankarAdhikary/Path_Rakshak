import { useState, useEffect } from 'react'
import MapView from './MapView'
import AIChat from './AIChat'
import GoldenHourChecklist from './GoldenHourChecklist'

export default function EmergencyDashboard({ emergencyType, onBack }) {
  const [tab, setTab] = useState('chat')
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(t)
  }, [])

  const mins = Math.floor(elapsed / 60)
  const secs = elapsed % 60
  const goldenPct = Math.min((elapsed / 3600) * 100, 100)
  const timerColor = goldenPct < 50 ? 'text-green-400' : goldenPct < 80 ? 'text-yellow-400' : 'text-red-400'

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-red-900/60 px-4 py-3 flex items-center gap-3 border-b border-red-800">
        <button onClick={onBack} className="text-slate-300 text-lg p-1">‹</button>
        <div className="flex-1">
          <p className="text-xs text-slate-300">Active Emergency</p>
          <p className="font-bold text-red-300">{emergencyType}</p>
        </div>
        <div className={`text-right font-mono font-bold ${timerColor}`}>
          <p className="text-xs text-slate-400">Golden Hour</p>
          <p>{mins}:{String(secs).padStart(2,'0')}</p>
        </div>
      </div>

      {/* Quick Call */}
      <div className="flex gap-2 px-4 py-2 bg-card border-b border-slate-700">
        <a href="tel:112" className="flex-1 bg-red-700 hover:bg-red-600 text-white py-2 px-3 rounded-lg text-center text-sm font-bold flex items-center justify-center gap-1">
          📞 112 India
        </a>
        <a href="tel:911" className="flex-1 bg-red-800 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-center text-sm font-bold flex items-center justify-center gap-1">
          📞 911 US
        </a>
        <a href="tel:999" className="flex-1 bg-red-900 hover:bg-red-800 text-white py-2 px-3 rounded-lg text-center text-sm font-bold flex items-center justify-center gap-1">
          📞 999 UK
        </a>
      </div>

      {/* Golden Hour Bar */}
      <div className="px-4 py-1 bg-surface">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Golden Hour Progress</span>
          <span>{Math.round(goldenPct)}%</span>
        </div>
        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${goldenPct < 50 ? 'bg-green-500' : goldenPct < 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
            style={{ width: `${goldenPct}%` }}
          />
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex border-b border-slate-700 bg-card">
        {[['chat','💬 AI Chat'],['map','🗺️ Map'],['checklist','✅ Checklist']].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 py-3 text-sm font-medium ${tab === id ? 'text-red-400 border-b-2 border-red-400' : 'text-slate-400'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {tab === 'chat' && <AIChat emergencyType={emergencyType} />}
        {tab === 'map' && <MapView emergencyType={emergencyType} />}
        {tab === 'checklist' && <GoldenHourChecklist elapsed={elapsed} />}
      </div>
    </div>
  )
}
