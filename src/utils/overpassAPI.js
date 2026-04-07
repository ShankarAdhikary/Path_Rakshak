import localforage from 'localforage'
import fallbackData from '../data/emergencyServices.json'

const CACHE_TTL = 30 * 60 * 1000 // 30 minutes

function getTypeFromTags(tags) {
  if (tags.amenity === 'hospital' || tags.amenity === 'clinic' || tags.healthcare) return 'hospital'
  if (tags.amenity === 'police') return 'police'
  if (tags.amenity === 'ambulance_station' || tags.emergency === 'ambulance_station') return 'ambulance'
  if (tags.amenity === 'car_repair' || tags.shop === 'car_repair' || tags.shop === 'tyres') return 'towing'
  return null
}

export async function fetchNearbyServices(lat, lng, radiusKm = 5) {
  const cacheKey = `services_${lat.toFixed(2)}_${lng.toFixed(2)}`

  try {
    const cached = await localforage.getItem(cacheKey)
    if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data
  } catch {}

  const radius = radiusKm * 1000
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"~"hospital|clinic|police|ambulance_station"]["name"](around:${radius},${lat},${lng});
      node["shop"~"car_repair|tyres"]["name"](around:${radius},${lat},${lng});
      node["healthcare"]["name"](around:${radius},${lat},${lng});
    );
    out body;
  `

  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) throw new Error('Overpass error')
    const json = await res.json()

    const services = json.elements
      .map(el => {
        const type = getTypeFromTags(el.tags || {})
        if (!type) return null
        return {
          type,
          name: el.tags?.name || el.tags?.['name:en'] || null,
          lat: el.lat,
          lng: el.lon,
          phone: el.tags?.phone || el.tags?.['contact:phone'] || null,
          address: el.tags?.['addr:full'] || el.tags?.['addr:street'] || null,
        }
      })
      .filter(Boolean)

    await localforage.setItem(cacheKey, { data: services, ts: Date.now() })
    return services.length > 0 ? services : getFallback(lat, lng)
  } catch {
    return getFallback(lat, lng)
  }
}

function getFallback(lat, lng) {
  let best = null, bestDist = Infinity
  for (const city of fallbackData.cities) {
    const d = Math.hypot(city.lat - lat, city.lng - lng)
    if (d < bestDist) { bestDist = d; best = city }
  }
  return best ? best.services : fallbackData.cities[0].services
}
