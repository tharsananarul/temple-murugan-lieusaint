/* Formulaires d'adhésion et de contact : validation + envoi vers cfg.formEndpoint. */
(function () {
  "use strict";
  var cfg = window.SITE || {};
  var MSG = {
    fr: { req: "Ce champ est obligatoire.", mail: "Vérifiez l'adresse e-mail (exemple : nom@domaine.fr).", consent: "Votre accord est nécessaire pour envoyer le formulaire.", sending: "Envoi en cours…", fail: "L'envoi a échoué. Réessayez dans un instant ou écrivez-nous directement par e-mail.", demo: "Mode démo : rien n'a été envoyé." },
    ta: { req: "இந்தப் புலம் அவசியம்.", mail: "மின்னஞ்சல் முகவரியைச் சரிபாருங்கள்.", consent: "படிவத்தை அனுப்ப உங்கள் ஒப்புதல் அவசியம்.", sending: "அனுப்பப்படுகிறது…", fail: "அனுப்ப முடியவில்லை. சிறிது நேரம் கழித்து மீண்டும் முயலுங்கள்.", demo: "மாதிரி வடிவம்: எதுவும் அனுப்பப்படவில்லை." }
  };
  function t(k) { return (MSG[(window.getLang && window.getLang()) || "fr"] || MSG.fr)[k]; }

  function errBox(field) { return document.getElementById("e-" + field.id); }
  function validate(field) {
    var box = errBox(field), msg = "";
    var v = (field.type === "checkbox") ? field.checked : field.value.trim();
    if (field.required && !v) { msg = field.type === "checkbox" ? t("consent") : t("req"); }
    else if (field.type === "email" && v && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) { msg = t("mail"); }
    if (box) { box.textContent = msg; }
    if (msg) { field.setAttribute("aria-invalid", "true"); } else { field.removeAttribute("aria-invalid"); }
    return !msg;
  }

  Array.prototype.forEach.call(document.querySelectorAll("form[data-form]"), function (form) {
    var fields = Array.prototype.slice.call(form.querySelectorAll("[required]"));
    fields.forEach(function (f) {
      f.addEventListener("blur", function () { validate(f); });
      f.addEventListener("input", function () { if (f.getAttribute("aria-invalid")) { validate(f); } });
      f.addEventListener("change", function () { if (f.getAttribute("aria-invalid")) { validate(f); } });
    });

    var ok = form.parentNode.querySelector(".ok"), fail = form.parentNode.querySelector(".fail");
    var submit = form.querySelector('[type="submit"]');

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (fail) { fail.classList.remove("show"); }
      var first = null;
      fields.forEach(function (f) { if (!validate(f) && !first) { first = f; } });
      if (first) { first.focus(); return; }
      if (form.querySelector('[name="_gotcha"]').value) { return; } // robot : on ignore

      function done(isDemo) {
        form.style.display = "none";
        if (ok) {
          var demo = ok.querySelector(".demo");
          if (demo) { demo.hidden = !isDemo; demo.textContent = t("demo"); }
          ok.classList.add("show"); ok.setAttribute("tabindex", "-1"); ok.focus();
        }
        var pay = ok && ok.querySelector("[data-after-pay]");
        if (pay) { if (cfg.adhesionPayUrl) { pay.href = cfg.adhesionPayUrl; pay.hidden = false; } else { pay.hidden = true; } }
      }

      if (!cfg.formEndpoint) {
        if (cfg.demoMode) { done(true); }
        else if (fail) { fail.classList.add("show"); }
        return;
      }

      var label = submit.textContent; submit.disabled = true; submit.textContent = t("sending");
      fetch(cfg.formEndpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (r) { if (!r.ok) { throw new Error("HTTP " + r.status); } done(false); })
        .catch(function () { if (fail) { fail.textContent = t("fail"); fail.classList.add("show"); } submit.disabled = false; submit.textContent = label; });
    });
  });
})();
