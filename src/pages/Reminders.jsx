import { useEffect, useState } from 'react'
import { ganReminders, GAN_REMINDERS_DONE_KEY } from '../data/ganReminders'
import './Reminders.css'

/* עמוד לקריאה בלבד. התזכורות נכתבות ב-src/data/ganReminders.js ומגיעות
   לכל ההורים דרך גרסה חדשה של האפליקציה — כך שרק הגן מפרסם אותן.
   מה שכן שמור להורה: הסימון "בוצעה", והוא נשמר אצלו במכשיר בלבד. */
function loadDone() {
  try {
    const saved = JSON.parse(localStorage.getItem(GAN_REMINDERS_DONE_KEY))
    if (Array.isArray(saved)) return saved.filter(id => typeof id === 'string')
  } catch {
    /* אם אין גישה ל-localStorage מתחילים בלי סימונים */
  }
  return []
}

export default function Reminders() {
  const [done, setDone] = useState(loadDone)

  useEffect(() => {
    try {
      localStorage.setItem(GAN_REMINDERS_DONE_KEY, JSON.stringify(done))
    } catch {
      /* אם אין גישה ל-localStorage פשוט לא שומרים */
    }
  }, [done])

  const toggle = (id) => {
    setDone(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const doneCount = ganReminders.filter(rem => done.includes(rem.id)).length

  return (
    <div className="page">
      <h1 className="page-title">🔔 תזכורות מהגן</h1>

      {ganReminders.length === 0 ? (
        <div className="card rem-empty">
          <span className="rem-empty-icon">🔔</span>
          <p className="rem-empty-title">אין כרגע תזכורות</p>
          <p className="rem-empty-text">
            כשתהיה תזכורת מהגן, היא תופיע כאן.
          </p>
        </div>
      ) : (
        <>
          <p className="rem-summary">
            {doneCount} מתוך {ganReminders.length} בוצעו · לחיצה מסמנת שביצעתם
          </p>
          <div className="rem-list">
            {ganReminders.map((rem) => {
              const isDone = done.includes(rem.id)
              return (
                <button
                  key={rem.id}
                  type="button"
                  className={`card rem-item rem-gan-item ${isDone ? 'rem-done' : ''}`}
                  aria-pressed={isDone}
                  onClick={() => toggle(rem.id)}
                >
                  <span className={`rem-check ${isDone ? 'checked' : ''}`}>
                    {isDone ? '✓' : ''}
                  </span>
                  <span className="rem-gan-text">
                    <span className="rem-title">{rem.title}</span>
                    {rem.note && <span className="rem-gan-note">{rem.note}</span>}
                  </span>
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
