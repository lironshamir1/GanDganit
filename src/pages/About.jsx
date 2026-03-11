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
          <p className="about-text">תוכן בקרוב...</p>
        </div>
      </div>
    </div>
  )
}
