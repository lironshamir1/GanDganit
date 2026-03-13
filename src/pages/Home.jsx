import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './Home.css'

const modules = [
  { path: '/qa',           title: 'שאלות ותשובות',     icon: '/icons/icon-qa.png',           desc: 'מענה מקצועי להורים',           bg: 'linear-gradient(135deg,#D0F4EE,#B8EDE4)' },
  { path: '/activities',   title: 'רעיונות לפעילויות',  icon: '/icons/icon-activities.png',   desc: 'פעילויות מותאמות לילד',         bg: 'linear-gradient(135deg,#E8E2FF,#D9D0F5)' },
  { path: '/speech',       title: 'אימוני שפה',          icon: '/icons/icon-speech.png',       desc: 'תרגילים לפיתוח הדיבור',        bg: 'linear-gradient(135deg,#FFE8EE,#FFD6E0)' },
  { path: '/independence', title: 'בניית עצמאות',        icon: '/icons/icon-independence.png', desc: 'מדריך שלב אחר שלב',            bg: 'linear-gradient(135deg,#FFFBE0,#FFF3B0)' },
  { path: '/boundaries',   title: 'הצבת גבולות',         icon: '/icons/icon-boundaries.png',   desc: 'גבולות באהבה ובעקביות',        bg: 'linear-gradient(135deg,#FFE8D8,#FFD6B8)' },
  { path: '/gan-updates',  title: 'עדכונים מהגן',         icon: '/icons/icon-ganupdates.png',   desc: 'הודעות ועדכונים שוטפים',       bg: 'linear-gradient(135deg,#D8F5E4,#C8F0D8)' },
  { path: '/tasks',        title: 'לוח משימות',            icon: '/icons/icon-tasks.png',        desc: 'משימות יומיות ותגמולים',       bg: 'linear-gradient(135deg,#FFE0E0,#FFD0D0)' },
  { path: '/inspiration',  title: 'רגע של השראה',          icon: '/icons/icon-inspiration.png',  desc: 'חיזוק ותמיכה להורים',          bg: 'linear-gradient(135deg,#EAE0FF,#E4D8FF)' },
  { path: '/schedule',     title: 'סדר יום',               icon: '/icons/icon-schedule.png',     desc: 'תכנון וניהול היום',            bg: 'linear-gradient(135deg,#D8EEFF,#C2E4FF)' },
  { path: '/reminders',    title: 'תזכורות',                icon: '/icons/icon-reminders.png',    desc: 'תזכורות לטיפולים ומשימות',    bg: 'linear-gradient(135deg,#EEE0FF,#E4D8FF)' },
  { path: '/toolbox',      title: 'ארגז כלים',              icon: '/icons/icon-toolbox.png',      desc: 'שעון חול, טיימר וקובייה',     bg: 'linear-gradient(135deg,#FFF0D8,#FFE4B8)' },
  { path: '/about',        title: 'מי אנחנו',               icon: '/icons/icon-about.png',        desc: 'קצת עלינו ועל הגן',           bg: 'linear-gradient(135deg,#FFE8E8,#FFD0D0)' },
]

const dailyTips = [
  'ודאו שהילד מצליח לפתוח בעצמו את קופסת האוכל לפני שתשלחו אותה לגן.',
  'היום זו הזדמנות טובה לפגוש חבר מהגן בגן השעשועים.',
  'תנו לילד לבחור לבד את הבגדים להיום — זה בונה עצמאות!',
  'הכינו יחד את התיק לגן הערב — זה מחזק שגרה.',
  'שאלו את הילד "מה היה הדבר הכי כיף היום?" במקום "איך היה בגן?"',
  'תרגלו יחד נעילת נעליים — כל יום קצת, בלי לחץ.',
  'ספרו לילד מה הולך לקרות מחר — זה מפחית חרדה.',
  'היום תנו לילד לעזור לכם במטבח — גם ערבוב בקערה זה הישג!',
  'שימו לב אם הילד מתקשה לשבת בזמן ארוחה — אולי הכיסא לא נוח.',
  'תרגלו יחד שטיפת ידיים עם שיר — הופכים את זה לכיף!',
  'הכינו כרטיס עם סדר היום בתמונות — עוזר לילד להרגיש בטוח.',
  'היום תנו מחמאה ספציפית: "אהבתי איך סידרת את הצעצועים!"',
  'בדקו שיש לילד בגן בגדי חילוף — שקט נפשי לכולם.',
  'תנו לילד 5 דקות התראה לפני מעבר בין פעילויות.',
  'הקדישו 10 דקות משחק אחד-על-אחד עם הילד — בלי טלפון.',
]

function getRandomTip() {
  return dailyTips[Math.floor(Math.random() * dailyTips.length)]
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'בוקר טוב'
  if (hour < 17) return 'צהריים טובים'
  if (hour < 21) return 'ערב טוב'
  return 'לילה טוב'
}

export default function Home() {
  const [tip] = useState(getRandomTip)
  const greeting = getGreeting()
  const [visible, setVisible] = useState(false)

  useEffect(() => { setVisible(true) }, [])

  return (
    <div className="page home-page">
      <div className={`home-header ${visible ? 'visible' : ''}`}>
        <div className="home-badge">גן דגנית 🌸</div>
        <h1 className="home-title">{greeting}!</h1>
        <p className="home-subtitle">ברוכים הבאים לאזור ההורים</p>
      </div>

      <div className={`quote-card ${visible ? 'visible' : ''}`}>
        <span className="quote-icon">💡</span>
        <p className="quote-label">טיפ יומי</p>
        <p className="quote-text">{tip}</p>
      </div>

      <div className="modules-grid">
        {modules.map((mod, i) => (
          <Link
            key={mod.path}
            to={mod.path}
            className={`module-card ${visible ? 'visible' : ''}`}
            style={{ '--card-bg': mod.bg, animationDelay: `${i * 0.055}s` }}
          >
            <div className="module-icon-wrap" style={{ background: mod.bg }}>
              <img src={mod.icon} alt={mod.title} className="module-img" />
            </div>
            <h3 className="module-title">{mod.title}</h3>
            <p className="module-desc">{mod.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
