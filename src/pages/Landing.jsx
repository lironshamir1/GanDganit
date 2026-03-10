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
        <div className="landing-logo">🌸</div>
        <h1 className="landing-title">גן דגנית</h1>
        <p className="landing-subtitle">האפליקציה שלי כהורה</p>

        <div className={`landing-quote ${visible ? 'visible' : ''}`}>
          <span className="landing-quote-icon">💜</span>
          <p className="landing-quote-text">"{quote}"</p>
        </div>

        <p className="landing-cta">לחצו להמשיך →</p>
      </div>
    </div>
  )
}
