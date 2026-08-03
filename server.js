import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
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
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'מפתח API לא הוגדר. יש להגדיר GEMINI_API_KEY בהגדרות Render.' });
  }

  const { messages, domain, goalText, childAge, notes } = req.body;

  const contextBlock = `\nהקשר נוכחי:
- תחום תפקוד: ${domain || 'לא צוין'}
- מטרה שנבחרה: ${goalText || 'לא צוינה'}
- גיל הילד: ${childAge || 'לא צוין'}
- נקודות חוזק שצוינו: ${notes?.strengths || 'לא צוינו'}
- נקודות לחיזוק שצוינו: ${notes?.toStrengthen || 'לא צוינו'}`;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: SYSTEM_PROMPT + contextBlock,
    });

    const chat = model.startChat({
      history: messages.slice(0, -1).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
    });

    const lastMsg = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMsg.content);
    const text = result.response.text();

    res.json({ content: text });
  } catch (err) {
    console.error('Gemini API error:', err.message);
    res.status(500).json({ error: 'שגיאה בתקשורת. נסו שוב.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server on port ${port}`));
