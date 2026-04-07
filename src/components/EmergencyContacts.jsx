import { useState } from 'react'

function load() {
  try { return JSON.parse(localStorage.getItem('acciguard_contacts')) || [] } catch { return [] }
}

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState(load)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ name: '', relation: '', phone: '' })

  function save(list) {
    setContacts(list)
    try { localStorage.setItem('acciguard_contacts', JSON.stringify(list)) } catch {}
  }

  function add() {
    if (!form.name || !form.phone) return
    save([...contacts, { ...form, id: Date.now() }])
    setForm({ name: '', relation: '', phone: '' })
    setAdding(false)
  }

  function remove(id) {
    save(contacts.filter(c => c.id !== id))
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg">📞 Emergency Contacts</h2>
        <button onClick={() => setAdding(true)} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold">+ Add</button>
      </div>

      {contacts.length === 0 && !adding && (
        <p className="text-slate-500 text-center py-8 text-sm">No emergency contacts yet.<br />Add contacts for quick access during emergencies.</p>
      )}

      <div className="space-y-3 mb-4">
        {contacts.map(c => (
          <div key={c.id} className="bg-card border border-slate-700 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-lg">👤</div>
            <div className="flex-1">
              <p className="font-medium">{c.name}</p>
              <p className="text-xs text-slate-400">{c.relation}</p>
            </div>
            <a href={`tel:${c.phone}`} className="bg-green-700 text-white px-3 py-2 rounded-lg text-sm mr-1">📞</a>
            <button onClick={() => remove(c.id)} className="bg-red-900 text-red-300 px-3 py-2 rounded-lg text-sm">✕</button>
          </div>
        ))}
      </div>

      {adding && (
        <div className="bg-card border border-slate-600 rounded-xl p-4">
          <p className="font-semibold mb-3">Add Contact</p>
          {[['Name', 'name', 'text'], ['Relation', 'relation', 'text'], ['Phone', 'phone', 'tel']].map(([label, key, type]) => (
            <div key={key} className="mb-3">
              <label className="block text-xs text-slate-400 mb-1">{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full bg-slate-800 text-slate-100 px-3 py-2.5 rounded-lg border border-slate-600 text-sm"
              />
            </div>
          ))}
          <div className="flex gap-2 mt-4">
            <button onClick={add} className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-bold">Add</button>
            <button onClick={() => setAdding(false)} className="px-4 bg-slate-700 text-slate-300 py-2.5 rounded-lg">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
