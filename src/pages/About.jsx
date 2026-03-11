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
        <div className="about-placeholder">
          <span className="about-icon">👩‍🏫</span>
          <h2 className="about-subtitle">גן דגנית</h2>
          <p className="about-text">הורים יקרים, שמחים להציג לכם את האתר החדש של גן דגנית! תמצאו בו עדכונים, מידע ותכנים שיחזקו את הקשר בין הגן לבית. מוזמנים להיכנס ולהשתמש באופן שוטף, כי החיבור והתיאום ביננו הם הכוח שמניע אותם קדימה.</p>
        </div>
      </div>
    </div>
  )
}
