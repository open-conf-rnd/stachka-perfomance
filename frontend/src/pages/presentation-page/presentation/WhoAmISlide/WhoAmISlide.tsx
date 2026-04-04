import './WhoAmISlide.css'

export function WhoAmISlide() {
  return (
    <div className="whoami-slide">
      <img
        src="/slides/image-4.png"
        alt="АЙТУЛАБС"
        className="whoami-slide__logo"
      />
      <div className="whoami-slide__content">
        <div className="whoami-slide__text">
          <h2>Кто я</h2>
          <p>Дима Грош</p>
          <p>Фулстек-разработчик в Айтулабс</p>
        </div>
        <img
          src="/slides/rectangle-3.png"
          alt=""
          className="whoami-slide__image"
        />
      </div>
    </div>
  )
}
