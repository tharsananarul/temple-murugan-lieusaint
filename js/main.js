/* ==========================================================================
   main.js — Temple Murugan Lieusaint
   Refonte Haute Finition 2026
   Responsabilités :
     1. Navigation Mobile (Vrai Drawer, Backdrop Blur, Scroll-Lock iOS/Android, Clavier Escape)
     2. Header Glassmorphism Dynamique au Défilement
     3. Puces de Dons Interactives (Micro-Interactions en Temps Réel)
     4. Bouton Partager Universel (Web Share API ou Copie Presse-Papiers)
     5. Liens Configurables depuis config.js (data-cfg, data-social, .js-mail)
     6. Détection Automatique de la Page Active (aria-current)
     7. Scroll Reveal & Stagger Animations (IntersectionObserver 60fps)
   ========================================================================== */
(function () {
  "use strict";

  var cfg = window.SITE || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.from((r || document).querySelectorAll(s)); };

  /* ── 1. MENU DRAWER MOBILE & BACKDROP ───────────────────── */
  var burger = $("#burger");
  var drawer = $("#mobile-drawer");
  var legacyNav = $("nav.main");
  var backdrop = $("#drawer-backdrop") || $(".mobile-drawer-backdrop");
  var closeBtn = $(".drawer-close-btn", drawer);

  // Création du backdrop s'il n'existe pas dans le DOM
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.id = "drawer-backdrop";
    backdrop.className = "mobile-drawer-backdrop";
    backdrop.setAttribute("aria-hidden", "true");
    document.body.appendChild(backdrop);
  }

  function openDrawer() {
    if (!drawer) {
      if (legacyNav) legacyNav.classList.add("mobile-open");
      if (burger) {
        burger.setAttribute("aria-expanded", "true");
        burger.setAttribute("aria-label", "Fermer le menu de navigation");
      }
      document.body.style.overflow = "hidden";
      return;
    }
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    backdrop.classList.add("active");
    if (burger) {
      burger.setAttribute("aria-expanded", "true");
      burger.setAttribute("aria-label", "Fermer le menu de navigation");
    }
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    if (!drawer) {
      if (legacyNav) legacyNav.classList.remove("mobile-open");
      if (burger) {
        burger.setAttribute("aria-expanded", "false");
        burger.setAttribute("aria-label", "Ouvrir le menu de navigation");
      }
      document.body.style.overflow = "";
      return;
    }
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    backdrop.classList.remove("active");
    if (burger) {
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "Ouvrir le menu de navigation");
    }
    document.body.style.overflow = "";
  }

  if (burger) {
    burger.addEventListener("click", function (e) {
      e.stopPropagation();
      var isOpen = drawer && drawer.classList.contains("open");
      isOpen ? closeDrawer() : openDrawer();
    });
  }

  if (backdrop) {
    backdrop.addEventListener("click", closeDrawer);
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeDrawer);
  }

  if (drawer) {
    /* Ferme au clic sur un lien interne du drawer */
    drawer.addEventListener("click", function (e) {
      var link = e.target.closest("a");
      if (link) { closeDrawer(); }
    });

    /* Ferme avec la touche Échap */
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.classList.contains("open")) {
        closeDrawer();
        if (burger) { burger.focus(); }
      }
    });

    /* Ferme si la fenêtre est redimensionnée en mode desktop */
    window.addEventListener("resize", function () {
      if (window.innerWidth > 860 && drawer.classList.contains("open")) {
        closeDrawer();
      }
    }, { passive: true });
  }

  /* ── 2. HEADER GLASSMORPHISM AU DÉFILEMENT ─────────────── */
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

  /* ── 2b. PROGRESSION DE LECTURE & TILT DES CARTES ───────── */
  var progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);

  var progressTick = false;
  function updateProgress() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    progress.style.width = (ratio * 100) + "%";
    progressTick = false;
  }
  window.addEventListener("scroll", function () {
    if (!progressTick) {
      progressTick = true;
      window.requestAnimationFrame(updateProgress);
    }
  }, { passive: true });
  window.addEventListener("resize", updateProgress, { passive: true });
  updateProgress();

  var canTilt = window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (canTilt) {
    $$(".triptych-card, .bento-card, .action-card, .contact-form-card").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        var y = (e.clientY - rect.top) / rect.height;
        card.style.setProperty("--card-glow-x", (x * 100) + "%");
        card.style.setProperty("--card-glow-y", (y * 100) + "%");
        card.style.transform = "perspective(900px) rotateX(" + ((0.5 - y) * 3.2) + "deg) rotateY(" + ((x - 0.5) * 3.2) + "deg) translateY(-5px)";
      });
      card.addEventListener("pointerleave", function () {
        card.style.transform = "";
      });
    });
  }

  /* ── 3. PUCES DE DONS INTERACTIVES (MICRO-INTERACTION) ───── */
  var donationPresets = $$(".don-preset");
  var donationMainBtn = $(".don-card .btn");
  if (donationPresets.length && donationMainBtn) {
    donationPresets.forEach(function (preset) {
      preset.addEventListener("click", function () {
        donationPresets.forEach(function (p) { p.classList.remove("active"); });
        preset.classList.add("active");

        var text = preset.textContent.trim();
        var amount = parseInt(text, 10);
        if (!isNaN(amount) && amount > 0) {
          donationMainBtn.setAttribute("href", "don.html?montant=" + amount);
          var btnLabel = donationMainBtn.querySelector("span");
          if (btnLabel) {
            btnLabel.textContent = "Faire un don de " + amount + " € en ligne";
          }
        } else {
          donationMainBtn.setAttribute("href", "don.html");
          var btnLabelFree = donationMainBtn.querySelector("span");
          if (btnLabelFree) {
            btnLabelFree.textContent = "Faire un don en ligne sécurisé";
          }
        }
      });
    });
  }

  if (!drawer && burger) {
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && burger.getAttribute("aria-expanded") === "true") {
        closeDrawer();
        burger.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 860 && burger.getAttribute("aria-expanded") === "true") {
        closeDrawer();
      }
    }, { passive: true });
  }

  /* ── 4. BOUTON PARTAGER (Touch & Mobile Friendly) ────────── */
  $$("[data-share]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var url  = cfg.siteUrl || location.href.split("#")[0];
      var data = {
        title: document.title,
        text: "Projet de sanctuaire culturel et spirituel hindou à Lieusaint – Sénart",
        url: url
      };
      if (navigator.share) {
        navigator.share(data).catch(function () {});
        return;
      }
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function () {
          var labelEl = btn.querySelector("strong") || btn;
          var original = labelEl.textContent;
          labelEl.textContent = "Lien copié ✓";
          setTimeout(function () { labelEl.textContent = original; }, 2400);
        });
      }
    });
  });

  /* ── 5. LIENS CONFIGURABLES DEPUIS CONFIG.JS ────────────── */
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

  /* ── 6. ARIA-CURRENT AUTOMATIQUE ───────────────────────── */
  var current = location.pathname.split("/").pop() || "index.html";
  $$(".nav-link, .drawer-nav-link").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href && href.split("#")[0] === current) {
      a.setAttribute("aria-current", "page");
    }
  });

  /* ── 7. SCROLL REVEAL ANIMATIONS FLUIDES ────────────────── */
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    var revealSelectors = [
      ".triptych-card",
      ".bento-card",
      ".action-card",
      ".ribbon-item",
      ".roadmap-item",
      ".editorial-frame",
      ".space-item",
      ".hero-trust-card",
      ".legacy-page .side",
      ".legacy-page .box",
      ".contact-aside-card",
      ".contact-form-card",
      ".block .title",
      ".block .eyebrow",
      ".block .lead",
      ".vel-divider",
      ".faq details"
    ];

    var revealElements = $$(revealSelectors.join(", "));

    revealElements.forEach(function (el) {
      el.classList.add("reveal");
    });

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: "0px 0px -30px 0px"
    });

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

})();
