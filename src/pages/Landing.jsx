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
          <img src="/landing-figure.png" alt="גן דגנית" width="160" height="160" />
        </div>
        <h1 className="landing-title">גן דגנית</h1>
        <p className="landing-intro">הורים יקרים, שמחים להציג לכם את האתר החדש של גן דגנית! תמצאו בו עדכונים, מידע ותכנים שיחזקו את הקשר בין הגן לבית. מוזמנים להיכנס ולהשתמש באופן שוטף, כי החיבור והתיאום ביננו הם הכוח שמניע את הילדים שלנו קדימה.</p>
        <div className={`landing-quote ${visible ? 'visible' : ''}`}>
          <span className="landing-quote-icon">💜</span>
          <p className="landing-quote-text">"{quote}"</p>
        </div>

        <p className="landing-cta">לחצו להמשיך →</p>
      </div>
    </div>
  )
}
