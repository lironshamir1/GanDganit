import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { warnings, isProduction, getTodoCount } from "./lib/content.js";

const FONTS = [
  ["heebo", "hebrew", 400], ["heebo", "hebrew", 500], ["heebo", "hebrew", 700],
  ["heebo", "latin", 400], ["heebo", "latin", 500], ["heebo", "latin", 700],
  ["karantina", "hebrew", 700], ["karantina", "latin", 700],
];

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets", "src/icons": "icons" });
  for (const [family, subset, weight] of FONTS) {
    const file = `${family}-${subset}-${weight}-normal.woff2`;
    eleventyConfig.addPassthroughCopy({ [`node_modules/@fontsource/${family}/files/${file}`]: `assets/fonts/${file}` });
  }
  eleventyConfig.addWatchTarget("./content/");
  eleventyConfig.addWatchTarget("./lib/");
  eleventyConfig.addFilter("json", (v) => JSON.stringify(v).replace(/</g, "\\u003c"));

  eleventyConfig.on("eleventy.after", ({ dir }) => {
    for (const w of new Set(warnings)) console.warn(`[תוכן] אזהרה: ${w}`);
    const todos = getTodoCount();
    if (todos) console.warn(`[תוכן] יש ${todos} סימוני [לבדוק]. ${isProduction ? "בגרסת הייצור הם מוסתרים." : "הם מסומנים בצהוב."}`);
    writeServiceWorker(dir.output);
  });

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    templateFormats: ["njk", "11ty.js"],
    htmlTemplateEngine: "njk",
  };
}

/** Lists every built file and writes sw.js, so the whole site works offline after the first visit. */
function writeServiceWorker(out) {
  const files = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name !== "sw.js" && e.name !== "_headers") files.push(p);
    }
  };
  walk(out);
  const hash = crypto.createHash("sha1");
  const urls = files.sort().map((p) => {
    hash.update(p).update(fs.readFileSync(p));
    let u = "/" + path.relative(out, p).split(path.sep).join("/");
    return u.endsWith("/index.html") ? u.slice(0, -"index.html".length) : u;
  });
  const version = hash.digest("hex").slice(0, 10);
  const tpl = fs.readFileSync(new URL("./lib/sw-template.js", import.meta.url), "utf8");
  fs.writeFileSync(path.join(out, "sw.js"), tpl.replace("__VERSION__", version).replace("__FILES__", JSON.stringify(urls, null, 0)));
}
