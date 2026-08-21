import { useEffect, useState } from 'react'
import './Reminders.css'

/* v2: בלי תזכורות ברירת מחדל, ועם סימון "בוצעה" במקום מתג פעיל/כבוי.
   המפתח שונה בכוונה כדי שתזכורות הדוגמה הישנות שנשמרו אצל הורים יימחקו. */
const STORAGE_KEY = 'gandganit-reminders-v2'

const typeEmoji = {
  medication: '💊',
  therapy: '🏥',
  'self-care': '🫶',
  activity: '🎯',
  general: '🔔',
}

const typeLabels = {
  medication: 'תרופות',
  therapy: 'טיפול',
  'self-care': 'דאגה עצמית',
  activity: 'פעילות',
  general: 'כללי',
}

function loadReminders() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (Array.isArray(saved)) {
      return saved.map((rem) => ({ ...rem, done: Boolean(rem.done) }))
    }
  } catch {
    /* אם אין גישה ל-localStorage מתחילים מרשימה ריקה */
  }
  return []
}

export default function Reminders() {
  const [reminders, setReminders] = useState(loadReminders)
  const [showAdd, setShowAdd] = useState(false)
  const [newReminder, setNewReminder] = useState({ title: '', time: '', type: 'general' })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders))
    } catch {
      /* אם אין גישה ל-localStorage פשוט לא שומרים */
    }
  }, [reminders])

  const toggleDone = (id) => {
    setReminders(prev => prev.map(rem =>
      rem.id === id ? { ...rem, done: !rem.done } : rem
    ))
  }

  const addReminder = () => {
    if (!newReminder.title.trim() || !newReminder.time) return
    setReminders(prev => [...prev, {
      id: Date.now(),
      ...newReminder,
      title: newReminder.title.trim(),
      done: false,
    }].sort((a, b) => a.time.localeCompare(b.time)))
    // משאירים את הטופס פתוח ומרוקן כדי שאפשר יהיה לרשום כמה תזכורות ברצף
    setNewReminder({ title: '', time: '', type: 'general' })
  }

  const deleteReminder = (id) => {
    setReminders(prev => prev.filter(rem => rem.id !== id))
  }

  const doneCount = reminders.filter(rem => rem.done).length

  return (
    <div className="page">
      <h1 className="page-title">🔔 תזכורות</h1>

      {reminders.length === 0 ? (
        <div className="card rem-empty">
          <span className="rem-empty-icon">📝</span>
          <p className="rem-empty-title">אין כאן עדיין תזכורות</p>
          <p className="rem-empty-text">
            כתבו כאן כל מה שחשוב לזכור — ציוד לגן, תורים, טפסים לחתימה.
            לחיצה על תזכורת מסמנת שהיא בוצעה.
          </p>
        </div>
      ) : (
        <>
          <p className="rem-summary">{doneCount} מתוך {reminders.length} בוצעו</p>
          <div className="rem-list">
            {reminders.map((rem) => (
              <div key={rem.id} className={`card rem-item ${rem.done ? 'rem-done' : ''}`}>
                <button
                  type="button"
                  className="rem-main"
                  aria-pressed={rem.done}
                  onClick={() => toggleDone(rem.id)}
                >
                  <span className={`rem-check ${rem.done ? 'checked' : ''}`}>
                    {rem.done ? '✓' : ''}
                  </span>
                  <span className="rem-emoji">{typeEmoji[rem.type]}</span>
                  <span className="rem-info">
                    <span className="rem-title">{rem.title}</span>
                    <span className="rem-meta">
                      <span className="rem-time">⏰ {rem.time}</span>
                      <span className="tag rem-tag">{typeLabels[rem.type]}</span>
                    </span>
                  </span>
                </button>
                <button
                  className="rem-delete"
                  aria-label="מחיקת תזכורת"
                  onClick={() => deleteReminder(rem.id)}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {!showAdd ? (
        <button className="btn btn-primary rem-add-btn" onClick={() => setShowAdd(true)}>
          + הוסיפו תזכורת
        </button>
      ) : (
        <div className="card rem-add-form">
          <input
            className="input-field"
            placeholder="שם התזכורת"
            value={newReminder.title}
            onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
          />
          <input
            type="time"
            className="input-field"
            value={newReminder.time}
            onChange={(e) => setNewReminder(prev => ({ ...prev, time: e.target.value }))}
          />
          <select
            className="input-field"
            value={newReminder.type}
            onChange={(e) => setNewReminder(prev => ({ ...prev, type: e.target.value }))}
          >
            <option value="general">כללי</option>
            <option value="medication">תרופות</option>
            <option value="therapy">טיפול</option>
            <option value="self-care">דאגה עצמית</option>
            <option value="activity">פעילות</option>
          </select>
          <div className="rem-add-actions">
            <button className="btn btn-primary" onClick={addReminder}>הוסף</button>
            <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>סיום</button>
          </div>
          <p className="rem-add-hint">אפשר להוסיף עוד תזכורות בזו אחר זו — לחצו "סיום" כשתסיימו.</p>
        </div>
      )}
    </div>
  )
}
