import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(join(__dirname, 'dist')));

app.post('/api/chat', async (req, res) => {
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'מפתח API לא הוגדר. יש להגדיר ANTHROPIC_API_KEY בהגדרות Render.' });
  }

  const { messages, domain, goalText, childAge, notes } = req.body;

  const systemPrompt = `אתה יועץ מומחה בחינוך מיוחד לגיל הרך, עם התמחות בכתיבת תכניות לימודים אישיות (תל"א).
אתה עוזר לצוות רב-מקצועי של גן חינוך מיוחד לדייק ולשפר מטרות ויעדים עבור ילדים עם עיכובים התפתחותיים.

הנחיות:
- דבר בעברית מקצועית אך חמה ונגישה
- אל תבקש מידע מזהה על הילד (שם, ת.ז., כתובת)
- התמקד בתוכן המקצועי: רמת התפקוד, מטרות מותאמות, יעדים מדידים
- שאל שאלות ממוקדות שעוזרות לדייק את המטרה
- הצע ניסוחים מקצועיים מדויקים כשמתאים
- חשוב על ריאליסטיות המטרה ביחס לגיל ולרמת התפקוד
- תשובות קצרות וממוקדות — 2-4 משפטים בדרך כלל
- כשאת/ה מציע/ה ניסוח מדויק למטרה, הדגש אותו בין גרשיים כך: "הניסוח המוצע"

הקשר נוכחי:
- תחום תפקוד: ${domain || 'לא צוין'}
- מטרה שנבחרה: ${goalText || 'לא צוינה'}
- גיל הילד: ${childAge || 'לא צוין'}
- נקודות חוזק שצוינו: ${notes?.strengths || 'לא צוינו'}
- נקודות לחיזוק שצוינו: ${notes?.toStrengthen || 'לא צוינו'}`;

  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      system: systemPrompt,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    });
    res.json({ content: response.content[0].text });
  } catch (err) {
    console.error('Anthropic API error:', err.message);
    res.status(500).json({ error: 'שגיאה בתקשורת. נסו שוב.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server on port ${port}`));
