import { useEffect, useState } from 'react'
import './EventInvite.css'

// הזמנה שנפתחת בכניסה לאתר ונסגרת בלחיצה.
// מוצגת עד סוף יום האירוע, ואחר כך נעלמת לבד.
const INVITE = {
  image: '/hanukkah-invite-2026.jpg',
  alt: 'הזמנה למסיבת חנוכה בגן דגנית: נחגוג ביחד, הורים, ילדים וצוות. יום שישי, 4.12, בשעה 10:30.',
  // היום שאחרי האירוע (חודשים נספרים מ-0, כלומר 11 הוא דצמבר)
  hideFrom: new Date(2026, 11, 5),
}

// פעם אחת בכל כניסה לאתר: מתאפס בטעינה מחדש של האתר, לא במעבר בין עמודים
let shownThisVisit = false

export default function EventInvite() {
  const [open, setOpen] = useState(
    () => !shownThisVisit && new Date() < INVITE.hideFrom
  )

  useEffect(() => {
    if (!open) return
    shownThisVisit = true
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  if (!open) return null

  return (
    <div
      className="event-invite-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="הזמנה למסיבת חנוכה"
      onClick={() => setOpen(false)}
    >
      <button
        type="button"
        className="event-invite-close"
        aria-label="סגירת ההזמנה"
        autoFocus
      >
        ×
      </button>
      <img className="event-invite-image" src={INVITE.image} alt={INVITE.alt} />
    </div>
  )
}
