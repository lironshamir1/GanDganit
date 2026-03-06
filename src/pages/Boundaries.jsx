import { useState } from 'react'
import { boundariesContent } from '../data/boundariesData'
import './Boundaries.css'

export default function Boundaries() {
  const [activeTab, setActiveTab] = useState('why')
  const { whyImportant, phrases, scenarios } = boundariesContent

  return (
    <div className="page">
      <h1 className="page-title">🛡️ הגבולות שלנו</h1>

      <div className="bnd-tabs">
        <button className={`bnd-tab ${activeTab === 'why' ? 'active' : ''}`} onClick={() => setActiveTab('why')}>
          למה?
        </button>
        <button className={`bnd-tab ${activeTab === 'phrases' ? 'active' : ''}`} onClick={() => setActiveTab('phrases')}>
          משפטים
        </button>
        <button className={`bnd-tab ${activeTab === 'scenarios' ? 'active' : ''}`} onClick={() => setActiveTab('scenarios')}>
          תרחישים
        </button>
      </div>

      {activeTab === 'why' && (
        <div className="card">
          <h2 className="bnd-section-title">{whyImportant.title}</h2>
          <ul className="bnd-points">
            {whyImportant.points.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'phrases' && (
        <div>
          <h3 className="bnd-sub-title">✅ כן — ככה אומרים</h3>
          {phrases.filter(p => p.type === 'do').map((p, idx) => (
            <div key={idx} className="card bnd-phrase bnd-do">
              <p className="bnd-phrase-text">"{p.text}"</p>
              <p className="bnd-phrase-context">{p.context}</p>
            </div>
          ))}
          <h3 className="bnd-sub-title" style={{ marginTop: 20 }}>❌ לא — נמנעים מלומר</h3>
          {phrases.filter(p => p.type === 'dont').map((p, idx) => (
            <div key={idx} className="card bnd-phrase bnd-dont">
              <p className="bnd-phrase-text">"{p.text}"</p>
              <p className="bnd-phrase-context">{p.context}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'scenarios' && (
        <div>
          {scenarios.map((s, idx) => (
            <div key={idx} className="card bnd-scenario">
              <h3 className="bnd-scenario-title">📌 {s.situation}</h3>
              <p className="bnd-scenario-response">{s.response}</p>
              <div className="bnd-key-point">
                <strong>🔑 נקודה מרכזית:</strong> {s.keyPoint}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
