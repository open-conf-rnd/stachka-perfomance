const defaultWsUrl = 'http://ws:3001'
function getWsBaseUrl(): string {
  return process.env.WS_BROADCAST_URL ?? defaultWsUrl
}

export async function wsBroadcast(type: string, payload: unknown, channel?: string): Promise<void> {
  const baseUrl = getWsBaseUrl()
  try {
    const res = await fetch(`${baseUrl}/internal/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, payload, channel }),
    })
    if (!res.ok) {
      throw new Error(`WS broadcast ${res.status}`)
    }
  } catch (err) {
    if (baseUrl === defaultWsUrl && !process.env.WS_BROADCAST_URL) {
      const fallback = 'http://localhost:3001'
      try {
        const res = await fetch(`${fallback}/internal/broadcast`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, payload, channel }),
        })
        if (res.ok) return
      } catch {
        // ignore
      }
    }
    console.error('[ws-broadcast] failed', { type, channel, err })
  }
}
