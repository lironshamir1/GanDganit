import { test } from "node:test";
import assert from "node:assert/strict";
import { loadTransitions, warnings } from "../lib/content.js";

const all = loadTransitions();
const aleph = all.find((t) => t.folder === "aleph");

test("only aleph has content; the rest are 'soon'", () => {
  assert.equal(aleph.ready, true);
  for (const t of all.filter((t) => t.folder !== "aleph")) assert.equal(t.ready, false, t.folder);
});

test("no warnings for the current content", () => {
  assert.deepEqual(warnings, []);
});

test("aleph content matches the draft", () => {
  assert.equal(aleph.timeline.items.length, 5);
  assert.equal(aleph.checklist.items.length, 7);
  assert.deepEqual(aleph.tools.groups.map((g) => g.label), ["עם הילד", "בבית", "בשבילכם"]);
  assert.deepEqual(aleph.tools.groups.map((g) => g.items.length), [5, 5, 4]);
  assert.equal(aleph.contacts.items.length, 3);
});

test("'דף על הילד שלי' is gone", () => {
  assert.ok(!JSON.stringify(aleph).includes("על הילד שלי"));
});

test("every timeline item has dates and a calendar date", () => {
  for (const it of aleph.timeline.items) {
    assert.match(it.from, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(it.to, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(it.calendarDate);
  }
});

test("checklist ids are unique", () => {
  const ids = aleph.checklist.items.map((c) => c.id);
  assert.equal(new Set(ids).size, ids.length);
});
