import { useState } from 'react'

export default function Settings() {
  // API key is stored in localStorage only on user's explicit action (user-controlled, device-local)
  // Prefer VITE_GEMINI_API_KEY env var for non-interactive deployments
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('acciguard_gemini_key') || '')
  const [country, setCountry] = useState(() => localStorage.getItem('acciguard_country') || 'India')
  const [lang, setLang] = useState(() => localStorage.getItem('acciguard_language') || 'en')
  const [saved, setSaved] = useState(false)
  const [cacheStatus, setCacheStatus] = useState('')

  function save() {
    try {
      if (apiKey) localStorage.setItem('acciguard_gemini_key', apiKey)
      localStorage.setItem('acciguard_country', country)
      localStorage.setItem('acciguard_language', lang)
    } catch {}
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function cacheOfflineData() {
    setCacheStatus('Caching…')
    try {
      const urls = ['/manifest.json', '/sw.js']
      await Promise.all(urls.map(u => fetch(u)))
      localStorage.setItem('acciguard_cache_ts', new Date().toISOString())
      setCacheStatus('✅ Cached at ' + new Date().toLocaleTimeString())
    } catch {
      setCacheStatus('❌ Cache failed — check connection')
    }
  }

  function clearCache() {
    if ('caches' in window) caches.keys().then(keys => keys.forEach(k => caches.delete(k)))
    localStorage.removeItem('acciguard_cache_ts')
    setCacheStatus('Cache cleared')
  }

  const Row = ({ label, children }) => (
    <div className="mb-5">
      <label className="block text-sm text-slate-300 mb-1.5 font-medium">{label}</label>
      {children}
    </div>
  )

  return (
    <div className="p-4">
      <h2 className="font-bold text-lg mb-6">⚙️ Settings</h2>

      <div className="bg-card rounded-xl p-4 mb-4">
        <p className="text-xs text-slate-400 font-semibold uppercase mb-3">AI Configuration</p>
        <Row label="🔑 Gemini API Key">
          <input
            type="password"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="AIza..."
            className="w-full bg-slate-800 text-slate-100 px-3 py-2.5 rounded-lg border border-slate-600 text-sm"
          />
          <p className="text-xs text-slate-500 mt-1">Get free key at <span className="text-blue-400">aistudio.google.com</span></p>
        </Row>
      </div>

      <div className="bg-card rounded-xl p-4 mb-4">
        <p className="text-xs text-slate-400 font-semibold uppercase mb-3">Localization</p>
        <Row label="🌍 Country">
          <select
            value={country}
            onChange={e => setCountry(e.target.value)}
            className="w-full bg-slate-800 text-slate-100 px-3 py-2.5 rounded-lg border border-slate-600 text-sm"
          >
            <option value="India">🇮🇳 India (112)</option>
            <option value="US">🇺🇸 United States (911)</option>
            <option value="UK">🇬🇧 United Kingdom (999)</option>
            <option value="Australia">🇦🇺 Australia (000)</option>
          </select>
        </Row>
        <Row label="🌐 Language">
          <select
            value={lang}
            onChange={e => setLang(e.target.value)}
            className="w-full bg-slate-800 text-slate-100 px-3 py-2.5 rounded-lg border border-slate-600 text-sm"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी (Hindi)</option>
          </select>
        </Row>
      </div>

      <div className="bg-card rounded-xl p-4 mb-4">
        <p className="text-xs text-slate-400 font-semibold uppercase mb-3">Offline & Cache</p>
        {localStorage.getItem('acciguard_cache_ts') && (
          <p className="text-xs text-green-400 mb-2">✅ Last cached: {new Date(localStorage.getItem('acciguard_cache_ts')).toLocaleString()}</p>
        )}
        {cacheStatus && <p className="text-xs text-slate-400 mb-2">{cacheStatus}</p>}
        <div className="flex gap-2">
          <button onClick={cacheOfflineData} className="flex-1 bg-blue-700 text-white py-2.5 rounded-lg text-sm font-bold">📥 Download Offline Data</button>
          <button onClick={clearCache} className="px-4 bg-slate-700 text-slate-300 py-2.5 rounded-lg text-sm">Clear Cache</button>
        </div>
      </div>

      <button
        onClick={save}
        className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-bold text-base"
      >
        {saved ? '✅ Saved!' : 'Save Settings'}
      </button>
    </div>
  )
}
