import './Poster.css'

const modules = [
  { title: 'עדכונים מהגן', icon: '📋', desc: 'הודעות ועדכונים שוטפים', bg: 'linear-gradient(135deg, #E8F5E9, #A8D5BA)' },
  { title: 'רעיונות לפעילויות', icon: '🎨', desc: 'פעילויות מותאמות לילד', bg: 'linear-gradient(135deg, #EDE7F6, #D4C9E8)' },
  { title: 'אימוני שפה', icon: '🗣️', desc: 'תרגילים לפיתוח הדיבור', bg: 'linear-gradient(135deg, #E0F4F4, #D4F5F5)' },
  { title: 'בניית עצמאות', icon: '⭐', desc: 'מדריך שלב אחר שלב', bg: 'linear-gradient(135deg, #FFF3E8, #F8C8A4)' },
  { title: 'הצבת גבולות', icon: '🛡️', desc: 'גבולות באהבה ובעקביות', bg: 'linear-gradient(135deg, #FDEBD0, #F2A07B)' },
  { title: 'שאלות ותשובות', icon: '💬', desc: 'מענה מקצועי להורים', bg: 'linear-gradient(135deg, #E0F4F4, #B5E0E0)' },
  { title: 'לוח משימות', icon: '🏆', desc: 'משימות יומיות ותגמולים', bg: 'linear-gradient(135deg, #FCE4EC, #F5C6D0)' },
  { title: 'רגע של השראה', icon: '✨', desc: 'חיזוק ותמיכה להורים', bg: 'linear-gradient(135deg, #F3E5F5, #D4C9E8)' },
  { title: 'סדר יום', icon: '📅', desc: 'תכנון וניהול היום', bg: 'linear-gradient(135deg, #E0F7FA, #B5E0E0)' },
  { title: 'תזכורות', icon: '🔔', desc: 'תזכורות לטיפולים ומשימות', bg: 'linear-gradient(135deg, #F8E8F8, #E8D0E8)' },
  { title: 'ארגז כלים', icon: '🧰', desc: 'שעון חול, טיימר וקובייה', bg: 'linear-gradient(135deg, #FFF3E0, #FFE0B2)' },
  { title: 'מי אנחנו', icon: '👩‍🏫', desc: 'קצת עלינו ועל הגן', bg: 'linear-gradient(135deg, #FFF5F3, #F4C7BA)' },
]

