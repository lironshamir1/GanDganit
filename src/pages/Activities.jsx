import { useState } from 'react'
import { activityCategories } from '../data/activitiesData'
import './Activities.css'

export default function Activities() {
  const [selectedCat, setSelectedCat] = useState(null)
  const [expandedActivity, setExpandedActivity] = useState(null)

  const difficultyColor = { 'קל': '#A8D5BA', 'בינוני': '#F4B942', 'קשה': '#F2A07B' }

  return (
    <div className="page">
      <h1 className="page-title">🎨 רעיונות לפעילויות</h1>

      {!selectedCat ? (
        <div className="act-categories">
          {activityCategories.map((cat) => (
            <button
              key={cat.id}
              className="act-cat-card"
              style={{ background: `linear-gradient(135deg, ${cat.color}22, ${cat.color}44)` }}
              onClick={() => setSelectedCat(cat)}
            >
              <span className="emoji-icon">{cat.icon}</span>
              <span className="act-cat-name">{cat.title}</span>
              <span className="act-cat-count">{cat.activities.length} פעילויות</span>
            </button>
          ))}
        </div>
      ) : (
        <div>
          <button className="back-btn" onClick={() => { setSelectedCat(null); setExpandedActivity(null) }}>
            → חזרה לקטגוריות
          </button>
          <h2 className="qa-section-title">{selectedCat.icon} {selectedCat.title}</h2>
          {selectedCat.activities.map((act, idx) => (
            <div key={idx} className="card act-card" onClick={() => setExpandedActivity(expandedActivity === idx ? null : idx)}>
              <div className="act-header">
                <h3 className="act-title">{act.title}</h3>
                <span className="tag" style={{ background: difficultyColor[act.difficulty] + '33', color: difficultyColor[act.difficulty] }}>
                  {act.difficulty}
                </span>
              </div>
              {expandedActivity === idx && (
                <div className="act-details">
                  <div className="act-materials">
                    <strong>🧰 חומרים:</strong>
                    <ul>{act.materials.map((m, i) => <li key={i}>{m}</li>)}</ul>
                  </div>
                  <div className="act-instructions">
                    <strong>📋 הוראות:</strong>
                    <p>{act.instructions}</p>
                  </div>
                  <div className="act-adaptation">
                    <strong>💡 טיפ להתאמה:</strong>
                    <p>{act.adaptationTip}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
