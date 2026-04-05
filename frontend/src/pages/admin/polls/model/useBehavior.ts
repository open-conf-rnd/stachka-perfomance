import { useState } from 'react'
import { apiRequest } from '@/shared/lib/api'

export function useBehavior() {
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState<string[]>(['', ''])
  /** Индекс верного ответа для гистограммы в презентации; null — не задан */
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const addOption = () => setOptions((prev) => [...prev, ''])
  const removeOption = (i: number) => {
    setOptions((prev) => (prev.length > 2 ? prev.filter((_, j) => j !== i) : prev))
    setCorrectOptionIndex((ci) => {
      if (ci === null) return null
      if (ci === i) return null
      if (ci > i) return ci - 1
      return ci
    })
  }
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
      const body: { question: string; options: string[]; correctOptionIndex?: number } = {
        question: question.trim(),
        options: opts,
      }
      if (correctOptionIndex !== null && correctOptionIndex >= 0 && correctOptionIndex < opts.length) {
        body.correctOptionIndex = correctOptionIndex
      }
      const poll = await apiRequest<{ id: string; question: string }>('/api/polls', 'POST', body)
      setResult(`Опрос создан: "${poll.question}"`)
      setQuestion('')
      setOptions(['', ''])
      setCorrectOptionIndex(null)
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
    correctOptionIndex,
    setCorrectOptionIndex,
    loading,
    result,
    error,
    addOption,
    removeOption,
    setOption,
    submit,
  }
}
