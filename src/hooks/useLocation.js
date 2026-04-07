import { useState, useEffect } from 'react'

export default function useLocation() {
  const [state, setState] = useState({ lat: null, lng: null, error: null, loading: true })

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ lat: null, lng: null, error: 'Geolocation not supported', loading: false })
      return
    }
    const id = navigator.geolocation.watchPosition(
      pos => setState({ lat: pos.coords.latitude, lng: pos.coords.longitude, error: null, loading: false }),
      err => setState(s => ({ ...s, error: 'Location denied — using default', loading: false })),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    )
    return () => navigator.geolocation.clearWatch(id)
  }, [])

  return state
}
