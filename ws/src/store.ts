import type { StatsPayload } from './types.js'

export interface PollState {
  question: string
  optionIds: string[]
  optionLabels: Record<string, string>
  counts: Record<string, number>
}

const polls = new Map<string, PollState>()

export function getOrCreatePoll(
  pollId: string,
  meta?: { question?: string; optionIds?: string[]; optionLabels?: Record<string, string> }
): PollState {
  let state = polls.get(pollId)
  if (!state) {
    state = {
      question: meta?.question ?? '',
      optionIds: meta?.optionIds ?? [],
      optionLabels: meta?.optionLabels ?? {},
      counts: {},
    }
    polls.set(pollId, state)
  } else if (meta) {
    if (meta.question !== undefined && !state.question) state.question = meta.question
    if (meta.optionIds?.length && !state.optionIds.length) state.optionIds = meta.optionIds
    if (meta.optionLabels && Object.keys(state.optionLabels).length === 0) state.optionLabels = meta.optionLabels
  }
  return state
}

export function addVote(pollId: string, optionId: string): void {
  const state = getOrCreatePoll(pollId)
  state.counts[optionId] = (state.counts[optionId] ?? 0) + 1
}

export function buildStatsPayload(pollId: string): StatsPayload | null {
  const state = polls.get(pollId)
  if (!state) return null
  const total = Object.values(state.counts).reduce((s, n) => s + n, 0)
  return {
    pollId,
    question: state.question,
    optionIds: state.optionIds,
    optionLabels: state.optionLabels,
    counts: { ...state.counts },
    total,
  }
}
