let baseUrl = 'http://ws:3001'

export async function wsBroadcast(type: string, payload: unknown, channel?: string): Promise<void> {
  try {
    const res = await fetch(`${baseUrl}/internal/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, payload, channel }),
    })
    if (!res.ok) throw new Error(`WS ${res.status}`)
  } catch (err) {
    if (baseUrl.startsWith('http://ws:')) {
      baseUrl = 'http://localhost:3001'
      return wsBroadcast(type, payload, channel)
    }
    console.error('WS broadcast failed:', err)
  }
}
