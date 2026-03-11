import { useState, useEffect, useRef, useCallback } from 'react'
import './Toolbox.css'

function Hourglass() {
  const [running, setRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [duration, setDuration] = useState(60)
  const [finished, setFinished] = useState(false)
  const intervalRef = useRef(null)

  const start = useCallback(() => {
    setSeconds(0)
    setFinished(false)
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
            setFinished(true)
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
    <div className="fullscreen-tool">
      <div className="hourglass-container">
        <div className={`hourglass-shape ${running ? 'running' : ''} ${finished ? 'finished' : ''}`}>
          {/* Top bulb */}
          <div className="hg-top">
            <div className="hg-sand-top" style={{ height: `${100 - progress}%` }} />
          </div>
          {/* Neck */}
          <div className="hg-neck">
            {running && <div className="hg-stream" />}
          </div>
          {/* Bottom bulb */}
          <div className="hg-bottom">
            <div className="hg-sand-bottom" style={{ height: `${progress}%` }} />
          </div>
          {/* Frame */}
          <div className="hg-frame-top" />
          <div className="hg-frame-bottom" />
        </div>

        <div className="hourglass-time">
          {mins}:{secs.toString().padStart(2, '0')}
        </div>

        {!running && seconds === 0 && (
          <div className="hourglass-presets">
            {[30, 60, 120, 180, 300].map(d => (
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

        {finished && <div className="hourglass-done">הזמן נגמר!</div>}

        <button className="tool-btn" onClick={running ? stop : start}>
          {running ? 'עצור' : finished ? 'התחל מחדש' : 'התחל'}
        </button>
      </div>
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
    <div className="fullscreen-tool">
      <div className="timer-container">
        <div className="timer-circle">
          <div className="timer-display">
            {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
          </div>
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
      if (count > 10) {
        clearInterval(interval)
        setRolling(false)
      }
    }, 80)
  }, [])

  const faces = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅']

  return (
    <div className="fullscreen-tool">
      <div className="dice-container">
        <div className={`dice-display ${rolling ? 'rolling' : ''}`}>
          {value ? faces[value] : '🎲'}
        </div>
        {value && !rolling && (
          <div className="dice-result">{value}</div>
        )}
        <button className="tool-btn" onClick={roll} disabled={rolling}>
          {rolling ? 'מגלגל...' : 'הטל קובייה'}
        </button>
      </div>
    </div>
  )
}

const tools = [
  { id: 'hourglass', title: 'שעון חול', icon: '⏳', component: Hourglass },
  { id: 'timer', title: 'טיימר', icon: '⏱️', component: Timer },
  { id: 'dice', title: 'קובייה', icon: '🎲', component: Dice },
]

export default function Toolbox() {
  const [visible, setVisible] = useState(false)
  const [activeTool, setActiveTool] = useState(null)

  useEffect(() => {
    setVisible(true)
  }, [])

  const ActiveComponent = activeTool ? tools.find(t => t.id === activeTool)?.component : null

  if (ActiveComponent) {
    return (
      <div className="toolbox-fullscreen">
        <button className="toolbox-back" onClick={() => setActiveTool(null)}>
          ← חזרה לארגז כלים
        </button>
        <ActiveComponent />
      </div>
    )
  }

  return (
    <div className="page toolbox-page">
      <div className={`toolbox-header ${visible ? 'visible' : ''}`}>
        <h1 className="toolbox-title">🧰 ארגז כלים</h1>
      </div>
      <div className={`toolbox-grid ${visible ? 'visible' : ''}`}>
        {tools.map(tool => (
          <button
            key={tool.id}
            className="toolbox-item"
            onClick={() => setActiveTool(tool.id)}
          >
            <span className="toolbox-item-icon">{tool.icon}</span>
            <span className="toolbox-item-title">{tool.title}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
