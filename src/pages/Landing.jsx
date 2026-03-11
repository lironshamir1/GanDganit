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
          <svg viewBox="0 0 200 200" width="150" height="150">
            {/* Cartwheel child - salmon/coral color */}

            {/* === HEAD === Large circle, tilted to the right */}
            <circle cx="145" cy="105" r="38" fill="none" stroke="#e8907a" strokeWidth="3.5" strokeLinecap="round"/>

            {/* === HAIR === Straight bangs falling down (gravity, head tilted) */}
            <line x1="120" y1="82" x2="112" y2="72" stroke="#e8907a" strokeWidth="3" strokeLinecap="round"/>
            <line x1="127" y1="78" x2="121" y2="67" stroke="#e8907a" strokeWidth="3" strokeLinecap="round"/>
            <line x1="135" y1="76" x2="131" y2="64" stroke="#e8907a" strokeWidth="3" strokeLinecap="round"/>
            <line x1="143" y1="75" x2="141" y2="63" stroke="#e8907a" strokeWidth="3" strokeLinecap="round"/>
            <line x1="151" y1="76" x2="151" y2="64" stroke="#e8907a" strokeWidth="3" strokeLinecap="round"/>

            {/* === EYES === Closed happy eyes (curved arcs) */}
            <path d="M 133,100 Q 136,96 139,100" fill="none" stroke="#e8907a" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M 150,98 Q 153,94 156,98" fill="none" stroke="#e8907a" strokeWidth="2.5" strokeLinecap="round"/>

            {/* === MOUTH === Small happy smile */}
            <path d="M 140,112 Q 145,118 152,112" fill="none" stroke="#e8907a" strokeWidth="2.5" strokeLinecap="round"/>

            {/* === NECK === Short line from head to body */}
            <path d="M 118,125 L 108,135" fill="none" stroke="#e8907a" strokeWidth="3.5" strokeLinecap="round"/>

            {/* === BODY/TORSO === T-shirt shape, leaning left */}
            <path d="M 108,135 L 85,155" fill="none" stroke="#e8907a" strokeWidth="3.5" strokeLinecap="round"/>
            {/* T-shirt sleeve lines */}
            <path d="M 105,138 L 95,132" fill="none" stroke="#e8907a" strokeWidth="3" strokeLinecap="round"/>
            <path d="M 98,145 L 88,139" fill="none" stroke="#e8907a" strokeWidth="3" strokeLinecap="round"/>
            {/* Shirt bottom edge */}
            <path d="M 92,150 L 82,147" fill="none" stroke="#e8907a" strokeWidth="2.5" strokeLinecap="round"/>

            {/* === LEFT ARM === On the ground (support hand) */}
            <path d="M 95,132 Q 72,148 60,170" fill="none" stroke="#e8907a" strokeWidth="3.5" strokeLinecap="round"/>
            {/* Left hand (on ground) */}
            <ellipse cx="58" cy="174" rx="7" ry="5" fill="none" stroke="#e8907a" strokeWidth="3" strokeLinecap="round"/>

            {/* === RIGHT ARM === Raised up high */}
            <path d="M 100,140 Q 82,110 72,68" fill="none" stroke="#e8907a" strokeWidth="3.5" strokeLinecap="round"/>
            {/* Right hand (fingers up) */}
            <line x1="72" y1="68" x2="68" y2="58" stroke="#e8907a" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="72" y1="68" x2="72" y2="56" stroke="#e8907a" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="72" y1="68" x2="76" y2="58" stroke="#e8907a" strokeWidth="2.5" strokeLinecap="round"/>

            {/* === LEFT LEG === On the ground */}
            <path d="M 85,155 Q 75,170 65,185" fill="none" stroke="#e8907a" strokeWidth="3.5" strokeLinecap="round"/>
            {/* Left shoe */}
            <ellipse cx="62" cy="188" rx="8" ry="5" fill="none" stroke="#e8907a" strokeWidth="3" strokeLinecap="round"/>

            {/* === RIGHT LEG === Kicked up */}
            <path d="M 85,155 Q 105,150 118,158" fill="none" stroke="#e8907a" strokeWidth="3.5" strokeLinecap="round"/>
            {/* Right shoe */}
            <ellipse cx="122" cy="160" rx="7" ry="5" fill="none" stroke="#e8907a" strokeWidth="3" strokeLinecap="round"/>
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
