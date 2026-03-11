import { useState, useEffect, useRef, useCallback } from 'react'
import './Toolbox.css'

function Hourglass() {
  const [running, setRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [duration, setDuration] = useState(60)
  const intervalRef = useRef(null)

  const start = useCallback(() => {
    setSeconds(0)
    setRunning(true)
  }, [])

  const stop = useCallback(() => {
    setRunning(false)
    clearInterval(intervalRef.current)
  }, [])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev + 1 >= duration) {
            clearInterval(intervalRef.current)
            setRunning(false)
            return duration
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, duration])

  const progress = duration > 0 ? (seconds / duration) * 100 : 0
  const remaining = duration - seconds
  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60

  return (
    <div className="tool-card hourglass-card">
      <div className="tool-header">
        <span className="tool-emoji">⏳</span>
        <h3>שעון חול</h3>
      </div>
      <div className="hourglass-display">
        <div className="hourglass-visual">
          <div className="hourglass-sand-top" style={{ height: `${100 - progress}%` }} />
          <div className="hourglass-sand-bottom" style={{ height: `${progress}%` }} />
        </div>
        <div className="hourglass-time">
          {mins}:{secs.toString().padStart(2, '0')}
        </div>
      </div>
      {!running && seconds === 0 && (
        <div className="hourglass-presets">
          {[30, 60, 120, 180].map(d => (
            <button
              key={d}
              className={`preset-btn ${duration === d ? 'active' : ''}`}
              onClick={() => setDuration(d)}
            >
              {d < 60 ? `${d} שנ` : `${d / 60} דק`}
            </button>
          ))}
        </div>
      )}
      <button className="tool-btn" onClick={running ? stop : start}>
        {running ? 'עצור' : seconds >= duration && seconds > 0 ? 'התחל מחדש' : 'התחל'}
      </button>
    </div>
  )
}

function Timer() {
  const [running, setRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const intervalRef = useRef(null)

  const toggle = useCallback(() => {
    setRunning(prev => !prev)
  }, [])

  const reset = useCallback(() => {
    setRunning(false)
    setSeconds(0)
    clearInterval(intervalRef.current)
  }, [])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => prev + 1)
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60

  return (
    <div className="tool-card timer-card">
      <div className="tool-header">
        <span className="tool-emoji">⏱️</span>
        <h3>טיימר</h3>
      </div>
      <div className="timer-display">
        {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
      </div>
      <div className="timer-buttons">
        <button className="tool-btn" onClick={toggle}>
          {running ? 'עצור' : 'התחל'}
        </button>
        <button className="tool-btn tool-btn-secondary" onClick={reset}>
          איפוס
        </button>
      </div>
    </div>
  )
}

function Dice() {
  const [value, setValue] = useState(null)
  const [rolling, setRolling] = useState(false)

  const roll = useCallback(() => {
    setRolling(true)
    let count = 0
    const interval = setInterval(() => {
      setValue(Math.floor(Math.random() * 6) + 1)
      count++
      if (count > 8) {
        clearInterval(interval)
        setRolling(false)
      }
    }, 100)
  }, [])

  const faces = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅']

  return (
    <div className="tool-card dice-card">
      <div className="tool-header">
        <span className="tool-emoji">🎲</span>
        <h3>קובייה</h3>
      </div>
      <div className={`dice-display ${rolling ? 'rolling' : ''}`}>
        {value ? faces[value] : '🎲'}
      </div>
      <button className="tool-btn" onClick={roll} disabled={rolling}>
        {rolling ? 'מגלגל...' : 'הטל קובייה'}
      </button>
    </div>
  )
}

export default function Toolbox() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <div className="page toolbox-page">
      <div className={`toolbox-header ${visible ? 'visible' : ''}`}>
        <h1 className="toolbox-title">🧰 ארגז כלים</h1>
      </div>
      <div className={`toolbox-grid ${visible ? 'visible' : ''}`}>
        <Hourglass />
        <Timer />
        <Dice />
      </div>
    </div>
  )
}
