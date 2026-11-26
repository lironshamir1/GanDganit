import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import './HomePopup.css'

/* הזמנה על כל המסך, על רקע מוחשך. לחיצה בכל מקום סוגרת.
   דרך document.body, מאותה סיבה כמו TipSplash: ל-.page יש transform. */
export default function HomePopup({ popup, onClose }) {
  const [leaving, setLeaving] = useState(false)

  const close = () => setLeaving(true)

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setLeaving(true) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!leaving) return
    const timer = setTimeout(onClose, 250)
    return () => clearTimeout(timer)
  }, [leaving, onClose])

  return createPortal(
    <div
      className={`home-popup ${leaving ? 'leaving' : ''}`}
      onClick={close}
      role="button"
      tabIndex={0}
      aria-label="סגירת ההזמנה"
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') close() }}
    >
      <img className="home-popup-image" src={popup.src} alt={popup.alt} />
      <p className="home-popup-hint">לחצו בכל מקום לסגירה</p>
    </div>,
    document.body
  )
}
