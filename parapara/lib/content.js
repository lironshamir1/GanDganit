// Reads content/ and turns the four Markdown files of each transition into plain data.
// The templates only ever see the objects this file returns.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import matter from "gray-matter";
import yaml from "js-yaml";
import MarkdownIt from "markdown-it";

export const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
export const CONTENT = path.join(ROOT, "content");
export const FILES = ["timeline", "checklist", "tools", "contacts"];
export const isProduction = process.env.PARAPARA_ENV === "production";

const md = new MarkdownIt({ html: false, linkify: false, typographer: false });

// Collected while parsing, reported once by the build.
export const warnings = [];
let todoCount = 0;
export const getTodoCount = () => todoCount;

const TODO_RE = /\[לבדוק(?::\s*([^\]]*))?\]/g;

/** Inline Markdown → HTML, with every [לבדוק] turned into a yellow mark (dev) or removed (production). */
export function inline(text) {
  if (!text) return "";
  let html = md.renderInline(text.trim());
  html = html.replace(TODO_RE, (_, note) => {
    todoCount++;
    if (isProduction) return "";
    return `<span class="todo">לבדוק${note ? ": " + note.trim() : ""}</span>`;
  });
  return html.replace(/\s{2,}/g, " ").replace(/\s+([.,:])/g, "$1").trim();
}

