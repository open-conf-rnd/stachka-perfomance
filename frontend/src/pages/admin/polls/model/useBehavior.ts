import { useState } from 'react'
import { apiRequest } from '@/lib/api'

export function useBehavior() {
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState<string[]>(['', ''])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const addOption = () => setOptions((prev) => [...prev, ''])
  const removeOption = (i: number) =>
    setOptions((prev) => (prev.length > 2 ? prev.filter((_, j) => j !== i) : prev))
  const setOption = (i: number, value: string) =>
    setOptions((prev) => prev.map((v, j) => (j === i ? value : v)))

  const submit = async () => {
    const opts = options.map((o) => o.trim()).filter(Boolean)
    if (!question.trim() || opts.length < 2) {
      setError('Вопрос и минимум 2 варианта ответа')
      return
    }

    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const poll = await apiRequest<{ id: string; question: string }>('/api/polls', 'POST', {
        question: question.trim(),
        options: opts,
      })
      setResult(`Опрос создан: "${poll.question}"`)
      setQuestion('')
      setOptions(['', ''])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось создать')
    } finally {
      setLoading(false)
    }
  }

  return {
    question,
    setQuestion,
    options,
    loading,
    result,
    error,
    addOption,
    removeOption,
    setOption,
    submit,
  }
}
