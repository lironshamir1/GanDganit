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

const templateSchedules = {
  weekday: {
    name: 'יום רגיל בגן',
    events: [
      { time: '07:00', title: 'קימה והתלבשות', type: 'routine', emoji: '👕' },
      { time: '07:30', title: 'ארוחת בוקר', type: 'food', emoji: '🥣' },
      { time: '08:00', title: 'צחצוח שיניים', type: 'hygiene', emoji: '🪥' },
      { time: '08:30', title: 'יציאה לגן', type: 'routine', emoji: '🎒' },
      { time: '12:30', title: 'ארוחת צהריים', type: 'food', emoji: '🍝' },
      { time: '13:00', title: 'מנוחה', type: 'sleep', emoji: '😴' },
      { time: '15:00', title: 'חזרה מהגן', type: 'routine', emoji: '🏠' },
      { time: '16:00', title: 'משחק חופשי', type: 'play', emoji: '🎨' },
      { time: '17:30', title: 'אמבטיה', type: 'hygiene', emoji: '🛁' },
      { time: '18:00', title: 'ארוחת ערב', type: 'food', emoji: '🍲' },
      { time: '19:00', title: 'סיפור לפני השינה', type: 'sleep', emoji: '📖' },
      { time: '19:30', title: 'שינה', type: 'sleep', emoji: '🌙' },
    ]
  },
  therapy: {
    name: 'יום עם טיפולים',
    events: [
      { time: '07:00', title: 'קימה והתלבשות', type: 'routine', emoji: '👕' },
      { time: '07:30', title: 'ארוחת בוקר', type: 'food', emoji: '🥣' },
      { time: '09:00', title: 'קלינאית תקשורת', type: 'therapy', emoji: '🗣️' },
      { time: '10:00', title: 'הפסקה ומשחק', type: 'play', emoji: '🧩' },
      { time: '11:00', title: 'ריפוי בעיסוק', type: 'therapy', emoji: '✋' },
      { time: '12:00', title: 'ארוחת צהריים', type: 'food', emoji: '🍝' },
      { time: '13:00', title: 'מנוחה', type: 'sleep', emoji: '😴' },
      { time: '15:00', title: 'פיזיותרפיה', type: 'therapy', emoji: '🤸' },
      { time: '16:00', title: 'משחק בחוץ', type: 'outside', emoji: '🌞' },
      { time: '18:00', title: 'ארוחת ערב', type: 'food', emoji: '🍲' },
      { time: '19:30', title: 'שינה', type: 'sleep', emoji: '🌙' },
    ]
  },
  friday: {
    name: 'יום שישי',
    events: [
      { time: '07:30', title: 'קימה והתלבשות', type: 'routine', emoji: '👕' },
      { time: '08:00', title: 'ארוחת בוקר', type: 'food', emoji: '🥣' },
      { time: '09:00', title: 'גן (יום קצר)', type: 'routine', emoji: '🎒' },
      { time: '12:00', title: 'חזרה מהגן', type: 'routine', emoji: '🏠' },
      { time: '12:30', title: 'ארוחת צהריים', type: 'food', emoji: '🍝' },
      { time: '13:30', title: 'משחק חופשי', type: 'play', emoji: '🎨' },
      { time: '15:00', title: 'יציאה לפארק', type: 'outside', emoji: '🌳' },
      { time: '17:00', title: 'אמבטיה', type: 'hygiene', emoji: '🛁' },
      { time: '18:00', title: 'ארוחת שבת', type: 'food', emoji: '🕯️' },
      { time: '19:30', title: 'שינה', type: 'sleep', emoji: '🌙' },
    ]
  },
}

