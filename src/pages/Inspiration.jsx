import { useState, useEffect, useRef } from 'react'
import { dailyQuotes, breathingExercise, successStories } from '../data/inspirationData'
import './Inspiration.css'

export default function Inspiration() {
  // נכנסים לכאן מ"רגע לעצמי" במסך הבית, ולכן נפתח ישר בתרגיל הנשימות
  const [activeTab, setActiveTab] = useState('breathe')
  const [breathingStep, setBreathingStep] = useState(-1)
  const [timer, setTimer] = useState(0)
  const intervalRef = useRef(null)

  const quote = dailyQuotes[Math.floor((Date.now() / 86400000)) % dailyQuotes.length]

  const startBreathing = () => {
    setBreathingStep(0)
    setTimer(breathingExercise.steps[0].duration)
  }

  useEffect(() => {
    if (breathingStep < 0) return
    if (timer > 0) {
      intervalRef.current = setTimeout(() => setTimer(t => t - 1), 1000)
    } else {
      const nextStep = breathingStep + 1
      if (nextStep < breathingExercise.steps.length) {
        setBreathingStep(nextStep)
        setTimer(breathingExercise.steps[nextStep].duration)
      } else {
        setBreathingStep(-1)
      }
    }
    return () => clearTimeout(intervalRef.current)
  }, [breathingStep, timer])

  const stopBreathing = () => {
    setBreathingStep(-1)
    setTimer(0)
    clearTimeout(intervalRef.current)
  }

  return (
    <div className="page">
      <h1 className="page-title">🌬️ רגע לעצמי</h1>

      <div className="bnd-tabs">
        <button className={`bnd-tab ${activeTab === 'quote' ? 'active' : ''}`} onClick={() => setActiveTab('quote')}>
          השראה
        </button>
        <button className={`bnd-tab ${activeTab === 'breathe' ? 'active' : ''}`} onClick={() => setActiveTab('breathe')}>
          נשימה
        </button>
        <button className={`bnd-tab ${activeTab === 'stories' ? 'active' : ''}`} onClick={() => setActiveTab('stories')}>
          סיפורים
        </button>
      </div>

      {activeTab === 'quote' && (
        <div className="insp-quote-section">
          <div className="insp-quote-card">
            <p className="insp-quote-text">"{quote}"</p>
          </div>
          <div className="card insp-selfcare">
            <h3>🫶 תזכורת חשובה</h3>
            <p>גם את/ה צריך/ה לדאוג לעצמך. לקחת הפסקה, לנשום, לעשות משהו שאת/ה אוהב/ת — זה לא מותרות, זה הכרח.</p>
          </div>
        </div>
      )}

      {activeTab === 'breathe' && (
        <div className="insp-breathe-section">
          {breathingStep < 0 ? (
            <div className="insp-breathe-start card">
              <h2>🌬️ {breathingExercise.title}</h2>
              <p>{breathingExercise.description}</p>
              <button className="btn btn-primary" onClick={startBreathing}>
                התחילו לנשום
              </button>
            </div>
          ) : (
            <div className="insp-breathe-active">
              <div className="breathe-circle" style={{ transform: breathingExercise.steps[breathingStep].action === 'שאפו' ? 'scale(1.3)' : breathingExercise.steps[breathingStep].action === 'נשפו' ? 'scale(0.8)' : 'scale(1)' }}>
                <span className="breathe-action">{breathingExercise.steps[breathingStep].action}</span>
                <span className="breathe-timer">{timer}</span>
              </div>
              <p className="breathe-instruction">{breathingExercise.steps[breathingStep].instruction}</p>
              <button className="btn btn-secondary" onClick={stopBreathing}>עצירה</button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'stories' && (
        <div className="insp-stories">
          <h2 className="insp-stories-title">סיפורי הצלחה מהורים כמוך</h2>
          {successStories.map((story, idx) => (
            <div key={idx} className="card insp-story">
              <p className="insp-story-text">"{story.text}"</p>
              <p className="insp-story-sig">— {story.signature}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
