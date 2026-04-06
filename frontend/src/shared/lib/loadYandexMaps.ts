/** Однократная загрузка JS API 2.1 Яндекс.Карт (https://yandex.ru/dev/maps/jsapi/doc/2.1/). */
let loadPromise: Promise<void> | null = null

export function loadYandexMaps(apiKey: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (loadPromise) return loadPromise

  loadPromise = new Promise((resolve, reject) => {
    if (window.ymaps) {
      window.ymaps.ready(() => resolve())
      return
    }

    const script = document.createElement('script')
    script.async = true
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(apiKey)}&lang=ru_RU`
    script.onload = () => {
      if (!window.ymaps) {
        reject(new Error('Yandex Maps: window.ymaps не определён'))
        return
      }
      window.ymaps.ready(() => resolve())
    }
    script.onerror = () => reject(new Error('Yandex Maps: не удалось загрузить скрипт'))
    document.head.appendChild(script)
  })

  return loadPromise
}
