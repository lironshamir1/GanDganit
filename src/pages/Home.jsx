import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './Home.css'

const modules = [
  { path: '/qa', title: 'שאלות ותשובות', icon: '💬', desc: 'מענה מקצועי להורים', color: '#7EC8C8', bg: 'linear-gradient(135deg, #E0F4F4, #B5E0E0)' },
  { path: '/activities', title: 'רעיונות לפעילויות', icon: '🎨', desc: 'פעילויות מותאמות לילד', color: '#B8A9D4', bg: 'linear-gradient(135deg, #EDE7F6, #D4C9E8)' },
  { path: '/speech', title: 'אימוני שפה', icon: '🗣️', desc: 'תרגילים לפיתוח הדיבור', color: '#7EC8C8', bg: 'linear-gradient(135deg, #E0F4F4, #D4F5F5)' },
  { path: '/independence', title: 'בניית עצמאות', icon: '⭐', desc: 'מדריך שלב אחר שלב', color: '#F8C8A4', bg: 'linear-gradient(135deg, #FFF3E8, #F8C8A4)' },
  { path: '/boundaries', title: 'הצבת גבולות', icon: '🛡️', desc: 'גבולות באהבה ובעקביות', color: '#F2A07B', bg: 'linear-gradient(135deg, #FDEBD0, #F2A07B)' },
  { path: '/gan-updates', title: 'עדכונים מהגן', icon: '📋', desc: 'הודעות ועדכונים שוטפים', color: '#A8D5BA', bg: 'linear-gradient(135deg, #E8F5E9, #A8D5BA)' },
  { path: '/tasks', title: 'לוח משימות', icon: '🏆', desc: 'משימות יומיות ותגמולים', color: '#F5C6D0', bg: 'linear-gradient(135deg, #FCE4EC, #F5C6D0)' },
  { path: '/inspiration', title: 'רגע של השראה', icon: '✨', desc: 'חיזוק ותמיכה להורים', color: '#B8A9D4', bg: 'linear-gradient(135deg, #F3E5F5, #D4C9E8)' },
  { path: '/schedule', title: 'סדר יום', icon: '📅', desc: 'תכנון וניהול היום', color: '#7EC8C8', bg: 'linear-gradient(135deg, #E0F7FA, #B5E0E0)' },
  { path: '/reminders', title: 'תזכורות', icon: '🔔', desc: 'תזכורות לטיפולים ומשימות', color: '#DDA0DD', bg: 'linear-gradient(135deg, #F8E8F8, #E8D0E8)' },
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
  'תרגלו יחד לומר "בוקר טוב" ו"להתראות" לגננת.',
  'שימו בתיק פתק קטן עם ציור של לב — מפתיע ומחזק.',
  'היום תנו לילד לצאת קצת מוקדם — הגעה רגועה לגן משנה את היום.',
  'תרגלו יחד רוכסן — תפסו את ההתחלה ותנו לילד להמשיך.',
  'ערכו ביחד את "פינת הרגעה" בבית — כריות, ספרים ודובי.',
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
