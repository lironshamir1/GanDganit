import { useState } from 'react'
import { independenceSkills } from '../data/independenceData'
import './Independence.css'

export default function Independence() {
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [checkedSteps, setCheckedSteps] = useState({})

  const toggleStep = (skillId, stepIdx) => {
    setCheckedSteps(prev => {
      const key = `${skillId}-${stepIdx}`
      return { ...prev, [key]: !prev[key] }
    })
  }

  const getProgress = (skill) => {
    const checked = skill.steps.filter((_, idx) => checkedSteps[`${skill.id}-${idx}`]).length
    return Math.round((checked / skill.steps.length) * 100)
  }

  return (
    <div className="page">
      <h1 className="page-title">⭐ בניית עצמאות</h1>

      {!selectedSkill ? (
        <div className="ind-skills">
          {independenceSkills.map((skill) => (
            <button
              key={skill.id}
              className="ind-skill-card card"
              onClick={() => setSelectedSkill(skill)}
            >
              <div className="ind-skill-header">
                <span className="emoji-icon">{skill.icon}</span>
                <div className="ind-skill-info">
                  <h3>{skill.title}</h3>
                  <span className="ind-step-count">{skill.steps.length} שלבים</span>
                </div>
              </div>
              <div className="ind-progress-bar">
                <div
                  className="ind-progress-fill"
                  style={{ width: `${getProgress(skill)}%`, background: skill.color }}
                />
              </div>
              <span className="ind-progress-text">{getProgress(skill)}%</span>
            </button>
          ))}
        </div>
      ) : (
        <div>
          <button className="back-btn" onClick={() => setSelectedSkill(null)}>
            → חזרה למיומנויות
          </button>
          <h2 className="qa-section-title">
            {selectedSkill.icon} {selectedSkill.title}
          </h2>
          <div className="ind-steps">
            {selectedSkill.steps.map((step, idx) => {
              const isChecked = checkedSteps[`${selectedSkill.id}-${idx}`]
              return (
                <div
                  key={idx}
                  className={`ind-step card ${isChecked ? 'ind-step-done' : ''}`}
                  onClick={() => toggleStep(selectedSkill.id, idx)}
                >
                  <div className={`ind-checkbox ${isChecked ? 'checked' : ''}`}>
                    {isChecked ? '✓' : ''}
                  </div>
                  <span className={`ind-step-text ${isChecked ? 'done' : ''}`}>
                    {step.text}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="ind-tip card">
            <strong>💡 טיפ:</strong> {selectedSkill.tips}
          </div>
        </div>
      )}
    </div>
  )
}
