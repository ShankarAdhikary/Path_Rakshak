import { useState } from 'react'

const EMPTY = { name: '', age: '', blood: '', allergies: '', conditions: '', ecName: '', ecPhone: '' }
const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown']

export default function MedicalID() {
  const [data, setData] = useState(() => {
    try { return JSON.parse(localStorage.getItem('acciguard_medical_id')) || EMPTY } catch { return EMPTY }
  })
  const [editing, setEditing] = useState(!data.name)
  const [saved, setSaved] = useState(false)

  function save() {
    try { localStorage.setItem('acciguard_medical_id', JSON.stringify(data)) } catch {}
    setSaved(true)
    setEditing(false)
    setTimeout(() => setSaved(false), 2000)
  }

  function share() {
    const text = `🩺 Medical ID — ${data.name}\nAge: ${data.age} | Blood: ${data.blood}\nAllergies: ${data.allergies || 'None'}\nConditions: ${data.conditions || 'None'}\nEmergency Contact: ${data.ecName} — ${data.ecPhone}`
    if (navigator.share) navigator.share({ title: 'My Medical ID', text })
    else navigator.clipboard?.writeText(text)
  }

  const field = (label, key, type = 'text', opts) => (
    <div className="mb-4">
      <label className="block text-xs text-slate-400 mb-1">{label}</label>
      {type === 'select' ? (
        <select
          value={data[key]}
          onChange={e => setData(d => ({ ...d, [key]: e.target.value }))}
          disabled={!editing}
          className="w-full bg-slate-800 text-slate-100 px-3 py-2.5 rounded-lg border border-slate-600 text-sm"
        >
          <option value="">Select…</option>
          {opts.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input
          type={type}
          value={data[key]}
          onChange={e => setData(d => ({ ...d, [key]: e.target.value }))}
          disabled={!editing}
          className="w-full bg-slate-800 text-slate-100 px-3 py-2.5 rounded-lg border border-slate-600 text-sm disabled:opacity-70"
        />
      )}
    </div>
  )

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-lg">🩺 Medical ID</h2>
        <div className="flex gap-2">
          {!editing && (
            <button onClick={share} className="px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg text-sm">📤 Share</button>
          )}
          <button
            onClick={() => editing ? save() : setEditing(true)}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold ${editing ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
          >
            {editing ? (saved ? '✓ Saved!' : 'Save') : 'Edit'}
          </button>
        </div>
      </div>

      {/* Card Preview */}
      {!editing && data.name && (
        <div className="bg-red-900/30 border border-red-700 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-2xl">🆘</div>
            <div>
              <p className="font-bold text-lg">{data.name}</p>
              <p className="text-slate-400 text-sm">Age: {data.age} • Blood: <span className="text-red-400 font-bold">{data.blood}</span></p>
            </div>
          </div>
          {data.allergies && <p className="text-sm text-orange-300 mb-1">⚠️ Allergies: {data.allergies}</p>}
          {data.conditions && <p className="text-sm text-yellow-300 mb-1">💊 Conditions: {data.conditions}</p>}
          {data.ecName && (
            <div className="mt-3 pt-3 border-t border-red-800">
              <p className="text-xs text-slate-400">Emergency Contact</p>
              <p className="font-medium">{data.ecName}</p>
              <a href={`tel:${data.ecPhone}`} className="text-red-400 text-sm">📞 {data.ecPhone}</a>
            </div>
          )}
        </div>
      )}

      {editing && (
        <div className="bg-card rounded-xl p-4">
          {field('Full Name', 'name')}
          {field('Age', 'age', 'number')}
          {field('Blood Type', 'blood', 'select', BLOOD_TYPES)}
          {field('Allergies (comma separated)', 'allergies')}
          {field('Medical Conditions', 'conditions')}
          <p className="text-xs text-slate-400 mb-2 mt-4 font-semibold">Emergency Contact</p>
          {field('Contact Name', 'ecName')}
          {field('Contact Phone', 'ecPhone', 'tel')}
        </div>
      )}
    </div>
  )
}