const APP_URL = 'https://gandganit.onrender.com/'
const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&margin=10&data=${encodeURIComponent(APP_URL)}`

function GirlLogo({ size = 240 }) {
  return (
    <svg viewBox="0 0 120 170" width={size} height={size * 170 / 120}>
      <circle cx="60" cy="36" r="22" fill="#FFF5EE" stroke="#e8907a" strokeWidth="2.5" />
      <circle cx="52" cy="34" r="2.5" fill="#e8907a" />
      <circle cx="68" cy="34" r="2.5" fill="#e8907a" />
      <circle cx="46" cy="40" r="4" fill="#f4a89a" opacity="0.35" />
      <circle cx="74" cy="40" r="4" fill="#f4a89a" opacity="0.35" />
      <path d="M 53,44 Q 60,52 67,44" fill="none" stroke="#e8907a" strokeWidth="2" strokeLinecap="round" />
      <line x1="60" y1="58" x2="60" y2="65" stroke="#e8907a" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 42,68 L 60,65 L 78,68 L 82,105 Q 60,112 38,105 Z" fill="#e8907a" opacity="0.15" stroke="#e8907a" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M 42,72 Q 28,62 22,50" fill="none" stroke="#e8907a" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 20,44 Q 16,38 20,35 Q 24,32 28,35 L 20,44 L 12,35 Q 16,32 20,35" fill="#e8907a" opacity="0.5" stroke="#e8907a" strokeWidth="1.5" />
      <path d="M 78,72 Q 92,82 96,95" fill="none" stroke="#e8907a" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="97" cy="97" r="4" fill="#FFF5EE" stroke="#e8907a" strokeWidth="2" />
      <path d="M 48,105 L 45,145" fill="none" stroke="#e8907a" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="43" cy="148" rx="8" ry="4" fill="#e8907a" opacity="0.3" stroke="#e8907a" strokeWidth="2" />
      <path d="M 72,105 L 75,145" fill="none" stroke="#e8907a" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="77" cy="148" rx="8" ry="4" fill="#e8907a" opacity="0.3" stroke="#e8907a" strokeWidth="2" />
    </svg>
  )
}

export default function Poster() {
  return (
    <div className="poster-root">
      <div className="poster-toolbar">
        <button onClick={() => window.print()} className="poster-print-btn">
          🖨️ הדפס פוסטר A3
        </button>
        <p className="poster-toolbar-hint">
          בהדפסה: בחרו גודל נייר A3, אוריינטציה לאורך, וסמנו "הדפס רקעים / Background graphics"
        </p>
      </div>

      {/* ===== Page 1: Designed Poster ===== */}
      <section className="poster-page poster-designed">
        <div className="poster-deco poster-deco-1" />
        <div className="poster-deco poster-deco-2" />
        <div className="poster-deco poster-deco-3" />

        <header className="poster-header">
          <div className="poster-logo">
            <GirlLogo size={260} />
          </div>
          <h1 className="poster-title">גן דגנית</h1>
          <p className="poster-subtitle">האפליקציה שמלווה את הגן והבית</p>
        </header>

        <div className="poster-intro">
          <p>
            הורים יקרים, שמחים להציג את האתר החדש של גן דגנית!
            <br />
            עדכונים, מידע ותכנים שיחזקו את הקשר בין הגן לבית —
            <br />
            כי החיבור והתיאום בינינו הם הכוח שמניע את הילדים שלנו קדימה.
          </p>
        </div>

        <div className="poster-modules-grid">
          {modules.map((mod) => (
            <div key={mod.title} className="poster-module-card" style={{ background: mod.bg }}>
              <div className="poster-module-icon">{mod.icon}</div>
              <div className="poster-module-title">{mod.title}</div>
              <div className="poster-module-desc">{mod.desc}</div>
            </div>
          ))}
        </div>

        <footer className="poster-footer">
          <div className="poster-qr-block">
            <img src={QR_URL} alt="QR code לאפליקציה" className="poster-qr" />
            <p className="poster-qr-label">סרקו והיכנסו</p>
          </div>
          <div className="poster-url-block">
            <p className="poster-url-label">או היכנסו בכתובת:</p>
            <p className="poster-url">gandganit.onrender.com</p>
            <p className="poster-tagline">✨ הכל במקום אחד · נגיש מכל מכשיר ✨</p>
          </div>
        </footer>
      </section>

      {/* ===== Page 2: Enlarged Home ===== */}
      <section className="poster-page poster-home-replica">
        <div className="poster-home-frame">
          <header className="poster-home-header">
            <h1 className="poster-home-title">בוקר טוב, גן דגנית</h1>
          </header>

          <div className="poster-home-tip">
            <span className="poster-home-tip-icon">💡</span>
            <p className="poster-home-tip-label">טיפ יומי</p>
            <p className="poster-home-tip-text">
              תנו לילד לבחור לבד את הבגדים להיום — זה בונה עצמאות!
            </p>
          </div>

          <div className="poster-home-grid">
            {modules.map((mod) => (
              <div key={mod.title} className="poster-home-card">
                <div className="poster-home-icon-wrap" style={{ background: mod.bg }}>
                  <span className="poster-home-icon">{mod.icon}</span>
                </div>
                <h3 className="poster-home-card-title">{mod.title}</h3>
                <p className="poster-home-card-desc">{mod.desc}</p>
              </div>
            ))}
          </div>

          <div className="poster-home-footer">
            <img src={QR_URL} alt="QR" className="poster-home-qr" />
            <div>
              <p className="poster-home-url">gandganit.onrender.com</p>
              <p className="poster-home-tagline">סרקו והיכנסו לאפליקציה</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