const emojiOptions = [
  '👕', '🥣', '🪥', '🗣️', '🖍️', '🌞', '🍝', '😴', '🤸', '🎵',
  '🛁', '🍲', '📖', '🌙', '🎨', '⚽', '🧩', '🎶', '🚗', '🐕',
  '🍎', '🥤', '💊', '🏊', '📚', '🎭', '🧸', '👨‍👩‍👧', '🏡', '✨',
  '🎒', '🕯️', '✋', '🧹', '🎪', '🛝'
]

const SCHEDULES_KEY = 'gandganit-schedules'
const ACTIVE_KEY = 'gandganit-active-schedule'

function loadSchedules() {
  try {
    const saved = localStorage.getItem(SCHEDULES_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return null
}

function loadActiveId() {
  try {
    return localStorage.getItem(ACTIVE_KEY) || null
  } catch {}
  return null
}

export default function Schedule() {
  const [schedules, setSchedules] = useState(loadSchedules)
  const [activeId, setActiveId] = useState(loadActiveId)
  const [showAdd, setShowAdd] = useState(false)
  const [editIdx, setEditIdx] = useState(null)
  const [showNewSchedule, setShowNewSchedule] = useState(false)
  const [newScheduleName, setNewScheduleName] = useState('')
  const [newEvent, setNewEvent] = useState({ time: '', title: '', type: 'routine', emoji: '🏠' })

  const activeSchedule = schedules && activeId ? schedules[activeId] : null
  const events = activeSchedule?.events || []

  useEffect(() => {
    if (schedules) localStorage.setItem(SCHEDULES_KEY, JSON.stringify(schedules))
  }, [schedules])

  useEffect(() => {
    if (activeId) localStorage.setItem(ACTIVE_KEY, activeId)
  }, [activeId])

  const setEvents = (updater) => {
    setSchedules(prev => {
      const updated = { ...prev }
      updated[activeId] = {
        ...updated[activeId],
        events: typeof updater === 'function' ? updater(updated[activeId].events) : updater,
      }
      return updated
    })
  }

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
    setEvents(prev => {
      let updated
      if (editIdx !== null) {
        updated = [...prev]
        updated[editIdx] = { ...updated[editIdx], ...event }
      } else {
        updated = [...prev, event]
      }
      return updated.sort((a, b) => a.time.localeCompare(b.time))
    })
    setEditIdx(null)
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

  const createFromTemplate = (templateKey) => {
    const template = templateSchedules[templateKey]
    const id = Date.now().toString()
    const newSchedules = { ...(schedules || {}), [id]: { name: template.name, events: template.events.map(e => ({ ...e, done: false })) } }
    setSchedules(newSchedules)
    setActiveId(id)
  }

  const createEmpty = (name) => {
    if (!name.trim()) return
    const id = Date.now().toString()
    const newSchedules = { ...(schedules || {}), [id]: { name: name.trim(), events: [] } }
    setSchedules(newSchedules)
    setActiveId(id)
    setShowNewSchedule(false)
    setNewScheduleName('')
  }

  const deleteSchedule = (id) => {
    const updated = { ...schedules }
    delete updated[id]
    setSchedules(Object.keys(updated).length > 0 ? updated : null)
    if (activeId === id) {
      const remaining = Object.keys(updated)
      setActiveId(remaining.length > 0 ? remaining[0] : null)
    }
  }

  const doneCount = events.filter(e => e.done).length

  // Welcome screen - no schedules yet
  if (!schedules || Object.keys(schedules).length === 0) {
    return (
      <div className="page">
        <h1 className="page-title">📅 סדר יום</h1>
        <div className="sched-welcome card">
          <span className="sched-welcome-emoji">📅</span>
          <h2 className="sched-welcome-title">צרו את סדר היום שלכם</h2>
          <p className="sched-welcome-desc">בחרו תבנית מוכנה או צרו סדר יום מאפס</p>
        </div>

        <h3 className="sched-templates-title">תבניות מוכנות</h3>
        <div className="sched-templates">
          {Object.entries(templateSchedules).map(([key, template]) => (
            <button
              key={key}
              className="card sched-template-card"
              onClick={() => createFromTemplate(key)}
            >
              <span className="sched-template-icon">
                {key === 'weekday' ? '🏫' : key === 'therapy' ? '💆' : '🕯️'}
              </span>
              <h4 className="sched-template-name">{template.name}</h4>
              <p className="sched-template-count">{template.events.length} פעילויות</p>
            </button>
          ))}
        </div>

        <div className="sched-or">או</div>

        {!showNewSchedule ? (
          <button className="btn btn-primary sched-create-btn" onClick={() => setShowNewSchedule(true)}>
            + צרו סדר יום חדש מאפס
          </button>
        ) : (
          <div className="card sched-new-form">
            <input
              className="input-field"
              placeholder="שם סדר היום (למשל: יום רגיל)"
              value={newScheduleName}
              onChange={(e) => setNewScheduleName(e.target.value)}
              autoFocus
            />
            <div className="sched-new-actions">
              <button className="btn btn-primary" onClick={() => createEmpty(newScheduleName)}>צור</button>
              <button className="btn btn-secondary" onClick={() => setShowNewSchedule(false)}>ביטול</button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Main parent view
  const scheduleIds = Object.keys(schedules)

  return (
    <div className="page">
      <h1 className="page-title">📅 היום שלנו</h1>

      {/* Schedule tabs */}
      {scheduleIds.length > 1 && (
        <div className="sched-tabs">
          {scheduleIds.map(id => (
            <button
              key={id}
              className={`sched-tab ${id === activeId ? 'active' : ''}`}
              onClick={() => setActiveId(id)}
            >
              {schedules[id].name}
            </button>
          ))}
        </div>
      )}

      <div className="sched-header-row">
        <h2 className="sched-name">{activeSchedule?.name}</h2>
        <div className="sched-header-actions">
          <button className="sched-action-btn" onClick={() => {
            const name = activeSchedule?.name
            if (name) deleteSchedule(activeId)
          }}>🗑️</button>
        </div>
      </div>

      {events.length > 0 && (
        <div className="sched-progress card">
          <div className="sched-progress-bar">
            <div className="sched-progress-fill" style={{ width: `${(doneCount / events.length) * 100}%` }} />
          </div>
          <p className="sched-progress-text">{doneCount}/{events.length} פעילויות הושלמו</p>
        </div>
      )}

      {events.length === 0 && (
        <div className="sched-empty card">
          <p className="sched-empty-text">סדר היום ריק</p>
          <p className="sched-empty-desc">הוסיפו פעילויות כדי לבנות את היום</p>
        </div>
      )}

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
            <button className="btn btn-secondary sched-reset-btn" onClick={() => setShowNewSchedule(true)}>
              + סדר יום נוסף
            </button>
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

      {showNewSchedule && (
        <div className="card sched-new-form sched-new-overlay">
          <h3 className="sched-form-title">📅 סדר יום חדש</h3>
          <input
            className="input-field"
            placeholder="שם סדר היום (למשל: יום שישי)"
            value={newScheduleName}
            onChange={(e) => setNewScheduleName(e.target.value)}
            autoFocus
          />
          <div className="sched-templates-mini">
            {Object.entries(templateSchedules).map(([key, template]) => (
              <button
                key={key}
                className="sched-template-mini-btn"
                onClick={() => { createFromTemplate(key); setShowNewSchedule(false) }}
              >
                {key === 'weekday' ? '🏫' : key === 'therapy' ? '💆' : '🕯️'} {template.name}
              </button>
            ))}
          </div>
          <div className="sched-new-actions">
            <button className="btn btn-primary" onClick={() => { createEmpty(newScheduleName); }}>צור ריק</button>
            <button className="btn btn-secondary" onClick={() => { setShowNewSchedule(false); setNewScheduleName('') }}>ביטול</button>
          </div>
        </div>
      )}
    </div>
  )
}
