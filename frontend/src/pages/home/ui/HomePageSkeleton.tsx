const SKELETON_TILE_COUNT = 6

export function HomePageSkeleton() {
  return (
    <div
      className="home-page__skeleton-area"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Загрузка списка активностей"
    >
      <div className="grid">
        {Array.from({ length: SKELETON_TILE_COUNT }, (_, i) => (
          <div key={i} className="home-page__skeleton-tile">
            <div className="home-page__skeleton-line" />
            <div className="home-page__skeleton-line home-page__skeleton-line--short" />
          </div>
        ))}
      </div>
    </div>
  )
}
