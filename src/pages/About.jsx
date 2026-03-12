import { useNavigate } from 'react-router-dom'
import './About.css'

export default function About() {
  const navigate = useNavigate()

  return (
    <div className="page about-page">
      <div className="about-header">
        <button className="back-btn" onClick={() => navigate('/home')}>→</button>
        <h1 className="about-title">מי אנחנו</h1>
      </div>

      <div className="about-content">
        <div className="about-section">
          <p className="about-text">
            גן דגנית הוא גן לילדים עם עיכוב התפתחותי. בגן פועל צוות רב-מקצועי שעובד יחד מתוך תפיסה אינטגרטיבית, כאשר לכל ילד נבנית תוכנית אישית המבוססת על הבנת הקשיים שלו לצד איתור נקודות החוזק. אנחנו מאמינים בטיפוח עצמאות, עידוד לאחריות והצבת גבולות — דרך סביבה מותאמת, סדר יום עשיר וליווי אישי צמוד. ההורים הם שותפים מלאים בתהליכי הטיפול השונים מתוך הבנה שהתיאום ושיתוף הפעולה בין כל הגורמים הם המפתח להצלחה של כל ילד.
          </p>
        </div>

        <div className="about-section">
          <h2 className="about-subtitle">הצוות שלנו</h2>
          <ul className="team-list">
            <li><strong>רינת שמיר</strong> — גננת ומנהלת הגן</li>
            <li><strong>גלי אהרון לוי</strong> — מרפאה בעיסוק</li>
            <li><strong>לילך כספרי</strong> — קלינאית תקשורת</li>
            <li><strong>קרן אבראשי</strong> — מטפלת רגשית במוסיקה</li>
            <li><strong>קארין סגל בן מיכה</strong> — מנתחת התנהגות</li>
            <li><strong>שירן עמוסי</strong> — פסיכולוג</li>
            <li><strong>סמדר אברג׳יל ואסתר תגאיה טרונך</strong> — סייעות</li>
            <li><strong>מעיין בן אשר</strong> — בת שירות</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
