import { useState, useEffect } from 'react'
import './Schedule.css'

const typeConfig = {
  routine: { label: 'שגרה', color: '#7EC8C8', emoji: '🏠' },
  food: { label: 'אוכל', color: '#F8C8A4', emoji: '🍽️' },
  therapy: { label: 'טיפול', color: '#B8A9D4', emoji: '💆' },
  play: { label: 'משחק', color: '#F5C6D0', emoji: '🎨' },
  outside: { label: 'חוץ', color: '#A8D5BA', emoji: '🌳' },
  sleep: { label: 'שינה', color: '#87CEEB', emoji: '😴' },
  hygiene: { label: 'היגיינה', color: '#DDA0DD', emoji: '🛁' },
  learning: { label: 'למידה', color: '#F2A07B', emoji: '📚' },
}

const defaultEvents = [
  { time: '07:00', title: 'קימה והתלבשות', type: 'routine', emoji: '👕', done: false },
  { time: '07:30', title: 'ארוחת בוקר', type: 'food', emoji: '🥣', done: false },
  { time: '08:00', title: 'צחצוח שיניים', type: 'hygiene', emoji: '🪥', done: false },
  { time: '09:00', title: 'קלינאית תקשורת', type: 'therapy', emoji: '🗣️', done: false },
  { time: '10:00', title: 'ציור ויצירה', type: 'play', emoji: '🖍️', done: false },
  { time: '11:00', title: 'משחק בחוץ', type: 'outside', emoji: '🌞', done: false },
  { time: '12:00', title: 'ארוחת צהריים', type: 'food', emoji: '🍝', done: false },
  { time: '13:00', title: 'מנוחה', type: 'sleep', emoji: '😴', done: false },
  { time: '15:00', title: 'פיזיותרפיה', type: 'therapy', emoji: '🤸', done: false },
  { time: '16:00', title: 'חוג / פעילות', type: 'learning', emoji: '🎵', done: false },
  { time: '17:30', title: 'אמבטיה', type: 'hygiene', emoji: '🛁', done: false },
  { time: '18:00', title: 'ארוחת ערב', type: 'food', emoji: '🍲', done: false },
  { time: '19:00', title: 'סיפור לפני השינה', type: 'sleep', emoji: '📖', done: false },
  { time: '19:30', title: 'שינה', type: 'sleep', emoji: '🌙', done: false },
]

const emojiOptions = [
  '👕', '🥣', '🪥', '🗣️', '🖍️', '🌞', '🍝', '😴', '🤸', '🎵',
  '🛁', '🍲', '📖', '🌙', '🎨', '⚽', '🧩', '🎶', '🚗', '🐕',
  '🍎', '🥤', '💊', '🏊', '📚', '🎭', '🧸', '👨‍👩‍👧', '🏡', '✨'
]

const STORAGE_KEY = 'gandganit-schedule'

function loadEvents() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return defaultEvents
}

