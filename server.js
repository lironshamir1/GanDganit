import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(join(__dirname, 'dist')));

const SYSTEM_PROMPT = `אתה יועץ מומחה בחינוך מיוחד לגיל הרך, עם התמחות בכתיבת תכניות לימודים אישיות (תל"א).
אתה עוזר לצוות רב-מקצועי של גן חינוך מיוחד לדייק ולשפר מטרות ויעדים עבור ילדים עם עיכובים התפתחותיים.

עיקרון מרכזי — גישה ממוקדת-חוזקות:
כתיבת מטרות ויעדים איכותית בנויה על שימוש במוקדי החוזק הקיימים בילד כדרך לקדם את מוקדי החיזוק.
החוזקות לא נכנסות לניסוח המטרה — הן מנחות את שיטות העבודה ביעדים.

ניסוח המטרה: קצר, ממוקד, מתאר רק מה הילד צריך לפתח (ללא ציון החוזקות).
  דוגמה טובה: "שיפור מיון וזיהוי צורות"
  דוגמה פחות טובה: "תוך שימוש בזיהוי צבעים, שיפור מיון צורות" — ארוכה מדי.

ניסוח היעדים ושיטות העבודה: כאן מיישמים את הגישה ממוקדת-החוזקות —
  כיצד נשתמש ביכולות הקיימות כדי לקדם את המטרה.

הנחיות:
- דבר בעברית מקצועית אך חמה ונגישה
- אל תבקש מידע מזהה על הילד (שם, ת.ז., כתובת)
- שאל שאלות שמסייעות לדייק את תחום הקושי ואת רמת הפער הנוכחי
- בשיטות העבודה ביעדים — שלב את החוזקות כנקודת מוצא
- חשוב על ריאליסטיות המטרה ביחס לגיל ולרמת התפקוד
- תשובות קצרות וממוקדות — 2-4 משפטים בדרך כלל
- כשהגעת לניסוח סופי מוסכם למטרה, כתוב אותו בשורה נפרדת בפורמט הבא בדיוק:
[מטרה: הניסוח המוצע]
  לדוגמה: [מטרה: תוך שימוש ביכולת זיהוי הצבעים הקיימת, הרחבת מיומנויות המיון וזיהוי הצורות]
  השתמש בפורמט זה רק כשהגעת לניסוח סופי מוסכם — לא בכל שאלה.

- לאחר הצעת המטרה הסופית, הצע 3-5 יעדים מדידים. כתוב אותם בפורמט הבא בדיוק (לאחר גוש [מטרה:]):
[יעדים:
יעד 1: תיאור היעד המדיד הראשון
מדד: קריטריון מדיד להצלחה (כמות, תדירות, אחוז)
שיטות: דרכי עבודה מומלצות
זמן: לוח זמנים מוצע
---
יעד 2: תיאור היעד השני
מדד: קריטריון מדיד
שיטות: דרכי עבודה
זמן: לוח זמנים
]
  השתמש בפורמט זה כשמציעים יעדים — זה מאפשר למערכת לאכלס אותם אוטומטית.`;

app.post('/api/chat', async (req, res) => {
  const apiKey = process.env.GSK_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'מפתח API לא הוגדר. יש להגדיר GSK_API_KEY בהגדרות Render.' });
  }

  const { messages, domain, goalText, childAge, notes } = req.body;

  const contextBlock = `\nהקשר נוכחי:
- תחום תפקוד: ${domain || 'לא צוין'}
- מטרה שנבחרה: ${goalText || 'לא צוינה'}
- גיל הילד: ${childAge || 'לא צוין'}
- נקודות חוזק שצוינו: ${notes?.strengths || 'לא צוינו'}
- נקודות לחיזוק שצוינו: ${notes?.toStrengthen || 'לא צוינו'}`;

  const chatMessages = [
    { role: 'system', content: SYSTEM_PROMPT + contextBlock },
    ...messages.map(m => ({ role: m.role, content: m.content })),
  ];

  const model = process.env.GSK_MODEL || 'claude-haiku-4-5';

  try {
    const response = await fetch('https://www.genspark.ai/api/llm_proxy/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: chatMessages,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('Genspark API error:', response.status, errBody);
      return res.status(500).json({ error: 'שגיאה בתקשורת. נסו שוב.' });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';

    res.json({ content: text });
  } catch (err) {
    console.error('Genspark API error:', err.message);
    res.status(500).json({ error: 'שגיאה בתקשורת. נסו שוב.' });
  }
});

app.get('/{*splat}', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server on port ${port}`));
