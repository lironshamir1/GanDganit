// One .ics file per timeline date, built ahead of time. "הוסף ליומן" is a plain download link: no server.
const CRLF = "\r\n";

function esc(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

// RFC 5545: lines longer than 75 bytes are folded. Hebrew is 2 bytes a letter, so count bytes, not letters.
function fold(line) {
  const out = [];
  let cur = "";
  let bytes = 0;
  for (const ch of line) {
    const b = Buffer.byteLength(ch);
    if (bytes + b > (out.length ? 74 : 75)) { out.push(cur); cur = ""; bytes = 0; }
    cur += ch;
    bytes += b;
  }
  out.push(cur);
  return out.join(CRLF + " ");
}

const ymd = (d) => d.replace(/-/g, "");
function nextDay(d) {
  const x = new Date(d + "T12:00:00Z");
  x.setUTCDate(x.getUTCDate() + 1);
  return x.toISOString().slice(0, 10);
}

export default class {
  data() {
    return {
      pagination: { data: "pp.events", size: 1, alias: "ev" },
      permalink: (data) => `/${data.ev.folder}/cal/${data.ev.id}.ics`,
      eleventyExcludeFromCollections: true,
    };
  }

  render({ ev, pp }) {
    const summary = ev.exactDate || !ev.whenPlain ? ev.titlePlain : `${ev.titlePlain} (${ev.whenPlain})`;
    const desc = [ev.textPlain, ev.whenPlain && `מתי: ${ev.whenPlain}`].filter(Boolean).join("\n");
    const stamp = pp.buildTime.replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//parents-guide//he",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${ev.folder}-${ev.id}-${ymd(ev.calendarDate)}@parents-guide`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${ymd(ev.calendarDate)}`,
      `DTEND;VALUE=DATE:${ymd(nextDay(ev.calendarDate))}`,
      `SUMMARY:${esc(summary)}`,
      `DESCRIPTION:${esc(desc)}`,
      "TRANSP:TRANSPARENT",
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      `DESCRIPTION:${esc(summary)}`,
      "TRIGGER:-PT15H",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
    ];
    return lines.map(fold).join(CRLF) + CRLF;
  }
}
