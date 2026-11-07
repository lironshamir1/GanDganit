/* Runs before the page draws. On the home page, opens the transition chosen last time.
   "?choose=1" in the address shows the home page anyway, so the choice can be changed. */
(function () {
  var KEY = "parapara:v1:transition";
  var html = document.documentElement;
  if (html.getAttribute("data-page") !== "home") return;
  if (/[?&]choose=/.test(location.search)) return;
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { return; }
  if (!saved) return;
  var meta = document.querySelector('meta[name="pp-ready"]');
  var ready = meta ? meta.getAttribute("content").split(",") : [];
  if (ready.indexOf(saved) !== -1) location.replace("/" + saved + "/");
})();
