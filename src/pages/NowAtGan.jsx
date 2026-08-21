import { seasonalContent } from '../data/seasonalContent'
import './NowAtGan.css'

export default function NowAtGan() {
  const { badge, title, subtitle, intro, guideTitle, guide, handout } = seasonalContent

  return (
    <div className="page now-page">
      <header className="now-hero">
        {badge && <span className="now-badge">{badge}</span>}
        <h1 className="page-title now-title">{title}</h1>
        {subtitle && <p className="now-subtitle">{subtitle}</p>}
      </header>

      <section className="now-section">
        <h2 className="now-section-title">💛 {guideTitle}</h2>
        {intro && <p className="now-intro card">{intro}</p>}

        {guide.map((topic) => (
          <article key={topic.id} className="card now-topic" style={{ '--topic-color': topic.color }}>
            <div className="now-topic-header">
              <span className="now-topic-icon" style={{ background: topic.bg }}>
                {topic.icon}
              </span>
              <h3 className="now-topic-title">{topic.title}</h3>
            </div>
            <ul className="now-topic-list">
              {topic.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      {handout && (
        <section className="now-section">
          <h2 className="now-section-title">🗓️ {handout.title}</h2>

          <div className="card now-handout">
            {handout.intro && <p className="now-handout-intro">{handout.intro}</p>}

            {handout.image && (
              <a
                className="now-handout-image"
                href={handout.image}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={handout.image} alt={handout.imageAlt || handout.title} />
              </a>
            )}
            {handout.caption && <p className="now-handout-caption">{handout.caption}</p>}

            {handout.benefits?.length > 0 && (
              <ul className="now-handout-benefits">
                {handout.benefits.map((benefit, idx) => (
                  <li key={idx}>{benefit}</li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
