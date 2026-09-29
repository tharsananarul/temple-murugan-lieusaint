# Temple Murugan Lieusaint

> Projet de création d'un lieu culturel et spirituel hindou à Lieusaint – Sénart.
> Ouvert à tous. En phase de conception.

**🌐 Site en ligne :** [tharsananarul.github.io/temple-murugan-lieusaint](https://tharsananarul.github.io/temple-murugan-lieusaint/)

---

## Structure du projet

```
projet-temple-lieusaint/
├── index.html          # Accueil
├── projet.html         # Le projet (vision, valeurs, architecture)
├── avancement.html     # Frise d'avancement + galerie photos
├── participer.html     # Adhérer / donner / signer / partager
├── adhesion.html       # Formulaire d'adhésion
├── don.html            # Page don
├── contact.html        # Formulaire de contact
├── mentions-legales.html
├── confidentialite.html
├── 404.html
│
├── css/
│   └── style.css       # Feuille de style unique (tokens OKLCH en haut)
│
├── js/
│   ├── config.js       # ⚙️ CONFIGURATION — modifier ici les liens et services
│   ├── i18n-ta.js      # Traductions tamoules
│   ├── main.js         # Menu, scroll, langue, bouton partager
│   ├── forms.js        # Validation et envoi des formulaires
│   └── don.js          # Logique page don
│
└── assets/
    ├── gopuram.svg
    └── img/            # Vos photos ici (voir LISEZMOI.txt)
```

## Configuration rapide

Ouvrez `js/config.js` et renseignez :

```js
window.SITE = {
  contactEmail:   "votre@email.fr",
  siteUrl:        "https://tharsananarul.github.io/temple-murugan-lieusaint/",
  petitionUrl:    "https://lien-petition.fr",
  formEndpoint:   "https://formspree.io/f/xxxxx",
  demoMode:       false,           // passer à false avant mise en ligne
  adhesionPayUrl: "https://...",
  donation: { default: "", 10: "", 30: "", 50: "", 100: "" },
  social: {
    instagram: "",
    facebook:  "",
    youtube:   "",
    tiktok:    ""
  }
};
```

## Ajouter des photos

Placez vos images dans `assets/img/` puis remplacez les blocs `<div class="ph">` par :

```html
<img
  src="assets/img/nom.jpg"
  srcset="assets/img/nom-400.jpg 400w, assets/img/nom-800.jpg 800w"
  sizes="(max-width: 640px) 100vw, 50vw"
  alt="Description précise"
  loading="lazy"
  width="800" height="600"
>
```

Pour l'image hero (prioritaire au chargement), utilisez `fetchpriority="high" loading="eager"`.

## Déploiement GitHub Pages

Le site est automatiquement déployé sur GitHub Pages depuis la branche `master`.

```bash
git add -A
git commit -m "feat: ..."
git push
```

## Stack technique

- HTML5 sémantique, CSS vanilla (pas de framework)
- Design : palette oklch, typographie fluide clamp(), dark mode, WCAG AA
- JS vanilla (ES5 compatible) — aucune dépendance npm
- Google Fonts : Montserrat + Noto Sans Tamil
- Bilingue FR / Tamoul via `data-i18n`

## Accessibilité

- Contraste WCAG AA vérifié sur tous les textes
- Focus visible partout
- Navigation clavier complète
- `prefers-reduced-motion` : zéro animation
- Dark mode via `prefers-color-scheme`
- Tamil : interlignage 1.9, pas de texte coupé

---

*Temple Murugan Lieusaint · Site en préparation*
