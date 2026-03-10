import { useState, useEffect } from 'react'
import { speechCategories } from '../data/speechData'
import './SpeechTraining.css'

const STORAGE_KEY = 'gandganit-speech-progress'

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return {}
}

export default function SpeechTraining() {
  const [progress, setProgress] = useState(loadProgress)
  const [expandedCat, setExpandedCat] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  const toggleExercise = (catId, exIdx) => {
    setProgress(prev => {
      const key = `${catId}-${exIdx}`
      return { ...prev, [key]: !prev[key] }
    })
  }

  const totalExercises = speechCategories.reduce((sum, cat) => sum + cat.exercises.length, 0)
  const doneCount = Object.values(progress).filter(Boolean).length

  return (
    <div className="page">
      <h1 className="page-title">🗣️ אימוני שפה</h1>

      <div className="speech-intro card">
        <p className="speech-intro-text">
          תרגילים כיפיים לגיל 3 שמחזקים את שרירי הפה ומעודדים דיבור.
          בחרו 2-3 פעילויות ביום והחליפו!
        </p>
        <div className="speech-progress-bar">
          <div className="speech-progress-fill" style={{ width: `${totalExercises ? (doneCount / totalExercises) * 100 : 0}%` }} />
        </div>
        <p className="speech-progress-text">{doneCount}/{totalExercises} תרגילים בוצעו</p>
      </div>

      <div className="speech-categories">
        {speechCategories.map((cat) => {
          const catDone = cat.exercises.filter((_, i) => progress[`${cat.id}-${i}`]).length
          const isExpanded = expandedCat === cat.id

          return (
            <div key={cat.id} className="speech-cat">
              <button
                className="speech-cat-header card"
                style={{ borderRight: `4px solid ${cat.color}` }}
                onClick={() => setExpandedCat(isExpanded ? null : cat.id)}
              >
                <div className="speech-cat-icon" style={{ background: cat.color + '22' }}>
                  <span>{cat.icon}</span>
                </div>
                <div className="speech-cat-info">
                  <h3 className="speech-cat-title">{cat.title}</h3>
                  <p className="speech-cat-desc">{cat.description}</p>
                  <span className="speech-cat-count">{catDone}/{cat.exercises.length}</span>
                </div>
                <span className="speech-cat-toggle">{isExpanded ? '▲' : '▼'}</span>
              </button>

              {isExpanded && (
                <div className="speech-exercises">
                  {cat.exercises.map((ex, idx) => {
                    const isDone = progress[`${cat.id}-${idx}`]
                    return (
                      <div
                        key={idx}
                        className={`speech-exercise card ${isDone ? 'speech-exercise-done' : ''}`}
                        onClick={() => toggleExercise(cat.id, idx)}
                      >
                        <span className="speech-ex-emoji">{isDone ? '✅' : ex.emoji}</span>
                        <div className="speech-ex-content">
                          <p className={`speech-ex-text ${isDone ? 'done' : ''}`}>{ex.text}</p>
                          <p className="speech-ex-tip">💡 {ex.tip}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <button
        className="btn btn-secondary speech-reset-btn"
        onClick={() => setProgress({})}
      >
        איפוס התקדמות
      </button>
    </div>
  )
}
