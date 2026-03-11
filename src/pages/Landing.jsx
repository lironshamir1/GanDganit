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
          <svg viewBox="0 0 120 120" width="120" height="120">
            {/* Head */}
            <circle cx="82" cy="32" r="18" fill="none" stroke="#d4836a" strokeWidth="2.5" strokeLinecap="round"/>
            {/* Hair bun */}
            <circle cx="96" cy="20" r="7" fill="none" stroke="#d4836a" strokeWidth="2" strokeLinecap="round"/>
            {/* Eyes */}
            <circle cx="78" cy="30" r="1.8" fill="#d4836a"/>
            <circle cx="87" cy="30" r="1.8" fill="#d4836a"/>
            {/* Smile */}
            <path d="M 78,36 Q 82,40 87,36" fill="none" stroke="#d4836a" strokeWidth="1.5" strokeLinecap="round"/>
            {/* Body bending forward */}
            <path d="M 72,48 Q 55,58 38,70" fill="none" stroke="#d4836a" strokeWidth="2.5" strokeLinecap="round"/>
            {/* Arms reaching to ground */}
            <path d="M 52,56 L 35,78" fill="none" stroke="#d4836a" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M 48,60 L 28,74" fill="none" stroke="#d4836a" strokeWidth="2.5" strokeLinecap="round"/>
            {/* Legs */}
            <path d="M 72,48 L 80,72 L 84,96" fill="none" stroke="#d4836a" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M 80,72 L 68,96" fill="none" stroke="#d4836a" strokeWidth="2.5" strokeLinecap="round"/>
            {/* Hands */}
            <circle cx="34" cy="80" r="3" fill="#d4836a" opacity="0.4"/>
            <circle cx="26" cy="76" r="3" fill="#d4836a" opacity="0.4"/>
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
