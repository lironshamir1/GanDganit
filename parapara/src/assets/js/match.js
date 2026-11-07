/* Maps what a parent typed (age, grade or a word) to a transition folder.
   Pure function, no storage. The table comes from content/search.yaml. */
(function (root) {
  var GRADE_NUMBERS = ["", "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט", "י", "יא", "יב"];

  function normalize(s) {
    return String(s || "")
      .replace(/[֑-ׇ]/g, "")          // niqqud
      .replace(/['"`׳״’‘“”]/g, "")              // geresh and quotes: י״ב → יב, ו' → ו
      .replace(/[.,!?־-]/g, " ")                // other punctuation
      .replace(/\s+/g, " ")
      .trim();
  }

  function byAge(n, table) {
    for (var i = 0; i < table.ages.length; i++) {
      var r = table.ages[i];
      if (n >= r[0] && n <= r[1]) return r[2];
    }
    return null;
  }

  function match(input, table) {
    var q = normalize(input);
    if (!q) return null;
    var grades = table.grades || {};

    // "כיתה ו", "ו", "יב", "גן", "כיתה 6"
    var g = q.match(/^(?:בכיתה|כיתה|כתה)?\s*([א-ת]{1,2}|\d{1,2})$/);
    if (g) {
      var key = /^\d+$/.test(g[1]) && /^(בכיתה|כיתה|כתה)/.test(q) ? GRADE_NUMBERS[+g[1]] : g[1];
      if (key && grades[key]) return grades[key];
    }

    // An age: "5", "בן 5", "גיל 11", "5 וחצי"
    if (!/כיתה|כתה/.test(q)) {
      var a = q.match(/\d{1,2}/);
      if (a) return byAge(+a[0], table);
    }

    // A word: the longest keyword found inside what was typed wins.
    var best = null;
    var bestLen = 0;
    var words = table.words || [];
    for (var i = 0; i < words.length; i++) {
      var w = normalize(words[i][0]);
      if (w && q.indexOf(w) !== -1 && w.length > bestLen) { best = words[i][1]; bestLen = w.length; }
    }
    if (best) return best;

    // The start of a word, for half-typed input: "אבח" → "אבחון".
    if (q.length >= 3) {
      for (var j = 0; j < words.length; j++) {
        if (normalize(words[j][0]).indexOf(q) === 0) return words[j][1];
      }
    }
    return null;
  }

  root.PPMatch = { match: match, normalize: normalize };
})(typeof window !== "undefined" ? window : globalThis);
