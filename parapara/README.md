# פרה פרה — הקוד

אתר סטטי (Eleventy), עברית מימין לשמאל, בלי פריימוורק בצד הלקוח ובלי שרת.
**לעדכון תוכן: `content/README.md`.** אין צורך לגעת בשאר הקבצים.

## פקודות

```bash
npm install
npm start          # פיתוח: http://localhost:8080, עם סימוני [לבדוק] בצהוב
npm run build      # ייצור: _site/, סימוני [לבדוק] מוסתרים
npm test           # בדיקות של טבלת החיפוש ושל התוכן
npm run check      # על _site: רוחב 375, אורך כלים, חיפוש, רשימה, ניקוי, offline (צריך Playwright)
npm run icons      # מייצר את אייקוני ה-PNG מ-src/icons/icon.svg
```

## מבנה

- `content/` — כל התוכן (YAML ו-Markdown). השם מוגדר רק ב-`content/site.yaml`.
- `lib/content.js` — קורא את ארבעת קבצי ה-Markdown של כל מעבר והופך אותם לנתונים.
- `src/` — תבניות (Nunjucks), CSS ו-JS. `src/assets/js/match.js` הוא טבלת החיפוש בצד הלקוח.
- `src/cal.11ty.js` — קובץ `.ics` לכל מועד, נבנה מראש. "הוסף ליומן" הוא קישור להורדה.
- `lib/sw-template.js` — Service Worker. רשימת הקבצים נוצרת בסוף כל בנייה, כך שהאתר כולו עובד בלי אינטרנט אחרי הביקור הראשון.
- `parapara.html` — הטיוטה המקורית, לעיון בלבד. לא חלק מהבנייה.

## חיסיון

- אין טפסים שנשלחים, אין עוגיות, אין אנליטיקה, אין שום בקשה לשרת חיצוני (גם הפונטים מאוחסנים באתר).
- `localStorage` בלבד, תחת מפתחות שמתחילים ב-`parapara:`: המעבר שנבחר, והסימונים ברשימה. "לנקות הכול" מוחק את כולם.
- מה שנכתב בחיפוש לא נשמר: אין לשדה `name`, `autocomplete="off"`, והשדה מתרוקן במעבר עמוד.
- Render שולח Content-Security-Policy שחוסם כל טעינה מבחוץ, ו-`Referrer-Policy: no-referrer` (ראו `render.yaml` בשורש המאגר).

## העלאה ל-Render

השירות `parapara` מוגדר ב-`render.yaml` בשורש המאגר, כאתר סטטי מהתיקייה `parapara/`.
ב-Render: New → Blueprint → בוחרים את המאגר. או: New → Static Site, עם
Root Directory `parapara`, Build Command `npm ci && npm test && npm run build`, Publish Directory `_site`.
