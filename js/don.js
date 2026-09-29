/* Page don : le bouton suit le montant choisi et pointe vers le lien configuré. */
(function () {
  "use strict";
  var cfg = window.SITE || {};
  var btn = document.getElementById("donbtn"), other = document.getElementById("other"), otherv = document.getElementById("otherv");
  var soon = document.getElementById("don-soon");
  if (!btn) { return; }
  var links = cfg.donation || {};

  function current() {
    var r = document.querySelector('input[name="amt"]:checked');
    return r ? r.value : "30";
  }
  function render() {
    var v = current(), ta = window.getLang && window.getLang() === "ta";
    var shown = v === "other" ? (otherv.value || "…") : v;
    btn.textContent = ta ? (shown + " € வழங்குக") : ("Donner " + shown + " €");
    var href = (v !== "other" && links[v]) || links["default"] || "";
    if (href) {
      btn.href = href; btn.target = "_blank"; btn.rel = "noopener"; btn.removeAttribute("aria-disabled");
      if (soon) { soon.hidden = true; }
    } else {
      btn.removeAttribute("href"); btn.setAttribute("aria-disabled", "true");
      if (soon) { soon.hidden = false; }
    }
  }
  Array.prototype.forEach.call(document.querySelectorAll('input[name="amt"]'), function (r) {
    r.addEventListener("change", function () { other.hidden = current() !== "other"; render(); });
  });
  otherv.addEventListener("input", render);
  btn.addEventListener("click", function (e) { if (btn.getAttribute("aria-disabled") === "true") { e.preventDefault(); } });
  document.addEventListener("langchange", render);
  render();
})();
