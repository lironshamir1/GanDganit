import { useState } from 'react'
import { qaCategories } from '../data/qaData'
import './QandA.css'

export default function QandA() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [expandedQ, setExpandedQ] = useState(null)

  return (
    <div className="page">
      <h1 className="page-title">💬 שאלו אותנו</h1>

      {!selectedCategory ? (
        <div className="qa-categories">
          {qaCategories.map((cat) => (
            <button
              key={cat.id}
              className="qa-cat-btn"
              style={{ borderRight: `4px solid ${cat.color}` }}
              onClick={() => setSelectedCategory(cat)}
            >
              <span className="emoji-icon">{cat.icon}</span>
              <span className="qa-cat-title">{cat.title}</span>
              <span className="qa-cat-count">{cat.questions.length} שאלות</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="qa-questions">
          <button className="back-btn" onClick={() => { setSelectedCategory(null); setExpandedQ(null) }}>
            → חזרה לקטגוריות
          </button>
          <h2 className="qa-section-title">
            {selectedCategory.icon} {selectedCategory.title}
          </h2>
          {selectedCategory.questions.map((q, idx) => (
            <div key={idx} className="qa-item card" onClick={() => setExpandedQ(expandedQ === idx ? null : idx)}>
              <div className="qa-question">
                <span className="qa-q-text">{q.q}</span>
                <span className="qa-toggle">{expandedQ === idx ? '▲' : '▼'}</span>
              </div>
              {expandedQ === idx && (
                <div className="qa-answer">
                  <p className="qa-explanation">{q.answer}</p>
                  <div className="qa-tip">
                    <strong>💡 טיפ מעשי:</strong> {q.tip}
                  </div>
                  <div className="qa-encouragement">
                    🌟 {q.encouragement}
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
