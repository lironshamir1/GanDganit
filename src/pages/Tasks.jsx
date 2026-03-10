import { useState } from 'react'
import './Tasks.css'

const defaultTasks = [
  { text: 'לצחצח שיניים', icon: '🪥' },
  { text: 'לסדר את החדר', icon: '🧹' },
  { text: 'לאכול ארוחה', icon: '🍽️' },
  { text: 'להכין תיק', icon: '🎒' },
  { text: 'לקרוא סיפור', icon: '📖' },
]

export default function Tasks() {
  const [tasks, setTasks] = useState(defaultTasks.map(t => ({ ...t, done: false })))
  const [newTask, setNewTask] = useState('')
  const [stars, setStars] = useState(0)
  const [reward, setReward] = useState('הפתעה!')
  const [showReward, setShowReward] = useState(false)

  const toggleTask = (idx) => {
    setTasks(prev => {
      const updated = [...prev]
      updated[idx] = { ...updated[idx], done: !updated[idx].done }
      const newStars = updated.filter(t => t.done).length
      setStars(newStars)
      if (newStars >= 5 && !showReward) setShowReward(true)
      return updated
    })
  }

  const addTask = () => {
    if (!newTask.trim()) return
    setTasks(prev => [...prev, { text: newTask.trim(), icon: '⭐', done: false }])
    setNewTask('')
  }

  const resetTasks = () => {
    setTasks(prev => prev.map(t => ({ ...t, done: false })))
    setStars(0)
    setShowReward(false)
  }

  return (
    <div className="page">
      <h1 className="page-title">🏆 לוח משימות</h1>

      <div className="tasks-stars card">
        <div className="stars-display">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`star ${i < stars ? 'earned' : ''}`}>⭐</span>
          ))}
        </div>
        <p className="stars-text">{stars}/5 כוכבים</p>
        {showReward && (
          <div className="reward-banner">
            🎉 כל הכבוד! הילד הגיע ל-5 כוכבים!
            <br />
            התגמול: <strong>{reward}</strong>
          </div>
        )}
      </div>

      <div className="tasks-list">
        {tasks.map((task, idx) => (
          <div
            key={idx}
            className={`task-item card ${task.done ? 'task-done' : ''}`}
            onClick={() => toggleTask(idx)}
          >
            <span className="task-icon">{task.icon}</span>
            <span className={`task-text ${task.done ? 'done' : ''}`}>{task.text}</span>
            {task.done && <span className="task-check">⭐</span>}
          </div>
        ))}
      </div>

      <div className="tasks-add card">
        <input
          className="input-field"
          placeholder="הוסיפו משימה חדשה..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
        />
        <button className="btn btn-primary" onClick={addTask}>הוסף</button>
      </div>

      <div className="tasks-reward card">
        <label className="reward-label">🎁 הגדירו תגמול לילד אחרי 5 כוכבים:</label>
        <input
          className="input-field"
          value={reward}
          onChange={(e) => setReward(e.target.value)}
          placeholder="מה התגמול?"
        />
      </div>

      <button className="btn btn-secondary tasks-reset" onClick={resetTasks}>
        🔄 איפוס יומי
      </button>
    </div>
  )
}
