import { useEffect, useState } from 'react'
import './Tasks.css'

/* לוח המשימות הוא של ההורה: הוא בוחר אילו משימות רלוונטיות לילד שלו,
   עורך אותן ומוחק. הכול נשמר אצלו במכשיר בלבד ולא מגיע לשום מקום אחר. */
const STORAGE_KEY = 'gandganit-tasks-v1'

const defaultTasks = [
  { id: 't1', text: 'לצחצח שיניים', icon: '🪥' },
  { id: 't2', text: 'להתלבש לבד', icon: '👕' },
  { id: 't3', text: 'לאכול ארוחה', icon: '🍽️' },
  { id: 't4', text: 'להכין תיק', icon: '🎒' },
  { id: 't5', text: 'לקרוא סיפור', icon: '📖' },
]

/* בנק הצעות — ההורה מוסיף בלחיצה אחת רק את מה שמתאים לילד שלו */
const suggestions = [
  { text: 'לצחצח שיניים', icon: '🪥' },
  { text: 'לשטוף ידיים', icon: '🧼' },
  { text: 'להתלבש לבד', icon: '👕' },
  { text: 'לנעול נעליים', icon: '👟' },
  { text: 'לסדר את החדר', icon: '🧹' },
  { text: 'לשים בגדים בסל', icon: '🧺' },
  { text: 'לאכול ארוחה', icon: '🍽️' },
  { text: 'לפנות את הצלחת', icon: '🍴' },
  { text: 'לשתות מים', icon: '💧' },
  { text: 'להכין תיק', icon: '🎒' },
  { text: 'לקרוא סיפור', icon: '📖' },
  { text: 'ללכת לישון בזמן', icon: '🛏️' },
]

const icons = ['⭐', '🪥', '👕', '👟', '🧼', '🧹', '🍽️', '🎒', '📖', '🛏️', '💧', '🎨']

const today = () => new Date().toLocaleDateString('en-CA')

function loadState() {
  const fallback = {
    tasks: defaultTasks.map(t => ({ ...t, done: false })),
    reward: 'הפתעה!',
  }
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (!saved || !Array.isArray(saved.tasks)) return fallback

    /* איפוס יומי אוטומטי: הסימונים של אתמול לא נגררים להיום */
    const stale = saved.date !== today()
    return {
      tasks: saved.tasks
        .filter(t => t && typeof t.text === 'string')
        .map(t => ({
          id: String(t.id ?? t.text),
          text: t.text,
          icon: typeof t.icon === 'string' ? t.icon : '⭐',
          done: stale ? false : Boolean(t.done),
        })),
      reward: typeof saved.reward === 'string' ? saved.reward : fallback.reward,
    }
  } catch {
    /* אם אין גישה ל-localStorage מתחילים מהרשימה המוצעת */
    return fallback
  }
}

