import { useState } from 'react'
import { qaCategories } from '../data/qaData'
import './QandA.css'

const QUESTIONS_KEY = 'gandganit-parent-questions'

function loadParentQuestions() {
  try {
    const saved = localStorage.getItem(QUESTIONS_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return []
}

export default function QandA() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [expandedQ, setExpandedQ] = useState(null)
  const [showAskForm, setShowAskForm] = useState(false)
  const [parentQuestions, setParentQuestions] = useState(loadParentQuestions)
  const [newQuestion, setNewQuestion] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const submitQuestion = () => {
    if (!newQuestion.trim()) return
    const updated = [...parentQuestions, { text: newQuestion.trim(), date: new Date().toLocaleDateString('he-IL') }]
    setParentQuestions(updated)
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(updated))
    setNewQuestion('')
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const deleteQuestion = (idx) => {
    const updated = parentQuestions.filter((_, i) => i !== idx)
    setParentQuestions(updated)
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(updated))
  }

  return (
    <div className="page">
      <h1 className="page-title">💬 שאלות ותשובות</h1>

      {!selectedCategory ? (
        <>
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

          <div className="qa-ask-section">
            {!showAskForm ? (
              <button className="btn btn-primary qa-ask-btn" onClick={() => setShowAskForm(true)}>
                ✍️ יש לי שאלה!
              </button>
            ) : (
              <div className="card qa-ask-form">
                <h3 className="qa-ask-title">שאלו אותנו</h3>
                <p className="qa-ask-desc">כתבו את השאלה שלכם ונחזור אליכם עם תשובה</p>
                <textarea
                  className="input-field qa-ask-input"
                  placeholder="כתבו כאן את השאלה שלכם..."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  rows={3}
                />
                {submitted && (
                  <div className="qa-ask-success">השאלה נשלחה בהצלחה! נחזור אליכם בהקדם 💜</div>
                )}
                <div className="qa-ask-actions">
                  <button className="btn btn-primary" onClick={submitQuestion}>שליחה</button>
                  <button className="btn btn-secondary" onClick={() => setShowAskForm(false)}>ביטול</button>
                </div>
              </div>
            )}
          </div>

          {parentQuestions.length > 0 && (
            <div className="qa-parent-questions">
              <h3 className="qa-pq-title">השאלות שלכם</h3>
              {parentQuestions.map((pq, idx) => (
                <div key={idx} className="card qa-pq-item">
                  <div className="qa-pq-content">
                    <p className="qa-pq-text">{pq.text}</p>
                    <span className="qa-pq-date">{pq.date}</span>
                  </div>
                  <button className="qa-pq-delete" onClick={() => deleteQuestion(idx)}>🗑️</button>
                </div>
              ))}
            </div>
          )}
        </>
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
