/** Ключ Cloud Storage (только A–Z, a–z, 0–9, _ и -). */
export const BINGO_START_PARAM_CONSUMED_KEY = 'bingo-start-param-consumed'

function cloudStorage() {
  return window.Telegram?.WebApp?.CloudStorage
}

/**
 * Флаг «startapp=bingo уже обработан».
 * В Telegram — Cloud Storage; иначе sessionStorage (мок, браузер, старый клиент).
 */
export async function getBingoStartParamConsumed(): Promise<boolean> {
  const cs = cloudStorage()
  const getItem = cs?.getItem
  if (!getItem) {
    return sessionStorage.getItem(BINGO_START_PARAM_CONSUMED_KEY) === '1'
  }
  return new Promise((resolve) => {
    getItem(BINGO_START_PARAM_CONSUMED_KEY, (err, value) => {
      if (err != null) {
        resolve(sessionStorage.getItem(BINGO_START_PARAM_CONSUMED_KEY) === '1')
        return
      }
      resolve(value === '1')
    })
  })
}

export async function setBingoStartParamConsumed(): Promise<void> {
  const cs = cloudStorage()
  const setItem = cs?.setItem
  if (!setItem) {
    sessionStorage.setItem(BINGO_START_PARAM_CONSUMED_KEY, '1')
    return
  }
  return new Promise((resolve) => {
    setItem(BINGO_START_PARAM_CONSUMED_KEY, '1', (err) => {
      if (err != null) {
        sessionStorage.setItem(BINGO_START_PARAM_CONSUMED_KEY, '1')
      }
      resolve()
    })
  })
}
