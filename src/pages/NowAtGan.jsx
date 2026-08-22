import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { seasonalContent } from '../data/seasonalContent'
import './NowAtGan.css'

/* הטבלה נפתחת בתוך האפליקציה ולא בכתובת חיצונית: באפליקציה
   מותקנת (standalone) אין כפתור "חזור" של הדפדפן, והורה שנפתחה
   לו התמונה בכתובת נפרדת נשאר תקוע בלי דרך חזרה. */
function TableViewer({ image, alt, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return createPortal(
    <div className="table-viewer" onClick={onClose}>
      <div className="table-viewer-bar">
        <button type="button" className="table-viewer-close" onClick={onClose}>
          ✕ סגירה
        </button>
        <span className="table-viewer-hint">אפשר להזיז את הטבלה הצידה</span>
      </div>

      <div className="table-viewer-scroll" onClick={(e) => e.stopPropagation()}>
        <img src={image} alt={alt} />
      </div>
    </div>,
    document.body
  )
}

export default function NowAtGan() {
  const { badge, title, subtitle, intro, guideTitle, guide, handout } = seasonalContent
  const [viewerOpen, setViewerOpen] = useState(false)

  return (
    <div className="page now-page">
      <header className="now-hero">
        {badge && <span className="now-badge">{badge}</span>}
        <h1 className="page-title now-title">{title}</h1>
        {subtitle && <p className="now-subtitle">{subtitle}</p>}
      </header>

      <section className="now-section">
        <h2 className="now-section-title"><span aria-hidden>💛</span> {guideTitle}</h2>
        {intro && <p className="now-intro">{intro}</p>}

        {guide.map((topic, idx) => (
          <article key={topic.id} className="card now-topic" style={{ '--topic-color': topic.color }}>
            <div className="now-topic-header">
              <span className="now-topic-icon" style={{ background: topic.bg }}>
                {topic.icon}
              </span>
              <h3 className="now-topic-title">{topic.title}</h3>
              <span className="now-topic-step">{idx + 1}/{guide.length}</span>
            </div>
            <ul className="now-topic-list">
              {topic.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      {handout && (
        <section className="now-section">
          <h2 className="now-section-title"><span aria-hidden>🗓️</span> {handout.title}</h2>

          <div className="card now-handout">
            {handout.intro && <p className="now-handout-intro">{handout.intro}</p>}

            {handout.image && (
              <button
                type="button"
                className="now-handout-image"
                onClick={() => setViewerOpen(true)}
              >
                <img src={handout.image} alt={handout.imageAlt || handout.title} />
              </button>
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

      {viewerOpen && handout?.image && (
        <TableViewer
          image={handout.image}
          alt={handout.imageAlt || handout.title}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </div>
  )
}
