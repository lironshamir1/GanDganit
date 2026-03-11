import { useState, useEffect, useRef, useCallback } from 'react'
import './Toolbox.css'

function HourglassSVG({ progress, running }) {
  // progress: 0 (full top) to 100 (full bottom)
  const p = progress / 100

  // Top sand shrinks from bottom up (sand level drops)
  const topFull = 75 // max sand height in top bulb
  const topH = topFull * (1 - p)
  const topY = 18 + (topFull - topH)

  // Bottom sand grows from bottom up
  const botFull = 75
  const botH = botFull * p
  const botY = 268 - botH

  // Stream end point
  const streamEnd = botH > 0 ? botY : 268

  return (
    <svg viewBox="0 0 100 290" width="130" height="377">
      <defs>
        <linearGradient id="sandG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5d060" />
          <stop offset="100%" stopColor="#d4952b" />
        </linearGradient>
        <linearGradient id="frameG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a07010" />
          <stop offset="50%" stopColor="#dab040" />
          <stop offset="100%" stopColor="#a07010" />
        </linearGradient>
        {/* Top bulb: wide at top, narrows to center */}
        <clipPath id="cTop">
          <path d="M 12,15 L 88,15 L 88,70 Q 88,93 50,95 Q 12,93 12,70 Z" />
        </clipPath>
        {/* Bottom bulb: narrow at center, widens to bottom */}
        <clipPath id="cBot">
          <path d="M 50,195 Q 88,197 88,220 L 88,270 L 12,270 L 12,220 Q 12,197 50,195 Z" />
        </clipPath>
      </defs>

      {/* Top frame bar */}
      <rect x="5" y="4" width="90" height="9" rx="4" fill="url(#frameG)" />
      {/* Bottom frame bar */}
      <rect x="5" y="277" width="90" height="9" rx="4" fill="url(#frameG)" />

      {/* Left pillar */}
      <rect x="10" y="13" width="4" height="264" rx="2" fill="#b8900b" opacity="0.5" />
      {/* Right pillar */}
      <rect x="86" y="13" width="4" height="264" rx="2" fill="#b8900b" opacity="0.5" />

      {/* Glass outline - top bulb */}
      <path d="M 12,15 L 88,15 L 88,70 Q 88,93 50,95 Q 12,93 12,70 Z"
        fill="rgba(220,235,250,0.25)" stroke="#b8960b" strokeWidth="2" />

      {/* Glass outline - bottom bulb */}
      <path d="M 50,195 Q 88,197 88,220 L 88,270 L 12,270 L 12,220 Q 12,197 50,195 Z"
        fill="rgba(220,235,250,0.25)" stroke="#b8960b" strokeWidth="2" />

      {/* Neck connecting the two bulbs */}
      <path d="M 12,70 Q 12,93 50,95 L 50,195 Q 12,197 12,220"
        fill="none" stroke="#b8960b" strokeWidth="2" />
      <path d="M 88,70 Q 88,93 50,95 L 50,195 Q 88,197 88,220"
        fill="none" stroke="#b8960b" strokeWidth="2" />

      {/* Sand in top bulb */}
      {topH > 1 && (
        <rect x="10" y={topY} width="80" height={topH + 2}
          fill="url(#sandG)" clipPath="url(#cTop)" />
      )}

      {/* Sand in bottom bulb */}
      {botH > 1 && (
        <rect x="10" y={botY} width="80" height={botH + 2}
          fill="url(#sandG)" clipPath="url(#cBot)" />
      )}

      {/* Falling sand stream through neck */}
      {running && progress < 100 && (
        <line x1="50" y1="90" x2="50" y2={streamEnd}
          stroke="#d4952b" strokeWidth="2" strokeLinecap="round" opacity="0.85">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="0.6s" repeatCount="indefinite" />
        </line>
      )}

      {/* Glass shine */}
      <line x1="20" y1="22" x2="20" y2="60" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="225" x2="20" y2="260" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function playAlarm() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const notes = [800, 1000, 800, 1000, 800]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.25)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.25 + 0.2)
      osc.start(ctx.currentTime + i * 0.25)
      osc.stop(ctx.currentTime + i * 0.25 + 0.25)
    })
  } catch {
    // Audio not available
  }
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
            playAlarm()
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

function DiceFace({ value, size = 120 }) {
  // Dot positions for each face value (on a 5x5 grid mapped to the die face)
  const dotPositions = {
    1: [[50, 50]],
    2: [[25, 25], [75, 75]],
    3: [[25, 25], [50, 50], [75, 75]],
    4: [[25, 25], [75, 25], [25, 75], [75, 75]],
    5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
    6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]],
  }
  const dots = dotPositions[value] || []
  const r = size * 0.08

  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <rect x="2" y="2" width="96" height="96" rx="16" ry="16"
        fill="white" stroke="#ccc" strokeWidth="2"
        filter="url(#diceShadow)" />
      <defs>
        <filter id="diceShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
        </filter>
      </defs>
      {dots.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="#333" />
      ))}
    </svg>
  )
}

function Dice() {
  const [value, setValue] = useState(3)
  const [rolling, setRolling] = useState(false)
  const [rotation, setRotation] = useState(0)

  const roll = useCallback(() => {
    setRolling(true)
    let count = 0
    const interval = setInterval(() => {
      setValue(Math.floor(Math.random() * 6) + 1)
      setRotation(prev => prev + 90)
      count++
      if (count > 10) {
        clearInterval(interval)
        setRolling(false)
      }
    }, 80)
  }, [])

  return (
    <div className="fullscreen-tool">
      <div className="dice-container">
        <div
          className={`dice-cube ${rolling ? 'rolling' : ''}`}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <DiceFace value={value} size={160} />
        </div>
        {!rolling && (
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
