/* ============================================================================
   עמוד "עכשיו בגן" — הנושא הנוכחי מוצג למעלה במלואו (בלי תיקייה),
   ומתחתיו "מה כבר היה בגן": ארכיון של תיקיות סגורות, מהחדשה לישנה.
   כדי להוסיף נושא חדש בעתיד — מוסיפים פריט חדש בראש המערך entries
   בקובץ src/data/seasonalContent.js. אין צורך לשנות את הקובץ הזה:
   הנושא הקודם עובר מעצמו לתיקייה בארכיון.
   ========================================================================== */

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
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
function TopicCard({ topic, index, total, onOpenImage }) {
  return (
    <article className="card now-topic" style={{ '--topic-color': topic.color }}>
      <div className="now-topic-header">
        <span className="now-topic-icon" style={{ background: topic.bg }}>
          {topic.icon}
        </span>
        <h3 className="now-topic-title">{topic.title}</h3>
        {/* מונה שלבים רק כשיש יותר מכרטיס אחד — "1/1" לא אומר כלום */}
        {total > 1 && <span className="now-topic-step">{index + 1}/{total}</span>}
      </div>
      <ul className="now-topic-list">
        {topic.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      {topic.images?.map((img) => (
        <button
          key={img.src}
          type="button"
          className="now-handout-image now-topic-image"
          onClick={() => onOpenImage(img)}
        >
          <img src={img.src} alt={img.alt} loading="lazy" />
        </button>
      ))}
      {/* קישור חיצוני (href) נפתח בכרטיסייה חדשה; קישור פנימי (to) נשאר באפליקציה */}
      {topic.link?.href && (
        <a className="now-topic-link" href={topic.link.href} target="_blank" rel="noopener noreferrer">
          {topic.link.label} ←
        </a>
      )}
      {topic.link?.to && (
        <Link className="now-topic-link" to={topic.link.to}>
          {topic.link.label} ←
        </Link>
      )}
      {/* הדגשה במסגרת — הטקסט והקישור שלו יושבים יחד */}
      {topic.note && (
        <aside className="now-topic-note">
          <p className="now-topic-note-text">{topic.note.text}</p>
          {topic.note.link && (
            <Link className="now-topic-link now-topic-link-strong" to={topic.note.link.to}>
              {topic.note.link.label} ←
            </Link>
          )}
        </aside>
      )}
    </article>
  )
}

/* התוכן של נושא אחד — אותם מקטעים שהיו בעמוד העונתי */
/* סיפור על פעילות בגן — פסקאות ומתחתן גלריית תמונות.
   תמונה שהקובץ שלה עדיין לא נמצא ב-public מוסתרת, במקום להציג תמונה שבורה. */
function StoryCard({ story, onOpenImage }) {
  const [missing, setMissing] = useState([])
  const images = (story.images || []).filter((img) => !missing.includes(img.src))

  return (
    <article className="card now-story">
      {story.paragraphs?.map((text, i) => (
        <p key={i} className="now-story-text">{text}</p>
      ))}
      {images.length > 0 && (
        <div className={`now-story-gallery${images.length > 1 ? ' is-multi' : ''}`}>
          {images.map((img) => (
            <button
              key={img.src}
              type="button"
              className="now-handout-image"
              onClick={() => onOpenImage(img)}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                onError={() => setMissing((prev) => [...prev, img.src])}
              />
            </button>
          ))}
        </div>
      )}
    </article>
  )
}

function EntryBody({ entry, onOpenImage }) {
  const { intro, story, guideTitle, guide, handout, learningTitle, learningIntro, learning, closing } = entry

  /* תמיכה גם בתמונה בודדת (image) וגם בכמה תמונות (images) */
  const handoutImages = handout?.images ?? (
    handout?.image ? [{ src: handout.image, alt: handout.imageAlt || handout.title }] : []
  )

  return (
    <>
      {story && (
        <section className="now-section">
          <StoryCard story={story} onOpenImage={onOpenImage} />
        </section>
      )}

      {(guideTitle || intro || guide?.length > 0) && (
        <section className="now-section">
          {guideTitle && <h3 className="now-section-title">{guideTitle}</h3>}
          {intro && <p className="now-intro">{intro}</p>}

          {guide?.map((topic, idx) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              index={idx}
              total={guide.length}
              onOpenImage={onOpenImage}
            />
          ))}
        </section>
      )}

      {handout && (
        <section className="now-section">
          <h3 className="now-section-title">{handout.title}</h3>

          <div className="card now-handout">
            {handout.intro && <p className="now-handout-intro">{handout.intro}</p>}

            {handoutImages.map((img) => (
              <button
                key={img.src}
                type="button"
                className="now-handout-image"
                onClick={() => onOpenImage(img)}
              >
                <img src={img.src} alt={img.alt} loading="lazy" />
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
          {learningTitle && <h3 className="now-section-title">{learningTitle}</h3>}
          {learningIntro && <p className="now-intro">{learningIntro}</p>}

          {learning.map((topic, idx) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              index={idx}
              total={learning.length}
              onOpenImage={onOpenImage}
            />
          ))}
        </section>
      )}

      {closing && (
        <section className="card now-closing">
          {closing.title && <p className="now-closing-title">{closing.title}</p>}
          {closing.text && <p className="now-closing-text">{closing.text}</p>}
        </section>
      )}
    </>
  )
}

export default function NowAtGan() {
  /* הנושא הנוכחי מוצג ישירות; כל השאר בארכיון (החלוקה נעשית בקובץ התוכן) */
  const { title, current, archive: past, emptyText } = seasonalContent
  const [viewerImage, setViewerImage] = useState(null)
  /* תיקיות הארכיון סגורות כברירת מחדל ונפתחות בלחיצה */
  const [openIds, setOpenIds] = useState([])

  const toggle = (id) => {
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  return (
    <div className="page now-page">
      <header className="now-hero">
        <h1 className="page-title now-title">{title}</h1>
        {current && (
          <p className="now-subtitle">
            {current.emoji} {current.title}
          </p>
        )}
        {current?.subtitle && <p className="now-archive-hint">{current.subtitle}</p>}
      </header>

      {current ? (
        <EntryBody entry={current} onOpenImage={setViewerImage} />
      ) : (
        <p className="card now-empty">{emptyText}</p>
      )}

      {past.length > 0 && (
        <section className="now-archive">
          <h2 className="now-section-title">📂 מה כבר היה בגן</h2>
          <p className="now-archive-hint now-archive-intro">
            מהחדש לישן · לחצו על תיקייה כדי לפתוח
          </p>

          <div className="now-folders">
            {past.map((entry) => {
              const isOpen = openIds.includes(entry.id)
              const panelId = `now-folder-${entry.id}`
              return (
                <section
                  key={entry.id}
                  className={`card now-folder${isOpen ? ' is-open' : ''}`}
                >
                  <h3 className="now-folder-heading">
                    <button
                      type="button"
                      className="now-folder-toggle"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggle(entry.id)}
                    >
                      <span className="now-folder-emoji" aria-hidden="true">{entry.emoji}</span>
                      <span className="now-folder-text">
                        <span className="now-folder-title">{entry.title}</span>
                        {entry.subtitle && <span className="now-folder-subtitle">{entry.subtitle}</span>}
                      </span>
                      <span className="now-folder-chevron" aria-hidden="true">⌄</span>
                    </button>
                  </h3>

                  {isOpen && (
                    <div id={panelId} className="now-folder-body">
                      <EntryBody entry={entry} onOpenImage={setViewerImage} />
                    </div>
                  )}
                </section>
              )
            })}
          </div>
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
