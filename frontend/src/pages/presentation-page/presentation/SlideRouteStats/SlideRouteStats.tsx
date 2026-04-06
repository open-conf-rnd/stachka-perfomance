import './SlideRouteStats.css'

const LEGS = [
  { segment: 'Ростов-на-Дону → Краснодар', distance: '~251 км' },
  { segment: 'Краснодар → Москва', distance: '~1196 км' },
  { segment: 'Москва → Ульяновск', distance: '~705 км' },
] as const

export function SlideRouteStats() {
  return (
    <div className="slide-route-stats">
      <div className="slide-route-stats__table-wrap">
        <table className="slide-route-stats__table">
          <thead>
            <tr>
              <th scope="col">Участок</th>
              <th scope="col">Расстояние</th>
            </tr>
          </thead>
          <tbody>
            {LEGS.map((row) => (
              <tr key={row.segment}>
                <td>{row.segment}</td>
                <td>{row.distance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="slide-route-stats__total">
        Итого: ~2150 км.
      </p>
    </div>
  )
}