export default function Schedule() {
  const [events, setEvents] = useState(loadEvents)
  const [showAdd, setShowAdd] = useState(false)
  const [editIdx, setEditIdx] = useState(null)
  const [showKidView, setShowKidView] = useState(false)
  const [newEvent, setNewEvent] = useState({ time: '', title: '', type: 'routine', emoji: '🏠' })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
  }, [events])

  const toggleDone = (idx) => {
    setEvents(prev => {
      const updated = [...prev]
      updated[idx] = { ...updated[idx], done: !updated[idx].done }
      return updated
    })
  }

  const addEvent = () => {
    if (!newEvent.time || !newEvent.title.trim()) return
    const event = { ...newEvent, done: false }
    let updated
    if (editIdx !== null) {
      updated = [...events]
      updated[editIdx] = { ...updated[editIdx], ...event }
      setEditIdx(null)
    } else {
      updated = [...events, event]
    }
    updated.sort((a, b) => a.time.localeCompare(b.time))
    setEvents(updated)
    setNewEvent({ time: '', title: '', type: 'routine', emoji: '🏠' })
    setShowAdd(false)
  }

  const deleteEvent = (idx) => {
    setEvents(prev => prev.filter((_, i) => i !== idx))
  }

  const startEdit = (idx) => {
    const ev = events[idx]
    setNewEvent({ time: ev.time, title: ev.title, type: ev.type, emoji: ev.emoji || typeConfig[ev.type]?.emoji || '🏠' })
    setEditIdx(idx)
    setShowAdd(true)
  }

  const resetDay = () => {
    setEvents(prev => prev.map(e => ({ ...e, done: false })))
  }

  const resetToDefault = () => {
    setEvents(defaultEvents)
  }

  const doneCount = events.filter(e => e.done).length

  if (showKidView) {
    return (
      <div className="page">
        <div className="kid-view-header">
          <button className="btn btn-secondary kid-back-btn" onClick={() => setShowKidView(false)}>
            חזרה לתצוגת הורה
          </button>
          <h1 className="kid-view-title">היום שלי</h1>
        </div>

        <div className="kid-progress">
          <div className="kid-progress-stars">
            {events.map((_, i) => (
              <span key={i} className={`kid-star ${i < doneCount ? 'earned' : ''}`}>⭐</span>
            ))}
          </div>
          {doneCount === events.length && (
            <div className="kid-complete-msg">כל הכבוד! סיימת את כל היום! 🎉</div>
          )}
        </div>

        <div className="kid-timeline">
          {events.map((event, idx) => (
            <div
              key={idx}
              className={`kid-event ${event.done ? 'kid-event-done' : ''}`}
              onClick={() => toggleDone(idx)}
            >
              <div className={`kid-event-emoji ${event.done ? 'done' : ''}`}>
                {event.done ? '✅' : (event.emoji || typeConfig[event.type]?.emoji || '📌')}
              </div>
              <div className="kid-event-title">{event.title}</div>
              <div className="kid-event-time">{event.time}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <h1 className="page-title">📅 היום שלנו</h1>

      <div className="sched-view-toggle">
        <button
          className="btn btn-warm sched-kid-btn"
          onClick={() => setShowKidView(true)}
        >
          🧒 תצוגת ילד
        </button>
      </div>

      <div className="sched-progress card">
        <div className="sched-progress-bar">
          <div className="sched-progress-fill" style={{ width: `${events.length ? (doneCount / events.length) * 100 : 0}%` }} />
        </div>
        <p className="sched-progress-text">{doneCount}/{events.length} פעילויות הושלמו</p>
      </div>

      <div className="sched-timeline">
        {events.map((event, idx) => (
          <div
            key={idx}
            className={`sched-event card ${event.done ? 'sched-done' : ''}`}
          >
            <div className="sched-event-emoji" onClick={() => toggleDone(idx)}>
              {event.emoji || typeConfig[event.type]?.emoji || '📌'}
            </div>
            <div className="sched-time" onClick={() => toggleDone(idx)}>{event.time}</div>
            <div className="sched-line" style={{ borderColor: typeConfig[event.type]?.color || '#ccc' }} />
            <div className="sched-content" onClick={() => toggleDone(idx)}>
              <h3 className={`sched-title ${event.done ? 'done' : ''}`}>{event.title}</h3>
              <span className="tag" style={{ background: (typeConfig[event.type]?.color || '#ccc') + '22', color: typeConfig[event.type]?.color || '#999' }}>
                {typeConfig[event.type]?.label || event.type}
              </span>
            </div>
            {event.done && <span className="sched-check">✓</span>}
            <div className="sched-actions">
              <button className="sched-action-btn" onClick={() => startEdit(idx)}>✏️</button>
              <button className="sched-action-btn" onClick={() => deleteEvent(idx)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {!showAdd ? (
        <div className="sched-bottom-actions">
          <button className="btn btn-primary sched-add-btn" onClick={() => { setEditIdx(null); setNewEvent({ time: '', title: '', type: 'routine', emoji: '🏠' }); setShowAdd(true) }}>
            + הוסיפו פעילות
          </button>
          <div className="sched-reset-row">
            <button className="btn btn-secondary sched-reset-btn" onClick={resetDay}>איפוס סימונים</button>
            <button className="btn btn-secondary sched-reset-btn" onClick={resetToDefault}>איפוס לברירת מחדל</button>
          </div>
        </div>
      ) : (
        <div className="card sched-add-form">
          <h3 className="sched-form-title">{editIdx !== null ? '✏️ עריכת פעילות' : '➕ פעילות חדשה'}</h3>
          <input
            type="time"
            className="input-field"
            value={newEvent.time}
            onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
          />
          <input
            className="input-field"
            placeholder="שם הפעילות"
            value={newEvent.title}
            onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
          />
          <select
            className="input-field"
            value={newEvent.type}
            onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value, emoji: typeConfig[e.target.value]?.emoji || prev.emoji }))}
          >
            {Object.entries(typeConfig).map(([key, val]) => (
              <option key={key} value={key}>{val.emoji} {val.label}</option>
            ))}
          </select>

          <div className="sched-emoji-picker">
            <label className="sched-emoji-label">בחרו סמל:</label>
            <div className="sched-emoji-grid">
              {emojiOptions.map((em) => (
                <button
                  key={em}
                  className={`sched-emoji-btn ${newEvent.emoji === em ? 'selected' : ''}`}
                  onClick={() => setNewEvent(prev => ({ ...prev, emoji: em }))}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          <div className="sched-add-actions">
            <button className="btn btn-primary" onClick={addEvent}>{editIdx !== null ? 'שמירה' : 'הוסף'}</button>
            <button className="btn btn-secondary" onClick={() => { setShowAdd(false); setEditIdx(null) }}>ביטול</button>
          </div>
        </div>
      )}
    </div>
  )
}
