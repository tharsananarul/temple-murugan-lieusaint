/* ==========================================================================
   main.js — Temple Murugan Lieusaint
   Responsabilités :
     1. Menu mobile (burger SVG animé, fermeture au clic lien / Escape)
     2. Header scroll → glassmorphism
     3. Liens configurables depuis config.js (data-cfg, data-social, .js-mail)
     4. Bouton Partager (Web Share API ou copie presse-papiers)
     5. Aria-current page automatique
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

    /* Ferme au clic sur un lien */
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

    /* Ferme en cliquant hors du menu */
    document.addEventListener("click", function (e) {
      if (!menu.contains(e.target) && !burger.contains(e.target)) {
        closeMenu();
      }
    });
  }

  /* ── 2. HEADER GLASSMORPHISM AU SCROLL ─────────────────── */
  var header = $("#header") || $("header.site");
  if (header) {
    if ("IntersectionObserver" in window) {
      var sentinel = document.createElement("div");
      sentinel.style.cssText = "position:absolute;top:60px;height:1px;pointer-events:none;";
      document.body.insertBefore(sentinel, document.body.firstChild);
      new IntersectionObserver(function (entries) {
        header.classList.toggle("scrolled", !entries[0].isIntersecting);
      }).observe(sentinel);
    } else {
      window.addEventListener("scroll", function () {
        header.classList.toggle("scrolled", window.scrollY > 60);
      }, { passive: true });
    }
  }

  /* ── 3. LIENS CONFIGURABLES ─────────────────────────────── */
  $$("[data-cfg]").forEach(function (el) {
    var v = cfg[el.dataset.cfg];
    if (v) {
      el.setAttribute("href", v);
      if (/^https?:/i.test(v)) { el.target = "_blank"; el.rel = "noopener noreferrer"; }
    }
  });

  $$("[data-social]").forEach(function (el) {
    var v = cfg.social && cfg.social[el.dataset.social];
    if (el.tagName === "A") {
      if (v) { el.setAttribute("href", v); el.target = "_blank"; el.rel = "noopener noreferrer"; }
    } else if (!v) { el.hidden = true; }
  });

  $$(".js-mail").forEach(function (el) {
    if (cfg.contactEmail) {
      el.textContent = cfg.contactEmail;
      el.setAttribute("href", "mailto:" + cfg.contactEmail);
    }
  });

  /* ── 4. BOUTON PARTAGER ─────────────────────────────────── */
  $$("[data-share]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var url  = cfg.siteUrl || location.href.split("#")[0];
      var data = {
        title: document.title,
        text: "Projet de lieu culturel et spirituel à Lieusaint – Sénart",
        url: url
      };
      if (navigator.share) { navigator.share(data).catch(function () {}); return; }
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function () {
          var arrow  = btn.querySelector(".way-arrow");
          var target = arrow || btn;
          var old    = target.textContent;
          target.textContent = "Lien copié ✓";
          setTimeout(function () { target.textContent = old; }, 2500);
        });
      }
    });
  });

  /* ── 5. ARIA-CURRENT PAGE AUTOMATIQUE ──────────────────── */
  var current = location.pathname.split("/").pop() || "index.html";
  $$("nav.main a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href && href.split("#")[0] === current) {
      a.setAttribute("aria-current", "page");
    }
  });

})();
