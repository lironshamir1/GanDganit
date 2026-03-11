import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { dailyQuotes } from '../data/inspirationData'
import './Landing.css'

function getRandomQuote() {
  return dailyQuotes[Math.floor(Math.random() * dailyQuotes.length)]
}

export default function Landing() {
  const navigate = useNavigate()
  const [quote] = useState(getRandomQuote)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <div className="landing-page" onClick={() => navigate('/home')}>
      <div className={`landing-content ${visible ? 'visible' : ''}`}>
        <div className="landing-logo">
          <svg viewBox="0 0 120 180" width="120" height="180">
            {/* Happy standing child */}

            {/* Hair (behind head) */}
            <path d="M 42,28 Q 38,18 44,10 Q 52,2 64,4 Q 76,6 80,16 Q 82,22 78,28" fill="#e8907a" opacity="0.3" stroke="#e8907a" strokeWidth="2" strokeLinecap="round"/>
            {/* Pigtail left */}
            <path d="M 42,22 Q 32,16 34,8" fill="none" stroke="#e8907a" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="34" cy="6" r="3" fill="#e8907a" opacity="0.4"/>
            {/* Pigtail right */}
            <path d="M 78,22 Q 88,16 86,8" fill="none" stroke="#e8907a" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="86" cy="6" r="3" fill="#e8907a" opacity="0.4"/>

            {/* Head */}
            <circle cx="60" cy="36" r="22" fill="#FFF5EE" stroke="#e8907a" strokeWidth="2.5"/>

            {/* Eyes - happy dots */}
            <circle cx="52" cy="34" r="2.5" fill="#e8907a"/>
            <circle cx="68" cy="34" r="2.5" fill="#e8907a"/>

            {/* Blush cheeks */}
            <circle cx="46" cy="40" r="4" fill="#f4a89a" opacity="0.35"/>
            <circle cx="74" cy="40" r="4" fill="#f4a89a" opacity="0.35"/>

            {/* Happy smile */}
            <path d="M 53,44 Q 60,52 67,44" fill="none" stroke="#e8907a" strokeWidth="2" strokeLinecap="round"/>

            {/* Neck */}
            <line x1="60" y1="58" x2="60" y2="65" stroke="#e8907a" strokeWidth="2.5" strokeLinecap="round"/>

            {/* Body / dress */}
            <path d="M 42,68 L 60,65 L 78,68 L 82,105 Q 60,112 38,105 Z" fill="#e8907a" opacity="0.15" stroke="#e8907a" strokeWidth="2.5" strokeLinejoin="round"/>

            {/* Left arm - waving */}
            <path d="M 42,72 Q 28,68 20,55" fill="none" stroke="#e8907a" strokeWidth="2.5" strokeLinecap="round"/>
            {/* Left hand */}
            <circle cx="19" cy="53" r="4" fill="#FFF5EE" stroke="#e8907a" strokeWidth="2"/>

            {/* Right arm - waving */}
            <path d="M 78,72 Q 92,68 100,55" fill="none" stroke="#e8907a" strokeWidth="2.5" strokeLinecap="round"/>
            {/* Right hand */}
            <circle cx="101" cy="53" r="4" fill="#FFF5EE" stroke="#e8907a" strokeWidth="2"/>

            {/* Left leg */}
            <path d="M 48,105 L 45,145" fill="none" stroke="#e8907a" strokeWidth="2.5" strokeLinecap="round"/>
            {/* Left shoe */}
            <ellipse cx="43" cy="148" rx="8" ry="4" fill="#e8907a" opacity="0.3" stroke="#e8907a" strokeWidth="2"/>

            {/* Right leg */}
            <path d="M 72,105 L 75,145" fill="none" stroke="#e8907a" strokeWidth="2.5" strokeLinecap="round"/>
            {/* Right shoe */}
            <ellipse cx="77" cy="148" rx="8" ry="4" fill="#e8907a" opacity="0.3" stroke="#e8907a" strokeWidth="2"/>
          </svg>
        </div>
        <h1 className="landing-title">גן דגנית</h1>
        <div className={`landing-quote ${visible ? 'visible' : ''}`}>
          <span className="landing-quote-icon">💜</span>
          <p className="landing-quote-text">"{quote}"</p>
        </div>

        <p className="landing-cta">לחצו להמשיך →</p>
      </div>
    </div>
  )
}
