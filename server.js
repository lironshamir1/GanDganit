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

הנחיות:
- דבר בעברית מקצועית אך חמה ונגישה
- אל תבקש מידע מזהה על הילד (שם, ת.ז., כתובת)
- התמקד בתוכן המקצועי: רמת התפקוד, מטרות מותאמות, יעדים מדידים
- שאל שאלות ממוקדות שעוזרות לדייק את המטרה
- הצע ניסוחים מקצועיים מדויקים כשמתאים
- חשוב על ריאליסטיות המטרה ביחס לגיל ולרמת התפקוד
- תשובות קצרות וממוקדות — 2-4 משפטים בדרך כלל
- כשאת/ה מציע/ה ניסוח מדויק למטרה, הדגש אותו בין גרשיים כך: "הניסוח המוצע"`;

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

  try {
    const response = await fetch('https://www.genspark.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gemini-2.0-flash',
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
