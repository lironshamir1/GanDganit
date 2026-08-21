import { useEffect, useMemo, useState } from 'react'
import { seasonalContent } from '../data/seasonalContent'
import './NowAtGan.css'

const STORAGE_KEY = 'gandganit-now-checked'

const WEEKDAYS = ['יום ראשון', 'יום שני', 'יום שלישי', 'יום רביעי', 'יום חמישי', 'יום שישי', 'שבת']

/* ממיר 'YYYY-MM-DD' לתאריך מקומי (בלי הפתעות של אזור זמן) */
function parseDate(iso) {
  const [year, month, day] = String(iso).split('-').map(Number)
  return new Date(year, (month || 1) - 1, day || 1)
}

function toKey(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function shortDate(date) {
  return `${date.getDate()}/${date.getMonth() + 1}`
}

function loadChecked(version) {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (!saved) return []
    // תמיכה בפורמט ישן (מערך פשוט) וגם בפורמט עם גרסת תוכן
    if (Array.isArray(saved)) return saved
    if (saved.version && saved.version !== version) return []
    return Array.isArray(saved.days) ? saved.days : []
  } catch {
    return []
  }
}

export default function NowAtGan() {
  const { badge, title, subtitle, intro, guideTitle, guide, countdown, contentVersion } = seasonalContent

  const [checked, setChecked] = useState(() => loadChecked(contentVersion))

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: contentVersion, days: checked }))
    } catch {
      /* אם אין גישה ל-localStorage פשוט לא שומרים */
    }
  }, [checked, contentVersion])

  const today = useMemo(() => toKey(new Date()), [])

  const days = useMemo(
    () =>
      (countdown?.days || []).map((day) => {
        const date = parseDate(day.date)
        return {
          ...day,
          label: shortDate(date),
          weekday: WEEKDAYS[date.getDay()],
          isToday: day.date === today,
        }
      }),
    [countdown, today]
  )

  const doneCount = days.filter((day) => checked.includes(day.date)).length
  const progress = days.length ? Math.round((doneCount / days.length) * 100) : 0

  const toggleDay = (dateKey) => {
    setChecked((prev) =>
      prev.includes(dateKey) ? prev.filter((item) => item !== dateKey) : [...prev, dateKey]
    )
  }

  return (
    <div className="page now-page">
      <header className="now-hero">
        {badge && <span className="now-badge">{badge}</span>}
        <h1 className="page-title now-title">{title}</h1>
        {subtitle && <p className="now-subtitle">{subtitle}</p>}
      </header>

      <section className="now-section">
        <h2 className="now-section-title">💛 {guideTitle}</h2>
        {intro && <p className="now-intro card">{intro}</p>}

        {guide.map((topic) => (
          <article key={topic.id} className="card now-topic" style={{ '--topic-color': topic.color }}>
            <div className="now-topic-header">
              <span className="now-topic-icon" style={{ background: topic.bg }}>
                {topic.icon}
              </span>
              <h3 className="now-topic-title">{topic.title}</h3>
            </div>
            <ul className="now-topic-list">
              {topic.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      {countdown && days.length > 0 && (
        <section className="now-section">
          <h2 className="now-section-title">🗓️ {countdown.title}</h2>
          {countdown.hint && <p className="now-hint">{countdown.hint}</p>}

          <div className="now-progress card">
            <div className="now-progress-top">
              <span className="now-progress-text">
                {doneCount} מתוך {days.length} ימים סומנו
              </span>
              <button className="now-reset-btn" onClick={() => setChecked([])}>
                ↺ אפס סימונים
              </button>
            </div>
            <div className="now-progress-bar">
              <div className="now-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <ol className="now-days">
            {days.map((day) => {
              const isChecked = checked.includes(day.date)
              return (
                <li key={day.date}>
                  <button
                    type="button"
                    aria-pressed={isChecked}
                    className={`now-day card card-clickable${isChecked ? ' is-done' : ''}${
                      day.highlight ? ' is-highlight' : ''
                    }${day.isBigDay ? ' is-bigday' : ''}${day.isToday ? ' is-today' : ''}`}
                    onClick={() => toggleDay(day.date)}
                  >
                    <span className="now-day-date">
                      <span className="now-day-num">{day.label}</span>
                      <span className="now-day-weekday">{day.weekday}</span>
                    </span>

                    <span className="now-day-body">
                      <span className="now-day-task">
                        <span className="now-day-icon">{day.icon}</span>
                        {day.task}
                      </span>
                      {day.note && <span className="now-day-note">📣 {day.note}</span>}
                      {day.isToday && <span className="now-day-today">היום</span>}
                    </span>

                    <span className={`now-day-check${isChecked ? ' checked' : ''}`}>
                      {isChecked ? '✓' : ''}
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        </section>
      )}
    </div>
  )
}
