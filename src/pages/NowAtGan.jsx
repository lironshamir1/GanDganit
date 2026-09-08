import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { seasonalContent } from '../data/seasonalContent'
import './NowAtGan.css'

/* התמונה נפתחת בתוך האפליקציה ולא בכתובת חיצונית: באפליקציה
   מותקנת (standalone) אין כפתור "חזור" של הדפדפן, והורה שנפתחה
   לו התמונה בכתובת נפרדת נשאר תקוע בלי דרך חזרה. */
function ImageViewer({ image, alt, onClose }) {
  /* תמונה שכובה מוצגת מוגדלת וזזה הצידה; תמונה לגובה נשארת ברוחב
     המסך ונגללת למטה. נקבע לפי המידות האמיתיות של הקובץ. */
  const [shape, setShape] = useState('portrait')

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
        <span className="table-viewer-hint">
          {shape === 'landscape' ? 'אפשר להזיז את התמונה הצידה' : 'אפשר לקרב באצבעות כדי להגדיל'}
        </span>
      </div>

      <div
        className={`table-viewer-scroll ${shape}`}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={image}
          alt={alt}
          onLoad={(e) => setShape(
            e.target.naturalWidth > e.target.naturalHeight ? 'landscape' : 'portrait'
          )}
        />
      </div>
    </div>,
    document.body
  )
}

/* כרטיס נושא — משמש את שני מקטעי הכרטיסים בעמוד */
function TopicCard({ topic, index, total }) {
  return (
    <article className="card now-topic" style={{ '--topic-color': topic.color }}>
      <div className="now-topic-header">
        <span className="now-topic-icon" style={{ background: topic.bg }}>
          {topic.icon}
        </span>
        <h3 className="now-topic-title">{topic.title}</h3>
        <span className="now-topic-step">{index + 1}/{total}</span>
      </div>
      <ul className="now-topic-list">
        {topic.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </article>
  )
}

export default function NowAtGan() {
  const {
    badge, title, subtitle, intro,
    guideTitle, guide,
    handout,
    learningTitle, learningIntro, learning,
    closing,
  } = seasonalContent
  const [viewerImage, setViewerImage] = useState(null)

  /* תמיכה גם בתמונה בודדת (image) וגם בכמה תמונות (images) */
  const handoutImages = handout?.images ?? (
    handout?.image ? [{ src: handout.image, alt: handout.imageAlt || handout.title }] : []
  )

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
          <TopicCard key={topic.id} topic={topic} index={idx} total={guide.length} />
        ))}
      </section>

      {handout && (
        <section className="now-section">
          <h2 className="now-section-title">{handout.title}</h2>

          <div className="card now-handout">
            {handout.intro && <p className="now-handout-intro">{handout.intro}</p>}

            {handoutImages.map((img) => (
              <button
                key={img.src}
                type="button"
                className="now-handout-image"
                onClick={() => setViewerImage(img)}
              >
                <img src={img.src} alt={img.alt} />
              </button>
            ))}
            {handout.caption && handoutImages.length > 0 && (
              <p className="now-handout-caption">{handout.caption}</p>
            )}

            {handout.benefits?.length > 0 && (
              <ul className="now-handout-benefits">
                {handout.benefits.map((benefit, idx) => (
                  <li key={idx}>{benefit}</li>
                ))}
              </ul>
            )}

            {handout.credit && <p className="now-handout-credit">{handout.credit}</p>}
          </div>
        </section>
      )}

      {learning?.length > 0 && (
        <section className="now-section">
          <h2 className="now-section-title"><span aria-hidden>✨</span> {learningTitle}</h2>
          {learningIntro && <p className="now-intro">{learningIntro}</p>}

          {learning.map((topic, idx) => (
            <TopicCard key={topic.id} topic={topic} index={idx} total={learning.length} />
          ))}
        </section>
      )}

      {closing && (
        <section className="card now-closing">
          {closing.title && <p className="now-closing-title">{closing.title}</p>}
          {closing.text && <p className="now-closing-text">{closing.text}</p>}
        </section>
      )}

      {viewerImage && (
        <ImageViewer
          image={viewerImage.src}
          alt={viewerImage.alt}
          onClose={() => setViewerImage(null)}
        />
      )}
    </div>
  )
}
