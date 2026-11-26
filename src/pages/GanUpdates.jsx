import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ganUpdates, updateTypes, latestUpdateId, UPDATES_SEEN_KEY } from '../data/ganUpdates'
import './GanUpdates.css'

/* תוכן חיצוני (למשל ספרון דיגיטלי) נפתח בתוך האפליקציה ולא בחלון נפרד:
   באפליקציה מותקנת אין כפתור "חזור" של הדפדפן, וכך ההורה תמיד יכול
   לחזור לעדכונים בלחיצה על "סגירה". */
function LinkViewer({ link, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  return createPortal(
    <div className="link-viewer" role="dialog" aria-label={link.label}>
      <div className="link-viewer-bar">
        <button type="button" className="link-viewer-close" onClick={onClose}>
          ✕ סגירה
        </button>
        {/* גיבוי: אם האתר לא נטען בתוך האפליקציה, אפשר לפתוח אותו בנפרד */}
        <a
          className="link-viewer-external"
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          לא נטען? פתיחה בחלון נפרד
        </a>
      </div>
      <iframe
        className="link-viewer-frame"
        src={link.href}
        title={link.label}
        allow="fullscreen"
        allowFullScreen
      />
    </div>,
    document.body
  )
}

/* עמוד לקריאה בלבד. העדכונים נכתבים ב-src/data/ganUpdates.js ומגיעים
   לכל ההורים דרך גרסה חדשה של האפליקציה — כך שרק הגן מפרסם אותם. */
export default function GanUpdates() {
  /* צפייה בעמוד מסמנת שהעדכון האחרון נראה, וכך הנקודה האדומה
     במסך הבית נכבית. */
  useEffect(() => {
    if (!latestUpdateId) return
    try {
      localStorage.setItem(UPDATES_SEEN_KEY, latestUpdateId)
    } catch {
      /* בלי גישה ל-localStorage פשוט לא מסמנים */
    }
  }, [])

  const [openLink, setOpenLink] = useState(null)

  const getTypeConfig = (typeId) => updateTypes.find(t => t.id === typeId) || updateTypes[0]

  const sorted = [...ganUpdates].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))

  return (
    <div className="page">
      <h1 className="page-title">📋 עדכונים מהגן</h1>

      {sorted.length === 0 ? (
        <div className="gan-empty card">
          <span className="gan-empty-emoji">📋</span>
          <p className="gan-empty-text">אין עדכונים חדשים</p>
          <p className="gan-empty-desc">כשיהיה עדכון מהגן, הוא יופיע כאן</p>
        </div>
      ) : (
        <div className="gan-updates-list">
          {sorted.map((update) => {
            const typeConf = getTypeConfig(update.type)
            return (
              <div key={update.id} className={`card gan-update-item ${update.pinned ? 'pinned' : ''}`}>
                <div className="gan-update-header">
                  <span
                    className="gan-update-type-badge"
                    style={{ background: typeConf.color + '22', color: typeConf.color }}
                  >
                    {typeConf.emoji} {typeConf.label}
                  </span>
                  <span className="gan-update-date">{update.date} {update.time}</span>
                </div>
                <h3 className="gan-update-title">
                  {update.pinned && '📌 '}{update.title}
                </h3>
                {update.content && <p className="gan-update-content">{update.content}</p>}
                {update.image?.src && (
                  <img
                    className="gan-update-image"
                    src={update.image.src}
                    alt={update.image.alt || update.title}
                    loading="lazy"
                  />
                )}
                {/* קישור חיצוני — נפתח בתוך האפליקציה, עם כפתור סגירה */}
                {update.link?.href && (
                  <button
                    type="button"
                    className="gan-update-link"
                    onClick={() => setOpenLink(update.link)}
                  >
                    {update.link.label} ←
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {openLink && <LinkViewer link={openLink} onClose={() => setOpenLink(null)} />}
    </div>
  )
}
