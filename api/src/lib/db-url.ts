export function getDatabaseUrl(): string {
  const user = process.env.POSTGRES_USER
  const password = process.env.POSTGRES_PASSWORD
  const host = process.env.POSTGRES_HOST
  const port = process.env.POSTGRES_PORT
  const db = process.env.POSTGRES_DB
  const safePassword = encodeURIComponent(password!)
  return `postgresql://${user}:${safePassword}@${host}:${port}/${db}`
}
