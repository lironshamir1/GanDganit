import { test } from "node:test";
import assert from "node:assert/strict";
import "../src/assets/js/match.js";
import { loadTransitions, loadSearch } from "../lib/content.js";

const table = loadSearch(loadTransitions());
const m = (q) => globalThis.PPMatch.match(q, table);

test("ages", () => {
  assert.equal(m("5"), "aleph");
  assert.equal(m("6"), "aleph");
  assert.equal(m("בן 5"), "aleph");
  assert.equal(m("גיל 5 וחצי"), "aleph");
  assert.equal(m("11"), "middle");
  assert.equal(m("12"), "middle");
  assert.equal(m("3"), "diagnosis");
  assert.equal(m("14"), "high");
  assert.equal(m("18"), "graduation");
  assert.equal(m("40"), null);
});

test("grades, with or without geresh", () => {
  assert.equal(m("כיתה ו"), "middle");
  assert.equal(m("כיתה ו'"), "middle");
  assert.equal(m("כיתה ו׳"), "middle");
  assert.equal(m("ו"), "middle");
  assert.equal(m("כיתה 6"), "middle");
  assert.equal(m("גן"), "aleph");
  assert.equal(m("כיתה א"), "aleph");
  assert.equal(m("ט"), "high");
  assert.equal(m("י״ב"), "graduation");
  assert.equal(m("כיתה ג"), "between");
});

test("words", () => {
  assert.equal(m("אבחון"), "diagnosis");
  assert.equal(m("אבח"), "diagnosis");
  assert.equal(m("גן חובה"), "aleph");
  assert.equal(m("חטיבה"), "middle");
  assert.equal(m("חטיבה עליונה"), "high");
  assert.equal(m("תיכון"), "high");
  assert.equal(m("בא לי פיצה"), null);
  assert.equal(m("   "), null);
});

test("every target in search.yaml is a real transition", () => {
  const folders = new Set(loadTransitions().map((t) => t.folder));
  for (const [, , to] of table.ages) assert.ok(folders.has(to), to);
  for (const to of Object.values(table.grades)) assert.ok(folders.has(to), to);
  for (const [, to] of table.words) assert.ok(folders.has(to), to);
});