export default function Tasks() {
  const [{ tasks, reward }, setState] = useState(loadState)
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [draftText, setDraftText] = useState('')
  const [draftIcon, setDraftIcon] = useState('⭐')

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks, reward, date: today() }))
    } catch {
      /* אם אין גישה ל-localStorage פשוט לא שומרים */
    }
  }, [tasks, reward])

  const setTasks = (fn) => setState(prev => ({ ...prev, tasks: fn(prev.tasks) }))
  const setReward = (value) => setState(prev => ({ ...prev, reward: value }))

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
    if (editingId === id) closeForm()
  }

  const addSuggestion = (sug) => {
    setTasks(prev => (
      prev.some(t => t.text === sug.text)
        ? prev
        : [...prev, { id: `s${Date.now()}`, ...sug, done: false }]
    ))
  }

  const openAdd = () => {
    setEditingId(null)
    setDraftText('')
    setDraftIcon('⭐')
    setFormOpen(true)
  }

  const openEdit = (task) => {
    setEditingId(task.id)
    setDraftText(task.text)
    setDraftIcon(task.icon)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditingId(null)
    setDraftText('')
  }

  const saveDraft = () => {
    const text = draftText.trim()
    if (!text) return

    if (editingId !== null) {
      setTasks(prev => prev.map(t => (
        t.id === editingId ? { ...t, text, icon: draftIcon } : t
      )))
      closeForm()
      return
    }

    setTasks(prev => [...prev, { id: `c${Date.now()}`, text, icon: draftIcon, done: false }])
    setDraftText('')
  }

  const resetTasks = () => setTasks(prev => prev.map(t => ({ ...t, done: false })))

  const doneCount = tasks.filter(t => t.done).length
  const allDone = tasks.length > 0 && doneCount === tasks.length
  const isEditing = editingId !== null
  const available = suggestions.filter(s => !tasks.some(t => t.text === s.text))

  return (
    <div className="page">
      <h1 className="page-title">🏆 לוח משימות</h1>

      <p className="tasks-intro">
        הלוח הוא שלכם — בחרו את המשימות שמתאימות לילד/ה, ערכו את הניסוח
        והוסיפו משלכם. הכול נשמר אצלכם בלבד.
      </p>

      <div className="tasks-stars card">
        {tasks.length === 0 ? (
          <p className="stars-text">בחרו משימות כדי להתחיל</p>
        ) : (
          <>
            <div className="stars-display">
              {tasks.map((task, i) => (
                <span key={task.id} className={`star ${i < doneCount ? 'earned' : ''}`}>⭐</span>
              ))}
            </div>
            <p className="stars-text">{doneCount}/{tasks.length} כוכבים</p>
          </>
        )}
        {allDone && (
          <div className="reward-banner">
            🎉 כל הכבוד! כל המשימות הושלמו!
            {reward.trim() && (
              <>
                <br />
                התגמול: <strong>{reward}</strong>
              </>
            )}
          </div>
        )}
      </div>

      <div className="tasks-list">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`task-item card ${task.done ? 'task-done' : ''} ${editingId === task.id ? 'task-editing' : ''}`}
          >
            <button
              type="button"
              className="task-main"
              aria-pressed={task.done}
              onClick={() => toggleTask(task.id)}
            >
              <span className="task-icon">{task.icon}</span>
              <span className={`task-text ${task.done ? 'done' : ''}`}>{task.text}</span>
              {task.done && <span className="task-check">⭐</span>}
            </button>
            <div className="task-actions">
              <button
                className="task-icon-btn"
                aria-label="עריכת משימה"
                onClick={() => openEdit(task)}
              >
                ✏️
              </button>
              <button
                className="task-icon-btn"
                aria-label="מחיקת משימה"
                onClick={() => deleteTask(task.id)}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {!formOpen ? (
        <button className="btn btn-primary tasks-add-btn" onClick={openAdd}>
          + הוסיפו משימה
        </button>
      ) : (
        <div className="card tasks-add">
          <h2 className="tasks-form-title">
            {isEditing ? '✏️ עריכת משימה' : '+ משימה חדשה'}
          </h2>
          <input
            className="input-field"
            placeholder="מה המשימה?"
            value={draftText}
            autoFocus
            onChange={(e) => setDraftText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') saveDraft() }}
          />
          <div className="tasks-icon-picker">
            {icons.map((icon) => (
              <button
                key={icon}
                type="button"
                className={`tasks-icon-option ${draftIcon === icon ? 'selected' : ''}`}
                aria-label={`בחירת סמל ${icon}`}
                aria-pressed={draftIcon === icon}
                onClick={() => setDraftIcon(icon)}
              >
                {icon}
              </button>
            ))}
          </div>
          <div className="tasks-add-actions">
            <button className="btn btn-primary" onClick={saveDraft}>
              {isEditing ? 'שמירה' : 'הוסף'}
            </button>
            <button className="btn btn-secondary" onClick={closeForm}>
              {isEditing ? 'ביטול' : 'סיום'}
            </button>
          </div>
        </div>
      )}

      {available.length > 0 && (
        <div className="card tasks-suggestions">
          <h2 className="tasks-form-title">💡 משימות מוצעות</h2>
          <p className="tasks-suggestions-hint">לחיצה מוסיפה ללוח</p>
          <div className="tasks-chips">
            {available.map((sug) => (
              <button
                key={sug.text}
                type="button"
                className="tasks-chip"
                onClick={() => addSuggestion(sug)}
              >
                {sug.icon} {sug.text}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="tasks-reward card">
        <label className="reward-label" htmlFor="task-reward">
          🎁 הגדירו תגמול לילד/ה בסיום כל המשימות:
        </label>
        <input
          id="task-reward"
          className="input-field"
          value={reward}
          onChange={(e) => setReward(e.target.value)}
          placeholder="מה התגמול?"
        />
      </div>

      <button className="btn btn-secondary tasks-reset" onClick={resetTasks}>
        🔄 איפוס הסימונים
      </button>
      <p className="tasks-reset-hint">הסימונים מתאפסים גם לבד בכל יום חדש</p>
    </div>
  )
}
