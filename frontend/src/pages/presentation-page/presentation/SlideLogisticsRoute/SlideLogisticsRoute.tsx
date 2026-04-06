import { useEffect, useMemo } from 'react'
import L from 'leaflet'
import {
  CircleMarker,
  MapContainer,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './SlideLogisticsRoute.css'

const ROUTE_STOPS = [
  { city: 'Ростов-на-Дону', lat: 47.2357, lng: 39.7015 },
  { city: 'Краснодар', lat: 45.0355, lng: 38.9753 },
  { city: 'Москва', lat: 55.7558, lng: 37.6173 },
  { city: 'Ульяновск', lat: 54.3142, lng: 48.4031 },
] as const

function FitRouteBounds({ positions }: { positions: L.LatLngExpression[] }) {
  const map = useMap()
  useEffect(() => {
    if (positions.length === 0) return
    const bounds = L.latLngBounds(positions)
    map.fitBounds(bounds, { padding: [72, 88], maxZoom: 6 })
  }, [map, positions])
  return null
}

/** Reveal.js двигает слайды через transform — Leaflet нужно пересчитать размер при появлении слайда. */
function MapRevealSync() {
  const map = useMap()
  useEffect(() => {
    const el = map.getContainer()
    const section = el.closest('section')
    if (!section) return

    const invalidate = () => {
      if (section.classList.contains('present')) {
        requestAnimationFrame(() => {
          map.invalidateSize()
        })
      }
    }

    invalidate()
    const obs = new MutationObserver(invalidate)
    obs.observe(section, { attributes: true, attributeFilter: ['class'] })
    window.addEventListener('resize', invalidate)
    const t = window.setTimeout(invalidate, 400)

    return () => {
      obs.disconnect()
      window.removeEventListener('resize', invalidate)
      window.clearTimeout(t)
    }
  }, [map])
  return null
}

export function SlideLogisticsRoute() {
  const line = useMemo(
    () => ROUTE_STOPS.map((p) => [p.lat, p.lng] as L.LatLngExpression),
    [],
  )

  return (
    <div className="slide-logistics-route">
      <div className="slide-logistics-route__snapshot">
        <div className="slide-logistics-route__map-shell">
          <MapContainer
            center={[51.2, 42.5]}
            zoom={5}
            minZoom={4}
            maxZoom={12}
            scrollWheelZoom={false}
            dragging
            preferCanvas
            className="slide-logistics-route__leaflet"
            style={{ width: '100%', height: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Polyline
              positions={line}
              pathOptions={{
                color: '#5b21b6',
                weight: 5,
                opacity: 0.88,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
            {ROUTE_STOPS.map((stop, index) => (
              <CircleMarker
                key={stop.city}
                center={[stop.lat, stop.lng]}
                radius={index === ROUTE_STOPS.length - 1 ? 11 : 8}
                pathOptions={{
                  color: '#312e81',
                  weight: 2,
                  fillColor: index === ROUTE_STOPS.length - 1 ? '#4f46e5' : '#6366f1',
                  fillOpacity: 0.95,
                }}
              >
                <Tooltip
                  direction="top"
                  offset={[0, -6]}
                  opacity={1}
                  permanent
                  className="slide-logistics-route__city-tooltip"
                >
                  {stop.city}
                </Tooltip>
              </CircleMarker>
            ))}
            <FitRouteBounds positions={line} />
            <MapRevealSync />
          </MapContainer>
        </div>
      </div>
    </div>
  )
}
