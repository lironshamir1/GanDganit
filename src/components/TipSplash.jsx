import { useEffect, useState } from 'react'
import './TipSplash.css'

/* מוצג פעם אחת בכל פתיחה של האפליקציה, לא בכל חזרה למסך הבית —
   אחרת כל לחיצה על "חזרה למסך הבית" הייתה עולה חמש שניות. */
const SEEN_KEY = 'gandganit-tip-splash-seen'
const VISIBLE_MS = 5000
const FADE_MS = 450

function alreadySeenThisSession() {
  try {
    return Boolean(sessionStorage.getItem(SEEN_KEY))
  } catch {
    /* בלי גישה ל-sessionStorage עדיף לא לחסום את המסך */
    return true
  }
}

export default function TipSplash({ tip }) {
  const [phase, setPhase] = useState(() => (alreadySeenThisSession() ? 'done' : 'visible'))

  useEffect(() => {
    if (phase === 'done') return
    try {
      sessionStorage.setItem(SEEN_KEY, '1')
    } catch {
      /* אם אי אפשר לשמור, פשוט יוצג שוב בפתיחה הבאה */
    }
  }, [phase])

  useEffect(() => {
    if (phase !== 'visible') return
    const timer = setTimeout(() => setPhase('leaving'), VISIBLE_MS)
    return () => clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== 'leaving') return
    const timer = setTimeout(() => setPhase('done'), FADE_MS)
    return () => clearTimeout(timer)
  }, [phase])

  if (phase === 'done' || !tip) return null

  return (
    <div
      className={`tip-splash ${phase === 'leaving' ? 'leaving' : ''}`}
      onClick={() => setPhase('leaving')}
      role="button"
      tabIndex={0}
      aria-label="דילוג על הטיפ היומי"
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setPhase('leaving') }}
    >
      <div className="tip-splash-inner">
        <span className="tip-splash-icon">💡</span>
        <p className="tip-splash-label">טיפ יומי</p>
        <p className="tip-splash-text">{tip}</p>
        <div className="tip-splash-bar">
          <div className="tip-splash-bar-fill" />
        </div>
        <p className="tip-splash-skip">לחצו לדילוג</p>
      </div>
    </div>
  )
}
