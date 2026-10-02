/* ==========================================================================
   main.js — Temple Murugan Lieusaint
   Responsabilités :
     1. Menu mobile (burger SVG animé, backdrop, scroll-lock iOS/Android, Escape)
     2. Header scroll → glassmorphism via IntersectionObserver
     3. Liens configurables depuis config.js (data-cfg, data-social, .js-mail)
     4. Bouton Partager (Web Share API ou copie presse-papiers)
     5. Aria-current page automatique
     6. Scroll Reveal animations (IntersectionObserver)
   ========================================================================== */
(function () {
  "use strict";

  var cfg = window.SITE || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.from((r || document).querySelectorAll(s)); };

  /* ── 1. MENU MOBILE & BACKDROP ──────────────────────────── */
  var burger = $("#burger");
  var menu   = $("#menu");

  // Création du backdrop s'il n'existe pas
  var backdrop = $(".nav-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.className = "nav-backdrop";
    backdrop.setAttribute("aria-hidden", "true");
    document.body.appendChild(backdrop);
  }

  if (burger && menu) {
    function openMenu() {
      menu.classList.add("open");
      backdrop.classList.add("active");
      burger.setAttribute("aria-expanded", "true");
      burger.setAttribute("aria-label", "Fermer le menu");
      document.body.style.overflow = "hidden"; // Empêche le défilement de fond sur iPhone / Android
    }

    function closeMenu() {
      menu.classList.remove("open");
      backdrop.classList.remove("active");
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "Ouvrir le menu");
      document.body.style.overflow = "";
    }

    burger.addEventListener("click", function (e) {
      e.stopPropagation();
      menu.classList.contains("open") ? closeMenu() : openMenu();
    });

    backdrop.addEventListener("click", closeMenu);

    /* Ferme au clic sur un lien du menu */
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

    /* Ferme si la fenêtre est redimensionnée en mode desktop */
    window.addEventListener("resize", function () {
      if (window.innerWidth > 860 && menu.classList.contains("open")) {
        closeMenu();
      }
    }, { passive: true });
  }

  /* ── 2. HEADER GLASSMORPHISM AU SCROLL ─────────────────── */
  var header = $("#header") || $("header.site");
  if (header) {
    if ("IntersectionObserver" in window) {
      var sentinel = document.createElement("div");
      sentinel.style.cssText = "position:absolute;top:40px;height:1px;pointer-events:none;";
      document.body.insertBefore(sentinel, document.body.firstChild);
      new IntersectionObserver(function (entries) {
        header.classList.toggle("scrolled", !entries[0].isIntersecting);
      }).observe(sentinel);
    } else {
      window.addEventListener("scroll", function () {
        header.classList.toggle("scrolled", window.scrollY > 40);
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
      if (v) {
        el.setAttribute("href", v);
        el.target = "_blank";
        el.rel = "noopener noreferrer";
      }
    } else if (!v) {
      el.hidden = true;
    }
  });

  $$(".js-mail").forEach(function (el) {
    if (cfg.contactEmail) {
      el.textContent = cfg.contactEmail;
      el.setAttribute("href", "mailto:" + cfg.contactEmail);
    }
  });

  /* ── 4. BOUTON PARTAGER (Touch & Mobile friendly) ───────── */
  $$("[data-share]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var url  = cfg.siteUrl || location.href.split("#")[0];
      var data = {
        title: document.title,
        text: "Projet de lieu culturel et spirituel hindou à Lieusaint – Sénart",
        url: url
      };
      if (navigator.share) {
        navigator.share(data).catch(function () {});
        return;
      }
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

  /* ── 6. SCROLL REVEAL ANIMATIONS ──────────────────────── */
  // Respect prefers-reduced-motion
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    // Add .reveal class to eligible elements
    var revealSelectors = [
      ".pillar",
      ".triptych-card",
      ".bento-card",
      ".action-card",
      ".ribbon-item",
      ".roadmap-item",
      ".editorial-frame",
      ".spaces-list",
      ".act-card",
      ".way-card",
      ".block .title",
      ".block .eyebrow",
      ".block .lead",
      ".timeline-item",
      ".img-slot",
      ".vel-divider",
      ".faq details"
    ];

    var revealElements = $$(revealSelectors.join(", "));

    revealElements.forEach(function (el) {
      el.classList.add("reveal");
    });

    // Create observer
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.10,
      rootMargin: "0px 0px -40px 0px"
    });

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });

    // Add stagger class to parent grids
    $$(".acts-grid, .ways-grid, .pillars, .triptych-grid, .bento-grid, .action-showcase, .action-ribbon").forEach(function (grid) {
      grid.classList.add("reveal-stagger");
    });
  }

})();
