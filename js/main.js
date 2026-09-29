/* ==========================================================================
   main.js — Temple Murugan Lieusaint
   Responsabilités :
     1. Menu mobile (burger SVG animé, fermeture au clic lien / Escape)
     2. Header scroll → glassmorphism
     3. Langue FR / Tamoul (persistance localStorage)
     4. Liens configurables depuis config.js (data-cfg, data-social, .js-mail)
     5. Bouton Partager (Web Share API ou copie presse-papiers)
     6. Aria-current page automatique
   ========================================================================== */
(function () {
  "use strict";

  var cfg = window.SITE || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.from((r || document).querySelectorAll(s)); };

  /* ── 1. MENU MOBILE ─────────────────────────────────────── */
  var burger = $("#burger");
  var menu   = $("#menu");

  if (burger && menu) {
    function openMenu() {
      menu.classList.add("open");
      burger.setAttribute("aria-expanded", "true");
      burger.setAttribute("aria-label", "Fermer le menu");
    }
    function closeMenu() {
      menu.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "Ouvrir le menu");
    }

    burger.addEventListener("click", function () {
      menu.classList.contains("open") ? closeMenu() : openMenu();
    });

    /* Ferme au clic sur un lien (navigation mobile) */
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { closeMenu(); }
    });

    /* Ferme avec Escape */
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("open")) {
        closeMenu();
        burger.focus();
      }
    });

    /* Ferme si on clique hors du menu */
    document.addEventListener("click", function (e) {
      if (!menu.contains(e.target) && !burger.contains(e.target)) {
        closeMenu();
      }
    });
  }

  /* ── 2. HEADER GLASSMORPHISM AU SCROLL ─────────────────── */
  var header = $("#header") || $("header.site");
  if (header) {
    var scrollThreshold = 60;
    function updateHeader() {
      if (window.scrollY > scrollThreshold) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }
    /* IntersectionObserver plus performant que scroll event */
    if ("IntersectionObserver" in window) {
      var sentinel = document.createElement("div");
      sentinel.style.cssText = "position:absolute;top:" + scrollThreshold + "px;height:1px;pointer-events:none;";
      document.body.insertBefore(sentinel, document.body.firstChild);
      new IntersectionObserver(function (entries) {
        header.classList.toggle("scrolled", !entries[0].isIntersecting);
      }).observe(sentinel);
    } else {
      /* Fallback */
      window.addEventListener("scroll", updateHeader, { passive: true });
      updateHeader();
    }
  }

  /* ── 3. LANGUE FR / TAMOUL ──────────────────────────────── */
  var nodes = $$("[data-i18n]");
  /* Sauvegarde le contenu FR d'origine */
  nodes.forEach(function (n) {
    n.setAttribute("data-fr", n.innerHTML);
  });

  var lang = "fr";
  try { lang = localStorage.getItem("lang") || "fr"; } catch (e) {}

  window.getLang = function () { return lang; };

  function applyLang(l) {
    lang = l;
    document.documentElement.lang = l;
    var TA = window.TA || {};

    nodes.forEach(function (n) {
      var k = n.getAttribute("data-i18n");
      if (l === "ta" && TA[k] !== undefined) {
        n.textContent = TA[k];
      } else {
        n.innerHTML = n.getAttribute("data-fr");
      }
    });

    /* Mise à jour boutons langue */
    $$(".lang button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.lang === l));
    });

    try { localStorage.setItem("lang", l); } catch (e) {}
    document.dispatchEvent(new CustomEvent("langchange", { detail: l }));
  }

  $$(".lang button").forEach(function (b) {
    b.addEventListener("click", function () { applyLang(b.dataset.lang); });
  });

  if (lang !== "fr") {
    applyLang(lang);
  } else {
    $$(".lang button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.lang === "fr"));
    });
  }

  /* ── 4. LIENS CONFIGURABLES (config.js) ─────────────────── */
  /* data-cfg="petitionUrl" → href depuis SITE.petitionUrl */
  $$("[data-cfg]").forEach(function (el) {
    var v = cfg[el.dataset.cfg];
    if (v) {
      el.setAttribute("href", v);
      if (/^https?:/i.test(v)) {
        el.target = "_blank";
        el.rel = "noopener noreferrer";
      }
    }
  });

  /* Réseaux sociaux : masque les <li> dont le lien est vide */
  $$("[data-social]").forEach(function (el) {
    var v = cfg.social && cfg.social[el.dataset.social];
    if (el.tagName === "A") {
      if (v) {
        el.setAttribute("href", v);
        el.target = "_blank";
        el.rel = "noopener noreferrer";
      }
    } else if (!v) {
      el.hidden = true;
    }
  });

  /* Adresse e-mail de contact */
  $$(".js-mail").forEach(function (el) {
    if (cfg.contactEmail) {
      el.textContent = cfg.contactEmail;
      el.setAttribute("href", "mailto:" + cfg.contactEmail);
    }
  });

  /* ── 5. BOUTON PARTAGER ─────────────────────────────────── */
  $$("[data-share]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var url  = cfg.siteUrl || location.href.split("#")[0];
      var data = {
        title: document.title,
        text: lang === "ta"
          ? "Lieusaint இல் இந்து கலாச்சார மற்றும் ஆன்மீக மையம்"
          : "Projet de lieu culturel et spirituel à Lieusaint – Sénart",
        url: url
      };

      if (navigator.share) {
        navigator.share(data).catch(function () {});
        return;
      }

      /* Fallback : copie dans le presse-papiers */
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function () {
          var arrow = btn.querySelector(".way-arrow");
          var target = arrow || btn;
          var old = target.textContent;
          target.textContent = lang === "ta" ? "நகலெடுக்கப்பட்டது ✓" : "Lien copié ✓";
          setTimeout(function () { target.textContent = old; }, 2500);
        });
      }
    });
  });

  /* ── 6. ARIA-CURRENT PAGE AUTOMATIQUE ──────────────────── */
  var current = location.pathname.split("/").pop() || "index.html";
  $$("nav.main a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href && href.split("#")[0] === current) {
      a.setAttribute("aria-current", "page");
    }
  });

})();
