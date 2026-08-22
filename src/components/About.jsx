import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import './About.css'

/* "מי אנחנו" אינו עמוד אלא פופ-אפ שנפתח מאייקון קבוע בפינה
   השמאלית העליונה, כדי שיהיה נגיש מכל מקום באפליקציה. */
function AboutPopup({ onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return createPortal(
    <div className="about-overlay" onClick={onClose}>
      <div className="about-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="about-sheet-bar">
          <span className="about-sheet-title">מי אנחנו</span>
          <button type="button" className="about-sheet-close" onClick={onClose} aria-label="סגירה">
            ✕
          </button>
        </div>

        <div className="about-sheet-body">
          <div className="about-section">
            <p className="about-text">
              גן דגנית הוא גן לילדים עם עיכוב התפתחותי. בגן פועל צוות רב-מקצועי שעובד יחד מתוך תפיסה אינטגרטיבית, כאשר לכל ילד נבנית תוכנית אישית המבוססת על הבנת הקשיים שלו לצד איתור נקודות החוזק. אנחנו מאמינים בטיפוח עצמאות, עידוד לאחריות והצבת גבולות — דרך סביבה מותאמת, סדר יום עשיר וליווי אישי צמוד. ההורים הם שותפים מלאים בתהליכי הטיפול השונים מתוך הבנה שהתיאום ושיתוף הפעולה בין כל הגורמים הם המפתח להצלחה של כל ילד.
            </p>
          </div>

          <div className="about-section">
            <h2 className="about-subtitle">הצוות שלנו</h2>
            <ul className="team-list">
              <li><strong>רינת שמיר</strong> — גננת ומנהלת הגן</li>
              <li><strong>סמדר אברג׳יל</strong> — סייעת</li>
              <li><strong>מורן אושרי</strong> — גננת משלימה</li>
              <li><strong>גלי אהרון לוי</strong> — מרפאה בעיסוק</li>
              <li><strong>לילך כספרי</strong> — קלינאית תקשורת</li>
              <li><strong>דיאנה שדה</strong> — מטפלת רגשית במוסיקה</li>
              <li><strong>קארין סגל בן מיכה</strong> — מנתחת התנהגות</li>
              <li><strong>שירן עמוסי</strong> — פסיכולוג</li>
              <li><strong>מורן לוקצקי</strong> — מתנדבת</li>
            </ul>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default function AboutButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        className="about-fab"
        onClick={() => setOpen(true)}
        aria-label="מי אנחנו"
      >
        👩‍🏫
      </button>
      {open && <AboutPopup onClose={() => setOpen(false)} />}
    </>
  )
}
