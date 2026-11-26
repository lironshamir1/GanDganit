/* האם להציג את ההזמנה הקופצת: יש תמונה, והיום (לפי השעון המקומי)
   עוד לא עבר את until ('YYYY-MM-DD', כולל היום עצמו) */
export function isHomePopupActive(popup) {
  if (!popup?.src) return false
  if (!popup.until) return true
  const [y, m, d] = String(popup.until).split('-').map(Number)
  const endOfDay = new Date(y, (m || 1) - 1, d || 1, 23, 59, 59, 999)
  return new Date() <= endOfDay
}
