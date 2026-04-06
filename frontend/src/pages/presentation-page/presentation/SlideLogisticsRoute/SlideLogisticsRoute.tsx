import { useLayoutEffect, useRef } from 'react'
import { loadYandexMaps } from '@/shared/lib/loadYandexMaps'
import './SlideLogisticsRoute.css'

const ROUTE_STOPS = [
  { city: 'Ростов-на-Дону', lat: 47.2357, lng: 39.7015 },
  { city: 'Краснодар', lat: 45.0355, lng: 38.9753 },
  { city: 'Москва', lat: 55.7558, lng: 37.6173 },
  { city: 'Ульяновск', lat: 54.3142, lng: 48.4031 },
] as const

export function SlideLogisticsRoute() {
  const apiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY?.trim()
  const shellRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!apiKey) return
    const el = shellRef.current
    if (!el) return

    let cancelled = false
    let map: YandexMap | null = null
    let obs: MutationObserver | null = null
    let resizeHandler: (() => void) | null = null
    let timeoutId = 0

    void loadYandexMaps(apiKey)
      .then(() => {
        if (cancelled || !shellRef.current) return
        const ymaps = window.ymaps
        if (!ymaps) return

        const container = shellRef.current
        map = new ymaps.Map(container, {
          center: [51.2, 42.5],
          zoom: 5,
          controls: ['zoomControl', 'fullscreenControl'],
        })

        if (cancelled) {
          map.destroy()
          map = null
          return
        }

        map.behaviors.disable('scrollZoom')

        const collection = new ymaps.GeoObjectCollection()
        const coords = ROUTE_STOPS.map((p) => [p.lat, p.lng])
        collection.add(
          new ymaps.Polyline(
            coords,
            {},
            {
              strokeColor: '#5b21b6',
              strokeWidth: 5,
              strokeOpacity: 0.88,
            },
          ),
        )

        ROUTE_STOPS.forEach((stop, index) => {
          const isEnd = index === ROUTE_STOPS.length - 1
          collection.add(
            new ymaps.Placemark(
              [stop.lat, stop.lng],
              {
                iconCaption: stop.city,
                hintContent: stop.city,
                balloonContent: stop.city,
              },
              {
                preset: isEnd ? 'islands#violetCircleDotIcon' : 'islands#blueCircleDotIcon',
              },
            ),
          )
        })

        map.geoObjects.add(collection)
        const bounds = collection.getBounds()
        if (bounds) {
          map.setBounds(bounds, {
            checkZoomRange: true,
            zoomMargin: [72, 88],
          })
        }

        const section = container.closest('section')
        if (section) {
          const fit = () => {
            if (section.classList.contains('present') && map) {
              requestAnimationFrame(() => map!.container.fitToViewport())
            }
          }
          fit()
          obs = new MutationObserver(fit)
          obs.observe(section, { attributes: true, attributeFilter: ['class'] })
          resizeHandler = fit
          window.addEventListener('resize', resizeHandler)
          timeoutId = window.setTimeout(fit, 400)
        }
      })
      .catch(() => {
        /* ключ / сеть */
      })

    return () => {
      cancelled = true
      obs?.disconnect()
      if (resizeHandler) window.removeEventListener('resize', resizeHandler)
      if (timeoutId) window.clearTimeout(timeoutId)
      map?.destroy()
    }
  }, [apiKey])

  return (
    <div className="slide-logistics-route">
      <div className="slide-logistics-route__snapshot">
        {!apiKey ? (
          <div className="slide-logistics-route__map-shell slide-logistics-route__placeholder">
            <p>
              Укажите в <code>VITE_YANDEX_MAPS_API_KEY</code> ключ из{' '}
              <a href="https://developer.tech.yandex.ru/" target="_blank" rel="noreferrer">
                кабинета разработчика Яндекса
              </a>
              , чтобы показывать карту маршрута.
            </p>
          </div>
        ) : (
          <div ref={shellRef} className="slide-logistics-route__map-shell slide-logistics-route__ymap" />
        )}
      </div>
    </div>
  )
}