/** Plain text without [לבדוק] marks, for calendar files. */
export function plain(text) {
  return (text || "").replace(TODO_RE, "").replace(/[*_`]/g, "").replace(/\s{2,}/g, " ").trim();
}

export function readYaml(name) {
  return yaml.load(fs.readFileSync(path.join(CONTENT, name), "utf8"));
}

const META_KEYS = { "מתי": "when", "תאריכים": "dates", "תאריך": "dates", "ליומן": "calendar", "טלפון": "phone" };
const META_RE = new RegExp(`^(${Object.keys(META_KEYS).join("|")})\\s*:\\s*(.*)$`);

/**
 * Splits a Markdown body by headings.
 * Returns { lead, groups: [{ label, items: [{ title, text, meta }] }] }.
 * "# x" opens a group (used by tools.md), "## x" opens an item.
 */
function sections(body) {
  const out = { lead: [], groups: [] };
  let group = null;
  let item = null;
  const ensureGroup = () => {
    if (!group) { group = { label: "", items: [] }; out.groups.push(group); }
    return group;
  };
  for (const raw of body.split(/\r?\n/)) {
    const line = raw.trim();
    let m;
    if ((m = line.match(/^#\s+(.+)$/))) {
      group = { label: m[1].trim(), items: [] };
      out.groups.push(group);
      item = null;
    } else if ((m = line.match(/^##\s+(.+)$/))) {
      item = { title: m[1].trim(), text: [], meta: {} };
      ensureGroup().items.push(item);
    } else if (!line) {
      continue;
    } else if (item && (m = line.match(META_RE))) {
      item.meta[META_KEYS[m[1]]] = m[2].trim();
    } else if (item) {
      item.text.push(line);
    } else if (!group || !group.items.length) {
      out.lead.push(line);
    }
  }
  for (const g of out.groups) for (const it of g.items) it.text = it.text.join(" ");
  out.lead = out.lead.join(" ");
  return out;
}

function shortId(s) {
  return crypto.createHash("sha1").update(s).digest("hex").slice(0, 8);
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function parseDates(value, where) {
  if (!value) { warnings.push(`${where}: חסרה שורת "תאריכים:"`); return null; }
  const parts = value.split(/\s*(?:עד|–|—)\s*/).map((s) => s.trim()).filter(Boolean);
  const [from, to = parts[0]] = parts;
  if (!DATE_RE.test(from) || !DATE_RE.test(to)) {
    warnings.push(`${where}: תאריך לא תקין "${value}". הפורמט: 2027-01-01 עד 2027-02-28`);
    return null;
  }
  return { from, to };
}

function load(folder, file) {
  const p = path.join(CONTENT, "transitions", folder, `${file}.md`);
  const { data, content } = matter(fs.readFileSync(p, "utf8"));
  return { data, ...sections(content), where: `transitions/${folder}/${file}.md` };
}

function timeline(folder) {
  const f = load(folder, "timeline");
  const items = f.groups.flatMap((g) => g.items).map((it, i) => {
    const where = `${f.where} (${it.title})`;
    const dates = parseDates(it.meta.dates, where);
    const cal = it.meta.calendar || (dates && dates.from);
    if (it.meta.calendar && !DATE_RE.test(it.meta.calendar)) warnings.push(`${where}: "ליומן:" צריך להיות תאריך אחד, למשל 2027-09-01`);
    return {
      id: `${i + 1}-${shortId(it.title)}`,
      title: inline(it.title),
      titlePlain: plain(it.title),
      when: inline(it.meta.when || ""),
      whenPlain: plain(it.meta.when || ""),
      text: inline(it.text),
      textPlain: plain(it.text),
      from: dates && dates.from,
      to: dates && dates.to,
      calendarDate: cal && DATE_RE.test(cal) ? cal : null,
      exactDate: Boolean(it.meta.calendar),
    };
  });
  return { title: inline(f.data.title || ""), lead: inline(f.lead), items };
}

function checklist(folder) {
  const f = load(folder, "checklist");
  const items = f.groups.flatMap((g) => g.items).map((it) => ({
    id: shortId(it.title),
    title: inline(it.title),
    text: inline(it.text),
  }));
  return {
    title: inline(f.data.title || "הרשימה שלכם"),
    lead: inline(f.lead),
    empty: f.data.empty || "עוד לא סימנתם כלום. זה בסדר, זו ההתחלה.",
    done: f.data.done || "סימנתם הכול.",
    items,
  };
}

// Rough limit for "a tool is at most four lines" at 375px. The mobile check measures the real thing.
const TOOL_CHAR_LIMIT = 190;

function tools(folder) {
  const f = load(folder, "tools");
  const groups = f.groups.filter((g) => g.items.length).map((g, gi) => ({
    key: `g${gi + 1}`,
    label: g.label,
    items: g.items.map((it) => {
      if (plain(it.text).length > TOOL_CHAR_LIMIT) warnings.push(`${f.where} (${it.title}): הכלי ארוך מדי. עד ארבע שורות.`);
      return { title: inline(it.title), text: inline(it.text) };
    }),
  }));
  if (groups.length !== 3) warnings.push(`${f.where}: צריך בדיוק שלוש קבוצות (# עם הילד, # בבית, # בשבילכם). נמצאו ${groups.length}.`);
  return { title: inline(f.data.title || ""), lead: inline(f.lead), groups };
}

function contacts(folder) {
  const f = load(folder, "contacts");
  let items = f.groups.flatMap((g) => g.items);
  if (items.length > 3) {
    warnings.push(`${f.where}: יש ${items.length} כתובות. מותר עד שלוש, מוצגות רק שלוש הראשונות.`);
    items = items.slice(0, 3);
  }
  return {
    title: inline(f.data.title || ""),
    items: items.map((it) => {
      const phone = inline(it.meta.phone || "");
      const digits = plain(it.meta.phone || "").replace(/[\s-]/g, "");
      return {
        title: inline(it.title),
        text: inline(it.text),
        phone,
        tel: /^\+?\d{3,}$/.test(digits) ? digits : null,
      };
    }),
    helpTitle: inline(f.data.help_title || ""),
    helpText: inline(f.data.help_text || ""),
  };
}

/** All transitions in the order of transitions.yaml. `ready` is false when one of the four files is missing. */
export function loadTransitions() {
  warnings.length = 0;
  todoCount = 0;
  const list = readYaml("transitions.yaml");
  return list.map(({ folder, label }) => {
    const dir = path.join(CONTENT, "transitions", folder);
    const present = FILES.filter((f) => fs.existsSync(path.join(dir, `${f}.md`)));
    const ready = present.length === FILES.length;
    if (present.length && !ready) {
      warnings.push(`transitions/${folder}: חסרים קבצים (${FILES.filter((f) => !present.includes(f)).join(", ")}). המעבר מוצג כ"בקרוב".`);
    }
    const t = { folder, label, ready, url: `/${folder}/` };
    if (ready) {
      t.timeline = timeline(folder);
      t.checklist = checklist(folder);
      t.tools = tools(folder);
      t.contacts = contacts(folder);
    }
    return t;
  });
}

/** The search table, validated against the list of transitions. */
export function loadSearch(transitions) {
  const s = readYaml("search.yaml") || {};
  const known = new Set(transitions.map((t) => t.folder));
  const check = (target, where) => { if (!known.has(target)) warnings.push(`search.yaml (${where}): אין מעבר בשם "${target}"`); };
  const ages = Object.entries(s.ages || {}).map(([range, to]) => {
    const [a, b = a] = String(range).split("-").map(Number);
    check(to, `גיל ${range}`);
    return [a, b, to];
  });
  const grades = Object.fromEntries(Object.entries(s.grades || {}).map(([g, to]) => { check(to, `כיתה ${g}`); return [g, to]; }));
  const words = [];
  for (const [to, list] of Object.entries(s.words || {})) {
    check(to, "מילים");
    for (const w of list || []) words.push([String(w), to]);
  }
  return { ages, grades, words };
}
