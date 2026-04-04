export type ReactionRoundStatus = 'PENDING' | 'ACTIVE' | 'FINISHED'

export interface ReactionLeaderboardUser {
  id: string
  firstName: string
  username?: string | null
}

export interface ReactionLeaderboardItem {
  place: number
  user: ReactionLeaderboardUser
  tapTime: string
}

export interface ReactionCurrentRoundResponse {
  round: {
    id: string
    roundNumber?: number
    status: ReactionRoundStatus
  } | null
  tapsCount?: number
}

export interface ReactionRoundSummary {
  id: string
  roundNumber: number
  status: string
  createdAt: string
  participantsCount: number
}

export interface ReactionRoundDetail {
  id: string
  roundNumber: number
  status: string
  createdAt: string
  results: Array<{
    place: number
    user: ReactionLeaderboardUser
    tapTime: string
  }>
}
