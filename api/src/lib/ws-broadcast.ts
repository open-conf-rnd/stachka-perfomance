const WS_INTERNAL_URL = process.env.WS_INTERNAL_URL || 'http://localhost:3001'

export async function wsBroadcast(type: string, payload: unknown, channel?: string): Promise<void> {
  try {
    await fetch(`${WS_INTERNAL_URL}/internal/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, payload, channel }),
    })
  } catch (err) {
    console.error('WS broadcast failed:', err)
  }
}
