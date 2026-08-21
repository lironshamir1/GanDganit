import { useState, useEffect } from 'react'
import './GanUpdates.css'

const STORAGE_KEY = 'gandganit-gan-updates'

const defaultUpdates = [
  {
    title: 'מפגש זום עם לילך הקלינאית',
    content: 'מחר ה-17/3 בשעה 10:00 ניפגש בזום עם לילך הקלינאית. נבקש מכל ילד להביא בובת חיה למפגש. מצפות לפגוש אותכם!',
    type: 'event',
    date: '16.3.2026',
    time: '08:00',
    pinned: true,
  },
]

function loadUpdates() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return defaultUpdates
}

const updateTypes = [
  { id: 'general', label: 'כללי', emoji: '📢', color: '#7EC8C8' },
  { id: 'event', label: 'אירוע', emoji: '🎉', color: '#F8C8A4' },
  { id: 'health', label: 'בריאות', emoji: '🏥', color: '#F5C6D0' },
  { id: 'reminder', label: 'תזכורת', emoji: '📌', color: '#B8A9D4' },
  { id: 'menu', label: 'תפריט', emoji: '🍽️', color: '#A8D5BA' },
  { id: 'trip', label: 'טיול', emoji: '🚌', color: '#F2A07B' },
]

export default function GanUpdates() {
  const [updates, setUpdates] = useState(loadUpdates)
  const [showAdd, setShowAdd] = useState(false)
  const [newUpdate, setNewUpdate] = useState({ title: '', content: '', type: 'general' })
  const [editIdx, setEditIdx] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updates))
  }, [updates])

  /* צפייה בעמוד מסמנת שהעדכון האחרון נראה, וכך הנקודה האדומה
     במסך הבית נכבית. חייב לקרות כאן ולא במסך הבית: שם הנתונים
     עדיין לא נשמרו ב-localStorage בכניסה הראשונה של הורה. */
  useEffect(() => {
    if (updates.length === 0) return
    try {
      localStorage.setItem('gandganit-updates-last-seen', updates[0]?.date + ' ' + updates[0]?.time)
    } catch {
      /* בלי גישה ל-localStorage פשוט לא מסמנים */
    }
  }, [updates])

  const addUpdate = () => {
    if (!newUpdate.title.trim()) return
    const update = {
      ...newUpdate,
      date: new Date().toLocaleDateString('he-IL'),
      time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
    }
    let updated
    if (editIdx !== null) {
      updated = [...updates]
      updated[editIdx] = { ...updated[editIdx], ...update }
      setEditIdx(null)
    } else {
      updated = [update, ...updates]
    }
    setUpdates(updated)
    setNewUpdate({ title: '', content: '', type: 'general' })
    setShowAdd(false)
  }

  const deleteUpdate = (idx) => {
    setUpdates(prev => prev.filter((_, i) => i !== idx))
  }

  const startEdit = (idx) => {
    const u = updates[idx]
    setNewUpdate({ title: u.title, content: u.content, type: u.type })
    setEditIdx(idx)
    setShowAdd(true)
  }

  const pinUpdate = (idx) => {
    setUpdates(prev => {
      const updated = [...prev]
      updated[idx] = { ...updated[idx], pinned: !updated[idx].pinned }
      return updated.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
    })
  }

  const getTypeConfig = (typeId) => updateTypes.find(t => t.id === typeId) || updateTypes[0]

  return (
    <div className="page">
      <h1 className="page-title">📋 עדכונים מהגן</h1>

      <button
        className="btn btn-primary gan-add-btn"
        onClick={() => { setEditIdx(null); setNewUpdate({ title: '', content: '', type: 'general' }); setShowAdd(true) }}
      >
        + הוסיפו עדכון
      </button>

      {showAdd && (
        <div className="card gan-add-form">
          <h3 className="gan-form-title">{editIdx !== null ? '✏️ עריכת עדכון' : '📝 עדכון חדש'}</h3>
          <input
            className="input-field"
            placeholder="כותרת העדכון"
            value={newUpdate.title}
            onChange={(e) => setNewUpdate(prev => ({ ...prev, title: e.target.value }))}
          />
          <textarea
            className="input-field gan-content-input"
            placeholder="פירוט (אופציונלי)"
            value={newUpdate.content}
            onChange={(e) => setNewUpdate(prev => ({ ...prev, content: e.target.value }))}
            rows={3}
          />
          <div className="gan-type-picker">
            {updateTypes.map(t => (
              <button
                key={t.id}
                className={`gan-type-btn ${newUpdate.type === t.id ? 'selected' : ''}`}
                style={{ '--type-color': t.color }}
                onClick={() => setNewUpdate(prev => ({ ...prev, type: t.id }))}
              >
                {t.emoji} {t.label}
              </button>
            ))}
          </div>
          <div className="gan-form-actions">
            <button className="btn btn-primary" onClick={addUpdate}>{editIdx !== null ? 'שמירה' : 'פרסום'}</button>
            <button className="btn btn-secondary" onClick={() => { setShowAdd(false); setEditIdx(null) }}>ביטול</button>
          </div>
        </div>
      )}

      {updates.length === 0 ? (
        <div className="gan-empty card">
          <span className="gan-empty-emoji">📋</span>
          <p className="gan-empty-text">אין עדכונים עדיין</p>
          <p className="gan-empty-desc">הוסיפו עדכון ראשון מהגן</p>
        </div>
      ) : (
        <div className="gan-updates-list">
          {updates.map((update, idx) => {
            const typeConf = getTypeConfig(update.type)
            return (
              <div key={idx} className={`card gan-update-item ${update.pinned ? 'pinned' : ''}`}>
                <div className="gan-update-header">
                  <span className="gan-update-type-badge" style={{ background: typeConf.color + '22', color: typeConf.color }}>
                    {typeConf.emoji} {typeConf.label}
                  </span>
                  <span className="gan-update-date">{update.date} {update.time}</span>
                </div>
                <h3 className="gan-update-title">
                  {update.pinned && '📌 '}{update.title}
                </h3>
                {update.content && <p className="gan-update-content">{update.content}</p>}
                <div className="gan-update-actions">
                  <button className="gan-action-btn" onClick={() => pinUpdate(idx)}>{update.pinned ? '📌' : '📍'}</button>
                  <button className="gan-action-btn" onClick={() => startEdit(idx)}>✏️</button>
                  <button className="gan-action-btn" onClick={() => deleteUpdate(idx)}>🗑️</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
