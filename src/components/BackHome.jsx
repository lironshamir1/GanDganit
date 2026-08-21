import { Link } from 'react-router-dom'
import './BackHome.css'

/* מחליף את סרגל הניווט התחתון: הדרך היחידה לצאת מעמוד פנימי.
   חשוב שיופיע בכל עמוד — האפליקציה רצה כ-standalone, ולהורים
   שהתקינו אותה במסך הבית אין כפתור "חזור" של הדפדפן. */
export default function BackHome() {
  return (
    <div className="back-home-bar">
      <Link to="/home" className="back-home-btn">
        <span className="back-home-icon">🏠</span>
        חזרה למסך הבית
      </Link>
    </div>
  )
}
