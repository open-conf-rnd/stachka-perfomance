/** Ключ sessionStorage: «startapp=bingo уже обработан в этой сессии WebView». */
export const BINGO_START_PARAM_CONSUMED_KEY = 'bingo-start-param-consumed'

/**
 * Флаг «startapp=bingo уже обработан» — только sessionStorage на сессию Mini App.
 * Раньше писали в Cloud Storage: значение жило вечно, повторное сканирование QR
 * с ?startapp=bingo не вело на /bingo; то же после скана QR на странице /qr.
 */
export function getBingoStartParamConsumed(): Promise<boolean> {
  return Promise.resolve(sessionStorage.getItem(BINGO_START_PARAM_CONSUMED_KEY) === '1')
}

export function setBingoStartParamConsumed(): Promise<void> {
  sessionStorage.setItem(BINGO_START_PARAM_CONSUMED_KEY, '1')
  return Promise.resolve()
}
