import { useEffect, useState } from 'react'
import { ganReminders, GAN_REMINDERS_DONE_KEY } from '../data/ganReminders'
import './Reminders.css'

/* v3: תזכורת היא שם בלבד — בלי שעה ובלי קטגוריה.
   האפליקציה לא מצלצלת ולא שולחת התראות, ולכן שעה רק הטעתה.
   המפתח שונה כדי שתזכורות בפורמט הישן לא ייגררו לכאן. */
const STORAGE_KEY = 'gandganit-reminders-v3'

function loadReminders() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (Array.isArray(saved)) {
      return saved
        .filter(rem => rem && typeof rem.title === 'string')
        .map(rem => ({ id: rem.id, title: rem.title, done: Boolean(rem.done) }))
    }
  } catch {
    /* אם אין גישה ל-localStorage מתחילים מרשימה ריקה */
  }
  return []
}

/* תזכורות הגן עצמן מגיעות מהקוד; רק הסימון "בוצעה" הוא של ההורה */
function loadGanDone() {
  try {
    const saved = JSON.parse(localStorage.getItem(GAN_REMINDERS_DONE_KEY))
    if (Array.isArray(saved)) return saved.filter(id => typeof id === 'string')
  } catch {
    /* אם אין גישה ל-localStorage מתחילים בלי סימונים */
  }
  return []
}

export default function Reminders() {
  const [reminders, setReminders] = useState(loadReminders)
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState('')
  const [ganDone, setGanDone] = useState(loadGanDone)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders))
    } catch {
      /* אם אין גישה ל-localStorage פשוט לא שומרים */
    }
  }, [reminders])

  useEffect(() => {
    try {
      localStorage.setItem(GAN_REMINDERS_DONE_KEY, JSON.stringify(ganDone))
    } catch {
      /* אם אין גישה ל-localStorage פשוט לא שומרים */
    }
  }, [ganDone])

  const toggleGanDone = (id) => {
    setGanDone(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const toggleDone = (id) => {
    setReminders(prev => prev.map(rem =>
      rem.id === id ? { ...rem, done: !rem.done } : rem
    ))
  }

  const openAdd = () => {
    setEditingId(null)
    setDraft('')
    setFormOpen(true)
  }

  const openEdit = (rem) => {
    setEditingId(rem.id)
    setDraft(rem.title)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditingId(null)
    setDraft('')
  }

  const saveDraft = () => {
    const title = draft.trim()
    if (!title) return

    if (editingId !== null) {
      setReminders(prev => prev.map(rem =>
        rem.id === editingId ? { ...rem, title } : rem
      ))
      closeForm()
      return
    }

    setReminders(prev => [...prev, { id: Date.now(), title, done: false }])
    // בהוספה משאירים את הטופס פתוח ומרוקן כדי שאפשר יהיה לרשום כמה תזכורות ברצף
    setDraft('')
  }

  const deleteReminder = (id) => {
    setReminders(prev => prev.filter(rem => rem.id !== id))
    if (editingId === id) closeForm()
  }

  const isEditing = editingId !== null
  const doneCount = reminders.filter(rem => rem.done).length

  return (
    <div className="page">
      <h1 className="page-title">🔔 תזכורות</h1>

      {ganReminders.length > 0 && (
        <section className="rem-gan-section">
          <h2 className="rem-section-title">📌 תזכורות מהגן</h2>
          <div className="rem-list">
            {ganReminders.map((rem) => {
              const done = ganDone.includes(rem.id)
              return (
                <button
                  key={rem.id}
                  type="button"
                  className={`card rem-item rem-gan-item ${done ? 'rem-done' : ''}`}
                  aria-pressed={done}
                  onClick={() => toggleGanDone(rem.id)}
                >
                  <span className={`rem-check ${done ? 'checked' : ''}`}>
                    {done ? '✓' : ''}
                  </span>
                  <span className="rem-gan-text">
                    <span className="rem-title">{rem.title}</span>
                    {rem.note && <span className="rem-gan-note">{rem.note}</span>}
                  </span>
                </button>
              )
            })}
          </div>
        </section>
      )}

      <h2 className="rem-section-title">📝 התזכורות שלי</h2>

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
              <div
                key={rem.id}
                className={`card rem-item ${rem.done ? 'rem-done' : ''} ${editingId === rem.id ? 'rem-editing' : ''}`}
              >
                <button
                  type="button"
                  className="rem-main"
                  aria-pressed={rem.done}
                  onClick={() => toggleDone(rem.id)}
                >
                  <span className={`rem-check ${rem.done ? 'checked' : ''}`}>
                    {rem.done ? '✓' : ''}
                  </span>
                  <span className="rem-title">{rem.title}</span>
                </button>
                <div className="rem-actions">
                  <button
                    className="rem-icon-btn"
                    aria-label="עריכת תזכורת"
                    onClick={() => openEdit(rem)}
                  >
                    ✏️
                  </button>
                  <button
                    className="rem-icon-btn"
                    aria-label="מחיקת תזכורת"
                    onClick={() => deleteReminder(rem.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {!formOpen ? (
        <button className="btn btn-primary rem-add-btn" onClick={openAdd}>
          + הוסיפו תזכורת
        </button>
      ) : (
        <div className="card rem-add-form">
          <h2 className="rem-form-title">
            {isEditing ? '✏️ עריכת תזכורת' : '+ תזכורת חדשה'}
          </h2>
          <input
            className="input-field"
            placeholder="מה חשוב לזכור?"
            value={draft}
            autoFocus
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') saveDraft() }}
          />
          <div className="rem-add-actions">
            <button className="btn btn-primary" onClick={saveDraft}>
              {isEditing ? 'שמירה' : 'הוסף'}
            </button>
            <button className="btn btn-secondary" onClick={closeForm}>
              {isEditing ? 'ביטול' : 'סיום'}
            </button>
          </div>
          {!isEditing && (
            <p className="rem-add-hint">אפשר להוסיף עוד תזכורות בזו אחר זו — לחצו "סיום" כשתסיימו.</p>
          )}
        </div>
      )}
    </div>
  )
}
