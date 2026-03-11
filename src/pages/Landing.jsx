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
          <svg viewBox="0 0 220 170" width="200" height="155">
            {/* ===== BOY (left) ===== */}

            {/* Head */}
            <circle cx="65" cy="36" r="22" fill="#FFF5EE" stroke="#e8907a" strokeWidth="2.5"/>

            {/* Short hair */}
            <path d="M 44,30 Q 43,18 50,12 Q 58,6 70,8 Q 80,10 84,20 Q 86,26 83,30" fill="#e8907a" opacity="0.25" stroke="#e8907a" strokeWidth="2" strokeLinecap="round"/>

            {/* Eyes */}
            <circle cx="57" cy="34" r="2.5" fill="#e8907a"/>
            <circle cx="73" cy="34" r="2.5" fill="#e8907a"/>

            {/* Cheeks */}
            <circle cx="51" cy="40" r="4" fill="#f4a89a" opacity="0.35"/>
            <circle cx="79" cy="40" r="4" fill="#f4a89a" opacity="0.35"/>

            {/* Smile */}
            <path d="M 58,44 Q 65,52 72,44" fill="none" stroke="#e8907a" strokeWidth="2" strokeLinecap="round"/>

            {/* Neck */}
            <line x1="65" y1="58" x2="65" y2="65" stroke="#e8907a" strokeWidth="2.5" strokeLinecap="round"/>

            {/* Body / shirt */}
            <path d="M 47,68 L 65,65 L 83,68 L 87,105 Q 65,112 43,105 Z" fill="#e8907a" opacity="0.15" stroke="#e8907a" strokeWidth="2.5" strokeLinejoin="round"/>

            {/* Left arm - down */}
            <path d="M 47,72 Q 35,82 30,95" fill="none" stroke="#e8907a" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="29" cy="97" r="4" fill="#FFF5EE" stroke="#e8907a" strokeWidth="2"/>

            {/* Right arm - reaching to girl */}
            <path d="M 83,72 Q 95,72 108,68" fill="none" stroke="#e8907a" strokeWidth="2.5" strokeLinecap="round"/>

            {/* Left leg */}
            <path d="M 53,105 L 50,145" fill="none" stroke="#e8907a" strokeWidth="2.5" strokeLinecap="round"/>
            <ellipse cx="48" cy="148" rx="8" ry="4" fill="#e8907a" opacity="0.3" stroke="#e8907a" strokeWidth="2"/>

            {/* Right leg */}
            <path d="M 77,105 L 80,145" fill="none" stroke="#e8907a" strokeWidth="2.5" strokeLinecap="round"/>
            <ellipse cx="82" cy="148" rx="8" ry="4" fill="#e8907a" opacity="0.3" stroke="#e8907a" strokeWidth="2"/>

            {/* ===== GIRL (right) ===== */}

            {/* Head */}
            <circle cx="155" cy="36" r="22" fill="#FFF5EE" stroke="#e8907a" strokeWidth="2.5"/>

            {/* Hair behind head */}
            <path d="M 134,30 Q 132,16 140,10 Q 148,4 160,5 Q 170,7 175,16 Q 177,22 175,30" fill="#e8907a" opacity="0.25" stroke="#e8907a" strokeWidth="2" strokeLinecap="round"/>
            {/* Pigtail left */}
            <path d="M 136,22 Q 126,16 128,8" fill="none" stroke="#e8907a" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="128" cy="6" r="3" fill="#e8907a" opacity="0.4"/>
            {/* Pigtail right */}
            <path d="M 174,22 Q 184,16 182,8" fill="none" stroke="#e8907a" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="182" cy="6" r="3" fill="#e8907a" opacity="0.4"/>

            {/* Eyes */}
            <circle cx="147" cy="34" r="2.5" fill="#e8907a"/>
            <circle cx="163" cy="34" r="2.5" fill="#e8907a"/>

            {/* Cheeks */}
            <circle cx="141" cy="40" r="4" fill="#f4a89a" opacity="0.35"/>
            <circle cx="169" cy="40" r="4" fill="#f4a89a" opacity="0.35"/>

            {/* Smile */}
            <path d="M 148,44 Q 155,52 162,44" fill="none" stroke="#e8907a" strokeWidth="2" strokeLinecap="round"/>

            {/* Neck */}
            <line x1="155" y1="58" x2="155" y2="65" stroke="#e8907a" strokeWidth="2.5" strokeLinecap="round"/>

            {/* Body / dress */}
            <path d="M 137,68 L 155,65 L 173,68 L 177,105 Q 155,112 133,105 Z" fill="#e8907a" opacity="0.15" stroke="#e8907a" strokeWidth="2.5" strokeLinejoin="round"/>

            {/* Left arm - reaching to boy */}
            <path d="M 137,72 Q 125,72 112,68" fill="none" stroke="#e8907a" strokeWidth="2.5" strokeLinecap="round"/>

            {/* Holding hands - connected circle */}
            <circle cx="110" cy="68" r="5" fill="#f4a89a" opacity="0.4" stroke="#e8907a" strokeWidth="2"/>

            {/* Right arm - down */}
            <path d="M 173,72 Q 185,82 190,95" fill="none" stroke="#e8907a" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="191" cy="97" r="4" fill="#FFF5EE" stroke="#e8907a" strokeWidth="2"/>

            {/* Left leg */}
            <path d="M 143,105 L 140,145" fill="none" stroke="#e8907a" strokeWidth="2.5" strokeLinecap="round"/>
            <ellipse cx="138" cy="148" rx="8" ry="4" fill="#e8907a" opacity="0.3" stroke="#e8907a" strokeWidth="2"/>

            {/* Right leg */}
            <path d="M 167,105 L 170,145" fill="none" stroke="#e8907a" strokeWidth="2.5" strokeLinecap="round"/>
            <ellipse cx="172" cy="148" rx="8" ry="4" fill="#e8907a" opacity="0.3" stroke="#e8907a" strokeWidth="2"/>

            {/* Heart between them */}
            <path d="M 110,52 Q 107,46 110,43 Q 113,40 116,43 L 110,52 L 104,43 Q 107,40 110,43" fill="#e8907a" opacity="0.4" stroke="none"/>
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
