import { useEffect, useState } from 'react'
import './Reminders.css'

const STORAGE_KEY = 'gandganit-reminders'

const defaultReminders = [
  { id: 1, title: 'תרופה בוקר', time: '08:00', type: 'medication', active: true },
  { id: 2, title: 'פיזיותרפיה', time: '10:00', type: 'therapy', active: true },
  { id: 3, title: 'רגע בשבילך — הפסקה!', time: '14:00', type: 'self-care', active: true },
  { id: 4, title: 'קלינאית תקשורת', time: '16:00', type: 'therapy', active: false },
]

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

/* טוען את התזכורות השמורות; בפעם הראשונה מחזיר את ברירת המחדל */
function loadReminders() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (Array.isArray(saved)) return saved
  } catch {
    /* אם אין גישה ל-localStorage נופלים חזרה לברירת המחדל */
  }
  return defaultReminders
}

export default function Reminders() {
  const [reminders, setReminders] = useState(loadReminders)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders))
    } catch {
      /* אם אין גישה ל-localStorage פשוט לא שומרים */
    }
  }, [reminders])
  const [showAdd, setShowAdd] = useState(false)
  const [newReminder, setNewReminder] = useState({ title: '', time: '', type: 'general' })

  const toggleReminder = (id) => {
    setReminders(prev => prev.map(r =>
      r.id === id ? { ...r, active: !r.active } : r
    ))
  }

  const addReminder = () => {
    if (!newReminder.title.trim() || !newReminder.time) return
    setReminders(prev => [...prev, {
      id: Date.now(),
      ...newReminder,
      active: true
    }].sort((a, b) => a.time.localeCompare(b.time)))
    // משאירים את הטופס פתוח ומרוקן כדי שאפשר יהיה לרשום כמה תזכורות ברצף
    setNewReminder({ title: '', time: '', type: 'general' })
  }

  const deleteReminder = (id) => {
    setReminders(prev => prev.filter(r => r.id !== id))
  }

  return (
    <div className="page">
      <h1 className="page-title">🔔 תזכורות</h1>

      <div className="rem-list">
        {reminders.map((rem) => (
          <div key={rem.id} className={`card rem-item ${!rem.active ? 'rem-inactive' : ''}`}>
            <div className="rem-main" onClick={() => toggleReminder(rem.id)}>
              <span className="rem-emoji">{typeEmoji[rem.type]}</span>
              <div className="rem-info">
                <h3 className="rem-title">{rem.title}</h3>
                <div className="rem-meta">
                  <span className="rem-time">⏰ {rem.time}</span>
                  <span className="tag" style={{ background: rem.active ? '#E8F5E9' : '#f5f5f5' }}>
                    {typeLabels[rem.type]}
                  </span>
                </div>
              </div>
              <div className={`rem-toggle ${rem.active ? 'active' : ''}`}>
                <div className="rem-toggle-dot" />
              </div>
            </div>
            <button className="rem-delete" onClick={() => deleteReminder(rem.id)}>🗑️</button>
          </div>
        ))}
      </div>

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
