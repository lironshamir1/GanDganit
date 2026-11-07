// Draws the PNG icons from src/icons/icon.svg. Run once after changing the icon: npm run icons
// Uses the Playwright + Chromium that are installed on the machine.
import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const svg = fs.readFileSync(new URL("../src/icons/icon.svg", import.meta.url), "utf8");
// Maskable icons get cropped to a circle: keep the drawing inside the middle 80%.
const maskable = svg
  .replace('rx="112"', 'rx="0"')
  .replace(/<path/, '<g transform="translate(51.2 51.2) scale(.8)"><path')
  .replace("</svg>", "</g></svg>");

const jobs = [
  ["icon-192.png", 192, svg],
  ["icon-512.png", 512, svg],
  ["icon-maskable-512.png", 512, maskable],
  ["apple-touch-icon.png", 180, maskable], // iOS rounds the corners itself
];

const browser = await chromium.launch();
const page = await browser.newPage();
for (const [name, size, src] of jobs) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${src}`);
  await page.locator("svg").screenshot({ path: new URL(`../src/icons/${name}`, import.meta.url).pathname, omitBackground: true });
  console.log("wrote", name);
}
await browser.close();
