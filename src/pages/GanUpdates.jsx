import { useEffect } from 'react'
import { ganUpdates, updateTypes, latestUpdateId, UPDATES_SEEN_KEY } from '../data/ganUpdates'
import './GanUpdates.css'

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
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
