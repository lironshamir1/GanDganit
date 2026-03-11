import { useState, useEffect, useRef, useCallback } from 'react'
import './Toolbox.css'

function HourglassSVG({ progress, running }) {
  // progress: 0 (full top) to 100 (full bottom)
  const topSandHeight = 70 * (1 - progress / 100)
  const bottomSandHeight = 70 * (progress / 100)
  const topSandY = 25 + (70 - topSandHeight)
  const bottomSandY = 175 - bottomSandHeight

  return (
    <svg viewBox="0 0 160 200" width="180" height="225">
      <defs>
        <linearGradient id="sandGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0c65a" />
          <stop offset="100%" stopColor="#d4952b" />
        </linearGradient>
        <linearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
          <stop offset="100%" stopColor="rgba(200,220,240,0.3)" />
        </linearGradient>
        <clipPath id="topBulb">
          <path d="M 25,25 Q 25,5 80,5 Q 135,5 135,25 L 135,80 Q 135,95 80,100 Q 25,95 25,80 Z" />
        </clipPath>
        <clipPath id="bottomBulb">
          <path d="M 25,120 Q 25,105 80,100 Q 135,105 135,120 L 135,175 Q 135,195 80,195 Q 25,195 25,175 Z" />
        </clipPath>
      </defs>

      {/* Glass body - top */}
      <path d="M 25,25 Q 25,5 80,5 Q 135,5 135,25 L 135,80 Q 135,95 80,100 Q 25,95 25,80 Z"
        fill="url(#glassGrad)" stroke="#b8960b" strokeWidth="2.5" />

      {/* Glass body - bottom */}
      <path d="M 25,120 Q 25,105 80,100 Q 135,105 135,120 L 135,175 Q 135,195 80,195 Q 25,195 25,175 Z"
        fill="url(#glassGrad)" stroke="#b8960b" strokeWidth="2.5" />

      {/* Sand in top bulb */}
      {topSandHeight > 0 && (
        <rect x="20" y={topSandY} width="120" height={topSandHeight + 5}
          fill="url(#sandGrad)" clipPath="url(#topBulb)" />
      )}

      {/* Sand in bottom bulb */}
      {bottomSandHeight > 0 && (
        <rect x="20" y={bottomSandY} width="120" height={bottomSandHeight + 5}
          fill="url(#sandGrad)" clipPath="url(#bottomBulb)" />
      )}

      {/* Falling sand stream */}
      {running && progress < 100 && (
        <line x1="80" y1="95" x2="80" y2={bottomSandY}
          stroke="#d4952b" strokeWidth="2.5" strokeLinecap="round"
          opacity="0.8">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="0.8s" repeatCount="indefinite" />
        </line>
      )}

      {/* Top frame bar */}
      <rect x="15" y="0" width="130" height="7" rx="3.5"
        fill="url(#sandGrad)" stroke="#96700a" strokeWidth="1" />

      {/* Bottom frame bar */}
      <rect x="15" y="193" width="130" height="7" rx="3.5"
        fill="url(#sandGrad)" stroke="#96700a" strokeWidth="1" />

      {/* Frame side supports */}
      <line x1="22" y1="7" x2="22" y2="14" stroke="#b8960b" strokeWidth="3" strokeLinecap="round" />
      <line x1="138" y1="7" x2="138" y2="14" stroke="#b8960b" strokeWidth="3" strokeLinecap="round" />
      <line x1="22" y1="186" x2="22" y2="193" stroke="#b8960b" strokeWidth="3" strokeLinecap="round" />
      <line x1="138" y1="186" x2="138" y2="193" stroke="#b8960b" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

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
        <div className={`hourglass-svg-wrap ${finished ? 'finished' : ''}`}>
          <HourglassSVG progress={progress} running={running} />
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
