import { useState } from 'react'
import './Schedule.css'

const defaultEvents = [
  { time: '08:00', title: 'ארוחת בוקר', type: 'routine', done: false },
  { time: '09:00', title: 'קלינאית תקשורת', type: 'therapy', done: false },
  { time: '11:00', title: 'פעילות חופשית', type: 'play', done: false },
  { time: '12:30', title: 'ארוחת צהריים', type: 'routine', done: false },
  { time: '13:00', title: 'מנוחה', type: 'routine', done: false },
  { time: '15:00', title: 'פיזיותרפיה', type: 'therapy', done: false },
  { time: '17:00', title: 'משחק בחוץ', type: 'play', done: false },
]

const typeLabels = { routine: 'שגרה', therapy: 'טיפול', play: 'משחק' }
const typeColors = { routine: '#A8D5BA', therapy: '#6C9BCF', play: '#F4B942' }

export default function Schedule() {
  const [events, setEvents] = useState(defaultEvents)
  const [showAdd, setShowAdd] = useState(false)
  const [newEvent, setNewEvent] = useState({ time: '', title: '', type: 'routine' })

  const toggleDone = (idx) => {
    setEvents(prev => {
      const updated = [...prev]
      updated[idx] = { ...updated[idx], done: !updated[idx].done }
      return updated
    })
  }

  const addEvent = () => {
    if (!newEvent.time || !newEvent.title.trim()) return
    const updated = [...events, { ...newEvent, done: false }].sort((a, b) => a.time.localeCompare(b.time))
    setEvents(updated)
    setNewEvent({ time: '', title: '', type: 'routine' })
    setShowAdd(false)
  }

  const doneCount = events.filter(e => e.done).length

  return (
    <div className="page">
      <h1 className="page-title">📅 היום שלנו</h1>

      <div className="sched-progress card">
        <div className="sched-progress-bar">
          <div className="sched-progress-fill" style={{ width: `${(doneCount / events.length) * 100}%` }} />
        </div>
        <p className="sched-progress-text">{doneCount}/{events.length} פעילויות הושלמו</p>
      </div>

      <div className="sched-timeline">
        {events.map((event, idx) => (
          <div
            key={idx}
            className={`sched-event card ${event.done ? 'sched-done' : ''}`}
            onClick={() => toggleDone(idx)}
          >
            <div className="sched-time">{event.time}</div>
            <div className="sched-line" style={{ borderColor: typeColors[event.type] }} />
            <div className="sched-content">
              <h3 className={`sched-title ${event.done ? 'done' : ''}`}>{event.title}</h3>
              <span className="tag" style={{ background: typeColors[event.type] + '33', color: typeColors[event.type] }}>
                {typeLabels[event.type]}
              </span>
            </div>
            {event.done && <span className="sched-check">✓</span>}
          </div>
        ))}
      </div>

      {!showAdd ? (
        <button className="btn btn-primary sched-add-btn" onClick={() => setShowAdd(true)}>
          + הוסיפו פעילות
        </button>
      ) : (
        <div className="card sched-add-form">
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
            onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value }))}
          >
            <option value="routine">שגרה</option>
            <option value="therapy">טיפול</option>
            <option value="play">משחק</option>
          </select>
          <div className="sched-add-actions">
            <button className="btn btn-primary" onClick={addEvent}>הוסף</button>
            <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>ביטול</button>
          </div>
        </div>
      )}
    </div>
  )
}
