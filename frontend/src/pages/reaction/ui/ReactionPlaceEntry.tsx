interface ReactionPlaceEntryProps {
  place: number
  firstName: string
  username?: string | null
}

export function ReactionPlaceEntry({ place, firstName, username }: ReactionPlaceEntryProps) {
  return (
    <div>
      {place}. {firstName}
      {username ? ` (@${username})` : ''}
    </div>
  )
}
