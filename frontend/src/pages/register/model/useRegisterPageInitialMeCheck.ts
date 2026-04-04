import { fetchMe } from '@/entities/auth'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

type Args = {
  setError: (message: string) => void
  setChecking: (value: boolean) => void
}

/** Первичная проверка `/api/me` на экране регистрации: редирект если уже зарегистрирован. */
export function useRegisterPageInitialMeCheck({ setError, setChecking }: Args): void {
  const navigate = useNavigate()

  useEffect(() => {
    const ac = new AbortController()

    async function load() {
      try {
        const me = await fetchMe(ac.signal)
        if (ac.signal.aborted) return
        if (me.registered) {
          navigate('/', { replace: true })
        }
      } catch (err) {
        if (ac.signal.aborted) return
        setError(err instanceof Error ? err.message : 'Не удалось проверить регистрацию')
      } finally {
        if (!ac.signal.aborted) setChecking(false)
      }
    }
    
    load()
    return () => ac.abort()
  }, [])
}
