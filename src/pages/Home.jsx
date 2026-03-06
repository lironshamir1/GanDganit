import { Link } from 'react-router-dom'
import { dailyQuotes } from '../data/inspirationData'
import './Home.css'

const modules = [
  { path: '/qa', title: 'שאלו אותנו', icon: '💬', desc: 'שאלות ותשובות מותאמות', color: '#6C9BCF' },
  { path: '/activities', title: 'בואו נשחק', icon: '🎨', desc: 'רעיונות לפעילויות', color: '#A8D5BA' },
  { path: '/independence', title: 'אני יכול לבד!', icon: '⭐', desc: 'בניית עצמאות', color: '#F4B942' },
  { path: '/boundaries', title: 'הגבולות שלנו', icon: '🛡️', desc: 'הצבת גבולות באהבה', color: '#F2A07B' },
  { path: '/tasks', title: 'המשימה שלי', icon: '🏆', desc: 'משימות ותגמולים', color: '#F5C6D0' },
  { path: '/inspiration', title: 'רגע בשבילך', icon: '✨', desc: 'השראה ונשימה', color: '#B8A9C9' },
  { path: '/schedule', title: 'היום שלנו', icon: '📅', desc: 'יומן סדר יום', color: '#87CEEB' },
  { path: '/reminders', title: 'אל תשכחו!', icon: '🔔', desc: 'תזכורות והתראות', color: '#DDA0DD' },
]

function getDailyQuote() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
  return dailyQuotes[dayOfYear % dailyQuotes.length]
}

export default function Home() {
  const quote = getDailyQuote()

  return (
    <div className="page home-page">
      <div className="home-header">
        <h1 className="home-title">גן דגנית</h1>
        <p className="home-subtitle">ביחד גדלים</p>
      </div>

      <div className="quote-card">
        <p className="quote-text">"{quote}"</p>
      </div>

      <div className="modules-grid">
        {modules.map((mod) => (
          <Link key={mod.path} to={mod.path} className="module-card" style={{ borderRight: `4px solid ${mod.color}` }}>
            <span className="module-icon">{mod.icon}</span>
            <div className="module-info">
              <h3 className="module-title">{mod.title}</h3>
              <p className="module-desc">{mod.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
