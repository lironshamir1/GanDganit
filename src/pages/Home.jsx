import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { dailyQuotes } from '../data/inspirationData'
import './Home.css'

const modules = [
  { path: '/qa', title: 'שאלו אותנו', icon: '💬', desc: 'שאלות ותשובות מותאמות', color: '#7EC8C8', bg: 'linear-gradient(135deg, #E0F4F4, #B5E0E0)' },
  { path: '/activities', title: 'בואו נשחק', icon: '🎨', desc: 'רעיונות לפעילויות', color: '#B8A9D4', bg: 'linear-gradient(135deg, #EDE7F6, #D4C9E8)' },
  { path: '/independence', title: 'אני יכול לבד!', icon: '⭐', desc: 'בניית עצמאות', color: '#F8C8A4', bg: 'linear-gradient(135deg, #FFF3E8, #F8C8A4)' },
  { path: '/boundaries', title: 'הגבולות שלנו', icon: '🛡️', desc: 'הצבת גבולות באהבה', color: '#F2A07B', bg: 'linear-gradient(135deg, #FDEBD0, #F2A07B)' },
  { path: '/tasks', title: 'המשימה שלי', icon: '🏆', desc: 'משימות ותגמולים', color: '#F5C6D0', bg: 'linear-gradient(135deg, #FCE4EC, #F5C6D0)' },
  { path: '/inspiration', title: 'רגע בשבילך', icon: '✨', desc: 'השראה ונשימה', color: '#B8A9D4', bg: 'linear-gradient(135deg, #F3E5F5, #D4C9E8)' },
  { path: '/schedule', title: 'היום שלנו', icon: '📅', desc: 'יומן סדר יום', color: '#7EC8C8', bg: 'linear-gradient(135deg, #E0F7FA, #B5E0E0)' },
  { path: '/reminders', title: 'אל תשכחו!', icon: '🔔', desc: 'תזכורות והתראות', color: '#DDA0DD', bg: 'linear-gradient(135deg, #F8E8F8, #E8D0E8)' },
]

function getRandomQuote() {
  return dailyQuotes[Math.floor(Math.random() * dailyQuotes.length)]
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'בוקר טוב'
  if (hour < 17) return 'צהריים טובים'
  if (hour < 21) return 'ערב טוב'
  return 'לילה טוב'
}

export default function Home() {
  const [quote] = useState(getRandomQuote)
  const greeting = getGreeting()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <div className="page home-page">
      <div className={`home-header ${visible ? 'visible' : ''}`}>
        <div className="home-greeting">{greeting} !</div>
        <h1 className="home-title">גן דגנית</h1>
      </div>

      <div className={`quote-card ${visible ? 'visible' : ''}`}>
        <span className="quote-icon">💜</span>
        <p className="quote-text">"{quote}"</p>
      </div>

      <div className="modules-grid">
        {modules.map((mod, i) => (
          <Link
            key={mod.path}
            to={mod.path}
            className={`module-card ${visible ? 'visible' : ''}`}
            style={{
              '--card-bg': mod.bg,
              '--card-color': mod.color,
              animationDelay: `${i * 0.06}s`
            }}
          >
            <div className="module-icon-wrap" style={{ background: mod.bg }}>
              <span className="module-icon">{mod.icon}</span>
            </div>
            <h3 className="module-title">{mod.title}</h3>
            <p className="module-desc">{mod.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
