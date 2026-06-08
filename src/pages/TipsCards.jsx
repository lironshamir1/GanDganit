import './TipsCards.css'

const tips = [
  'ודאו שהילד מצליח לפתוח בעצמו את קופסת האוכל לפני שתשלחו אותה לגן.',
  'היום זו הזדמנות טובה לפגוש חבר מהגן בגן השעשועים.',
  'תנו לילד לבחור לבד את הבגדים להיום — זה בונה עצמאות!',
  'הכינו יחד את התיק לגן הערב — זה מחזק שגרה.',
  'שאלו את הילד "מה היה הדבר הכי כיף היום?" במקום "איך היה בגן?"',
  'תרגלו יחד נעילת נעליים — כל יום קצת, בלי לחץ.',
  'ספרו לילד מה הולך לקרות מחר — זה מפחית חרדה.',
  'היום תנו לילד לעזור לכם במטבח — גם ערבוב בקערה זה הישג!',
  'שימו לב אם הילד מתקשה לשבת בזמן ארוחה — אולי הכיסא לא נוח.',
  'תרגלו יחד שטיפת ידיים עם שיר — הופכים את זה לכיף!',
  'הכינו כרטיס עם סדר היום בתמונות — עוזר לילד להרגיש בטוח.',
  'היום תנו מחמאה ספציפית: "אהבתי איך סידרת את הצעצועים!"',
  'בדקו שיש לילד בגן בגדי חילוף — שקט נפשי לכולם.',
  'תנו לילד 5 דקות התראה לפני מעבר בין פעילויות.',
  'הקדישו 10 דקות משחק אחד-על-אחד עם הילד — בלי טלפון.',
  'תרגלו יחד לומר "בוקר טוב" ו"להתראות" לגננת.',
  'שימו בתיק פתק קטן עם ציור של לב — מפתיע ומחזק.',
  'היום תנו לילד לצאת קצת מוקדם — הגעה רגועה לגן משנה את היום.',
  'תרגלו יחד רוכסן — תפסו את ההתחלה ותנו לילד להמשיך.',
  'ערכו ביחד את "פינת הרגעה" בבית — כריות, ספרים ודובי.',
]

function TipCard({ tip }) {
  return (
    <div className="tip-card">
      <div className="tip-card-inner">
        <span className="tip-card-icon">💡</span>
        <p className="tip-card-label">טיפ יומי</p>
        <p className="tip-card-text">{tip}</p>
        <p className="tip-card-footer">גן דגנית</p>
      </div>
    </div>
  )
}

export default function TipsCards() {
  // Pair tips two per A4 page
  const pages = []
  for (let i = 0; i < tips.length; i += 2) {
    pages.push([tips[i], tips[i + 1]])
  }

  return (
    <div className="tips-root">
      <div className="tips-toolbar">
        <button onClick={() => window.print()} className="tips-print-btn">
          🖨️ הדפס כרטיסי טיפים
        </button>
        <p className="tips-toolbar-hint">
          A4 לאורך · {tips.length} טיפים · 2 בדף · גזרו בקו המקווקו
        </p>
      </div>

      {pages.map((pair, i) => (
        <section key={i} className="tips-page">
          <TipCard tip={pair[0]} />
          <div className="tips-cut-line" aria-hidden>
            <span>✂️ גזרו כאן</span>
          </div>
          {pair[1] && <TipCard tip={pair[1]} />}
        </section>
      ))}
    </div>
  )
}
