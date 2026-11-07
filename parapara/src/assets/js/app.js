/* All the page behaviour. Nothing here talks to a server.
   The only things kept are in this browser's localStorage, under keys that start with "parapara:".
   What a parent types in the search box is never kept anywhere. */
(function () {
  var PREFIX = "parapara:v1:";
  var KEY_TRANSITION = PREFIX + "transition";
  var html = document.documentElement;

  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    clearAll: function () {
      try {
        var keys = [];
        for (var i = 0; i < localStorage.length; i++) {
          var k = localStorage.key(i);
          if (k && k.indexOf("parapara:") === 0) keys.push(k);
        }
        keys.forEach(function (k) { localStorage.removeItem(k); });
      } catch (e) {}
    }
  };

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function readJSON(id) { var el = document.getElementById(id); try { return el ? JSON.parse(el.textContent) : null; } catch (e) { return null; } }

  /* ---------- Transition page ---------- */
  var page = $("#transition");
  var folder = page && page.getAttribute("data-folder");
  if (folder) store.set(KEY_TRANSITION, folder);

  /* Checklist with progress */
  var checksKey = folder && PREFIX + "checks:" + folder;
  var boxes = $all("#checks input[type=checkbox]");
  function loadChecks() { try { return JSON.parse(store.get(checksKey) || "{}") || {}; } catch (e) { return {}; } }
  var checks = folder ? loadChecks() : {};
  function renderChecks() {
    var done = 0;
    boxes.forEach(function (b) {
      b.checked = !!checks[b.getAttribute("data-id")];
      b.closest(".check").classList.toggle("done", b.checked);
      if (b.checked) done++;
    });
    var p = $("#progress");
    if (!p) return;
    var total = boxes.length;
    p.textContent = done === 0 ? p.getAttribute("data-empty")
      : done === total ? p.getAttribute("data-done")
      : "סימנתם " + done + " מתוך " + total + ".";
    var bar = $("#bar");
    if (bar) bar.style.width = (total ? Math.round(done / total * 100) : 0) + "%";
  }
  boxes.forEach(function (b) {
    b.addEventListener("change", function () {
      var id = b.getAttribute("data-id");
      if (b.checked) checks[id] = 1; else delete checks[id];
      store.set(checksKey, JSON.stringify(checks));
      renderChecks();
    });
  });
  if (boxes.length) renderChecks();

  /* Tools tabs */
  var tabs = $all(".tab");
  function selectTab(t, focus) {
    tabs.forEach(function (x) {
      var on = x === t;
      x.classList.toggle("is-on", on);
      x.setAttribute("aria-selected", on ? "true" : "false");
      x.tabIndex = on ? 0 : -1;
    });
    var g = t.getAttribute("data-g");
    $all(".tools").forEach(function (x) { x.hidden = x.getAttribute("data-g") !== g; });
    if (focus) t.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { selectTab(t); });
    t.addEventListener("keydown", function (e) {
      // RTL: the left arrow moves forward.
      var d = e.key === "ArrowLeft" ? 1 : e.key === "ArrowRight" ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      selectTab(tabs[(i + d + tabs.length) % tabs.length], true);
    });
  });

  /* Timeline: "we are here", from the date on this device. Computed every visit, never kept. */
  var items = $all(".tl li[data-from]");
  if (items.length) {
    var now = new Date();
    var nowM = now.getFullYear() * 12 + now.getMonth();
    var month = function (s) { var p = s.split("-"); return +p[0] * 12 + (+p[1] - 1); };
    var current = items.filter(function (li) {
      return month(li.getAttribute("data-from")) <= nowM && nowM <= month(li.getAttribute("data-to"));
    });
    var mark = function (li, cls, text) {
      li.classList.add(cls);
      var h = $(".here", li);
      if (h) { h.textContent = text; h.hidden = false; }
    };
    if (current.length) current.forEach(function (li) { mark(li, "now", "אנחנו כאן"); });
    else {
      var next = items.filter(function (li) { return month(li.getAttribute("data-from")) > nowM; })[0];
      if (next) mark(next, "next", "השלב הבא");
    }
  }

  /* ---------- Home page ---------- */
  var saved = store.get(KEY_TRANSITION);
  if (html.getAttribute("data-page") === "home" && saved) {
    var chip = $('.chip[data-folder="' + saved + '"]');
    if (chip) chip.classList.add("is-on");
  }

  var form = $("#search");
  var table = readJSON("search-table");
  var labels = readJSON("transition-labels") || {};
  if (form && table && window.PPMatch) {
    var input = $("#q");
    var result = $("#result");
    var clearInput = function () { input.value = ""; };
    window.addEventListener("pageshow", clearInput); // the back button can bring back old text; drop it
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      $all(".chip.hint").forEach(function (c) { c.classList.remove("hint"); });
      var target = window.PPMatch.match(input.value, table);
      var t = target && labels[target];
      if (!input.value.trim()) {
        result.textContent = "כתבו גיל, כיתה או מילה. למשל: 5, כיתה ו, אבחון.";
      } else if (!t) {
        result.textContent = "לא מצאנו. נסו גיל (למשל 5) או כיתה (למשל כיתה ו), או בחרו מהכפתורים למעלה.";
      } else if (!t.ready) {
        result.textContent = "המעבר שלכם: " + t.label + ". החלק הזה עוד בכתיבה. בקרוב.";
        var soon = $all(".chip.soon").filter(function (c) { return c.firstChild && c.firstChild.textContent.trim() === t.label; })[0];
        if (soon) soon.classList.add("hint");
      } else {
        store.set(KEY_TRANSITION, target);
        clearInput();
        location.href = t.url;
      }
    });
  }

  /* ---------- Every page: clear everything ---------- */
  var clearBtn = $("#clear-all");
  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      if (!window.confirm("למחוק מהטלפון הזה את הבחירה ואת כל הסימונים?")) return;
      store.clearAll();
      checks = {};
      if (boxes.length) renderChecks();
      $all(".chip.is-on").forEach(function (c) { if (html.getAttribute("data-page") === "home") c.classList.remove("is-on"); });
      var note = $("#clear-note");
      if (note) note.textContent = "נמחק. לא נשאר בטלפון שום דבר מהאתר הזה.";
    });
  }

  /* ---------- Offline (production only) ---------- */
  if ("serviceWorker" in navigator && html.getAttribute("data-env") === "production") {
    window.addEventListener("load", function () { navigator.serviceWorker.register("/sw.js").catch(function () {}); });
  }
})();
