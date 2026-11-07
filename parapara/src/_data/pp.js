// Everything the templates need, read from content/.
import { execSync } from "node:child_process";
import { readYaml, loadTransitions, loadSearch, isProduction, getTodoCount, ROOT } from "../../lib/content.js";

function lastUpdated() {
  let d = new Date();
  try {
    const out = execSync("git log -1 --format=%cI -- content", { cwd: ROOT, stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
    if (out) d = new Date(out);
  } catch { /* no git: use the build date */ }
  return new Intl.DateTimeFormat("he-IL", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jerusalem" }).format(d);
}

export default function () {
  const site = readYaml("site.yaml");
  const transitions = loadTransitions();
  const search = loadSearch(transitions);
  return {
    site,
    isProduction,
    transitions,
    ready: transitions.filter((t) => t.ready),
    readyFolders: transitions.filter((t) => t.ready).map((t) => t.folder),
    search,
    events: transitions.filter((t) => t.ready).flatMap((t) =>
      t.timeline.items.filter((it) => it.calendarDate).map((it) => ({ folder: t.folder, ...it }))),
    labels: Object.fromEntries(transitions.map((t) => [t.folder, { label: t.label, ready: t.ready, url: t.url }])),
    updated: lastUpdated(),
    todoCount: getTodoCount(),
    buildTime: new Date().toISOString(),
  };
}
