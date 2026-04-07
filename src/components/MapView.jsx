import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import { fetchNearbyServices } from '../utils/overpassAPI'
import useLocation from '../hooks/useLocation'

// Fix Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function makeIcon(color) {
  return L.divIcon({
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 0 4px rgba(0,0,0,0.5)"></div>`,
    className: '',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  })
}

const TYPE_CONFIG = {
  hospital: { color: '#ef4444', label: '🔴 Hospital/Trauma' },
  police: { color: '#3b82f6', label: '🔵 Police Station' },
  ambulance: { color: '#eab308', label: '🟡 Ambulance' },
  towing: { color: '#22c55e', label: '🟢 Towing/Repair' },
}

function RecenterMap({ lat, lng }) {
  const map = useMap()
  useEffect(() => { if (lat && lng) map.setView([lat, lng], 14) }, [lat, lng, map])
  return null
}

export default function MapView() {
  const { lat, lng, error: locError } = useLocation()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (!lat || !lng) return
    setLoading(true)
    setStatus('Fetching nearby services…')
    fetchNearbyServices(lat, lng)
      .then(data => { setServices(data); setStatus(`Found ${data.length} services`) })
      .catch(() => setStatus('Using offline data'))
      .finally(() => setLoading(false))
  }, [lat, lng])

  const center = lat && lng ? [lat, lng] : [28.6139, 77.2090]

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 280px)' }}>
      {/* Status */}
      <div className="px-4 py-2 bg-card text-xs text-slate-400 flex items-center justify-between">
        <span>{locError ? '⚠️ ' + locError : lat ? `📍 ${lat.toFixed(4)}, ${lng.toFixed(4)}` : '📡 Getting location…'}</span>
        <span>{loading ? '⏳ Loading…' : status}</span>
      </div>

      {/* Legend */}
      <div className="px-4 py-2 bg-surface flex gap-3 flex-wrap text-xs">
        {Object.values(TYPE_CONFIG).map(c => (
          <span key={c.label} className="flex items-center gap-1 text-slate-300">{c.label}</span>
        ))}
      </div>

      {/* Map */}
      <div className="flex-1">
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {lat && lng && (
            <>
              <RecenterMap lat={lat} lng={lng} />
              <Circle center={[lat, lng]} radius={50} pathOptions={{ color: '#dc2626', fillColor: '#dc2626', fillOpacity: 0.3 }} />
              <Marker position={[lat, lng]}>
                <Popup><strong>📍 Your Location</strong></Popup>
              </Marker>
            </>
          )}
          {services.map((s, i) => (
            <Marker key={i} position={[s.lat, s.lng]} icon={makeIcon(TYPE_CONFIG[s.type]?.color || '#888')}>
              <Popup>
                <strong>{TYPE_CONFIG[s.type]?.label || s.type}</strong><br />
                {s.name || 'Unnamed'}<br />
                {s.address && <span>{s.address}<br /></span>}
                {s.phone && <a href={`tel:${s.phone}`}>📞 {s.phone}</a>}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}
