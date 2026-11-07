// Opens the built site (_site) at 375px wide and checks the things that matter on a phone.
// Usage: npm run build && npm run check [-- <folder for screenshots>]
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const SITE = path.resolve("_site");
// Run under the same Content-Security-Policy that Render sends (from ../render.yaml).
const yaml = require("js-yaml");
const service = yaml.load(fs.readFileSync("../render.yaml", "utf8")).services.find((s) => s.rootDir === "parapara");
const CSP = service.headers.find((h) => h.name === "Content-Security-Policy").value;
const SHOTS = process.argv[2];
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".ics": "text/calendar; charset=utf-8", ".webmanifest": "application/manifest+json" };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  const file = path.join(SITE, p);
  if (!file.startsWith(SITE) || !fs.existsSync(file)) { res.writeHead(404); return res.end(fs.readFileSync(path.join(SITE, "404.html"))); }
  res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream", "content-security-policy": CSP });
  res.end(fs.readFileSync(file));
});
await new Promise((r) => server.listen(0, r));
const BASE = `http://localhost:${server.address().port}`;

let failed = 0;
const ok = (cond, msg) => { console.log(`${cond ? "✓" : "✗"} ${msg}`); if (!cond) failed++; };

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: SHOTS ? 2 : 1, locale: "he-IL" });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => { if (m.type() === "error" && !m.text().includes("status of 404")) errors.push(m.text()); });

async function noOverflow(label) {
  const w = await page.evaluate(() => document.documentElement.scrollWidth);
  ok(w <= 375, `${label}: no sideways scroll at 375px (width ${w})`);
}

// Home
await page.goto(`${BASE}/`);
await noOverflow("home");
ok(await page.locator(".chip.soon").count() === 5, "home: five transitions show as 'soon'");
ok(await page.locator("a.chip").count() === 1, "home: one clickable transition");
if (SHOTS) await page.screenshot({ path: `${SHOTS}/home-375.png`, fullPage: true });

// Search: no match, then a match
await page.fill("#q", "בא לי פיצה");
await page.press("#q", "Enter");
ok((await page.textContent("#result")).includes("לא מצאנו"), "search: unknown text gets a gentle 'not found'");
await page.fill("#q", "כיתה ו");
await page.press("#q", "Enter");
ok((await page.textContent("#result")).includes("לחטיבה"), "search: 'כיתה ו' points to חטיבה (soon)");
await page.fill("#q", "5");
await Promise.all([page.waitForURL(`${BASE}/aleph/`), page.press("#q", "Enter")]);
ok(true, "search: '5' opens כיתה א'");
const stored = await page.evaluate(() => JSON.stringify(localStorage));
ok(!stored.includes("פיצה") && !stored.includes('"5"') && !stored.includes("כיתה ו"), "search: typed text is not in localStorage");

// Transition page
await noOverflow("aleph");
ok(await page.locator(".tl li.now .here").first().textContent() === "אנחנו כאן", "timeline: 'אנחנו כאן' is shown (device date)");
ok(await page.locator(".cal").count() === 5, "timeline: 'הוסף ליומן' next to every date");
const ics = await page.request.get(`${BASE}${await page.locator(".cal").first().getAttribute("href")}`);
ok((await ics.text()).startsWith("BEGIN:VCALENDAR"), "calendar: the .ics file downloads");

// Tools: every tool at most four lines
const tooLong = await page.evaluate(() => {
  const out = [];
  document.querySelectorAll(".tools").forEach((panel) => {
    const hidden = panel.hidden; panel.hidden = false;
    panel.querySelectorAll(".tool p").forEach((p) => {
      const lh = parseFloat(getComputedStyle(p).lineHeight);
      const lines = Math.round(p.getBoundingClientRect().height / lh);
      if (lines > 4) out.push(`${p.previousElementSibling.textContent} (${lines})`);
    });
    panel.hidden = hidden;
  });
  return out;
});
ok(tooLong.length === 0, `tools: all at most four lines at 375px${tooLong.length ? " — too long: " + tooLong.join(", ") : ""}`);

// Tabs
await page.click('.tab:has-text("בשבילכם")');
ok(await page.locator('.tools[data-g="g3"]').isVisible() && !(await page.locator('.tools[data-g="g1"]').isVisible()), "tools: tabs switch");

// Checklist persists
await page.locator("#checks .check").nth(0).click();
await page.locator("#checks .check").nth(2).click();
ok((await page.textContent("#progress")).includes("2 מתוך 7"), "checklist: progress counts");
if (SHOTS) await page.screenshot({ path: `${SHOTS}/aleph-375.png`, fullPage: true });
await page.reload();
ok((await page.textContent("#progress")).includes("2 מתוך 7"), "checklist: marks survive a reload");

// Next visit to home opens the saved transition
await page.goto(`${BASE}/`);
ok(page.url() === `${BASE}/aleph/`, "home: opens the saved transition next time");
await page.goto(`${BASE}/?choose=1`);
ok(page.url().endsWith("/?choose=1") && await page.locator('.chip.is-on[data-folder="aleph"]').count() === 1, "home: '?choose=1' lets you change, current one highlighted");

// Clear everything
await page.goto(`${BASE}/aleph/`);
page.once("dialog", (d) => d.accept());
await page.click("#clear-all");
ok(await page.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith("parapara:")).length) === 0, "clear: nothing left in localStorage");
ok((await page.textContent("#progress")).includes("עוד לא סימנתם"), "clear: checklist is empty again");

// 404
await page.goto(`${BASE}/nope/`);
await noOverflow("404");

// Offline (production build only)
if (await page.evaluate(() => document.documentElement.dataset.env) === "production") {
  await page.goto(`${BASE}/aleph/`);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await ctx.setOffline(true);
  await page.goto(`${BASE}/`);
  ok(await page.locator(".brand").count() === 1, "offline: the site opens without internet after the first visit");
  await page.goto(`${BASE}/aleph/`);
  ok(await page.locator("#checks").count() === 1, "offline: transition page works too");
  await ctx.setOffline(false);
} else {
  console.log("· offline check skipped (dev build has no service worker)");
}

ok(errors.length === 0, `no script errors${errors.length ? ": " + errors.join(" | ") : ""}`);
await browser.close();
server.close();
console.log(failed ? `\n${failed} check(s) failed` : "\nall checks passed");
process.exit(failed ? 1 : 0);
