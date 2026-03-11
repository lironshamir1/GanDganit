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
          <svg viewBox="0 0 140 110" width="140" height="110">
            {/* Head - large round circle on the right */}
            <circle cx="108" cy="38" r="22" fill="#fce8e0" stroke="#d4836a" strokeWidth="2" />
            {/* Hair bun/ponytail - small circle on top-right of head */}
            <circle cx="122" cy="18" r="8" fill="none" stroke="#d4836a" strokeWidth="1.8" />
            {/* Hair line connecting bun to head */}
            <path d="M 118,22 Q 120,28 116,30" fill="none" stroke="#d4836a" strokeWidth="1.5" />
            {/* Eye - single dot (side view) */}
            <circle cx="103" cy="36" r="2" fill="#d4836a"/>
            {/* Cheek blush */}
            <circle cx="100" cy="42" r="3.5" fill="#f0b0a0" opacity="0.4"/>
            {/* Mouth - small curve */}
            <path d="M 100,44 Q 103,47 106,45" fill="none" stroke="#d4836a" strokeWidth="1.3" strokeLinecap="round"/>
            {/* Back/torso - curved line from head down and to the left */}
            <path d="M 95,55 Q 75,62 55,72" fill="none" stroke="#d4836a" strokeWidth="2" strokeLinecap="round"/>
            {/* Right arm - reaching down to ground */}
            <path d="M 68,65 Q 55,80 45,92" fill="none" stroke="#d4836a" strokeWidth="2" strokeLinecap="round"/>
            {/* Left arm - reaching down to ground */}
            <path d="M 60,69 Q 45,82 35,90" fill="none" stroke="#d4836a" strokeWidth="2" strokeLinecap="round"/>
            {/* Hand details - small fingers */}
            <path d="M 45,92 Q 42,95 40,93" fill="none" stroke="#d4836a" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M 35,90 Q 32,93 30,91" fill="none" stroke="#d4836a" strokeWidth="1.3" strokeLinecap="round"/>
            {/* Right leg - going back and down */}
            <path d="M 95,55 Q 100,72 105,92" fill="none" stroke="#d4836a" strokeWidth="2" strokeLinecap="round"/>
            {/* Left leg - slightly apart */}
            <path d="M 90,58 Q 88,75 82,92" fill="none" stroke="#d4836a" strokeWidth="2" strokeLinecap="round"/>
            {/* Feet */}
            <path d="M 105,92 Q 108,95 112,93" fill="none" stroke="#d4836a" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M 82,92 Q 79,95 76,93" fill="none" stroke="#d4836a" strokeWidth="1.5" strokeLinecap="round"/>
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
