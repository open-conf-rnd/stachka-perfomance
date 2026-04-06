export {}

declare global {
  interface YandexMap {
    geoObjects: { add: (o: unknown) => void }
    behaviors: { disable: (name: string) => void }
    destroy: () => void
    container: { fitToViewport: () => void }
    setBounds: (bounds: number[][], options?: Record<string, unknown>) => void
  }

  interface Window {
    ymaps?: {
      ready: (fn: () => void) => void
      Map: new (
        el: HTMLElement,
        state: Record<string, unknown>,
        options?: Record<string, unknown>
      ) => YandexMap
      Polyline: new (
        coordinates: number[][],
        properties: Record<string, unknown>,
        options: Record<string, unknown>
      ) => unknown
      Placemark: new (
        geometry: number[],
        properties: Record<string, unknown>,
        options: Record<string, unknown>
      ) => unknown
      GeoObjectCollection: new () => {
        add: (obj: unknown) => void
        getBounds: () => number[][] | null
      }
    }
  }
}
