# Site du projet : Temple Murugan Lieusaint

Site statique (HTML, CSS, JavaScript) : pas d'installation, pas de framework. Tout se modifie dans VS Code.

## Ouvrir et tester
1. Ouvre le dossier dans VS Code.
2. Installe l'extension **Live Server** (Ritwick Dey), puis clic droit sur `index.html` > *Open with Live Server*.

## Structure
- `index.html`, `projet.html`, `avancement.html`, `participer.html`, `adhesion.html`, `don.html`, `contact.html`
- `mentions-legales.html`, `confidentialite.html` : modèles à compléter (repères jaunes)
- `css/style.css` : tokens (couleurs, tailles) en haut du fichier, puis les composants
- `js/config.js` : **le seul fichier à modifier pour brancher** e-mail, pétition, dons, adhésion, formulaires, réseaux sociaux
- `js/i18n-ta.js` : traductions tamoules (clé = attribut `data-i18n` dans les pages)
- `assets/img/` : photos

## À faire avant la mise en ligne
1. Remplir `js/config.js`. Les liens vides sont masqués ou signalés.
2. Formulaires : créer un compte Formspree (ou équivalent), coller l'adresse dans `formEndpoint`, puis passer `demoMode` à `false`.
3. Dons / adhésion : coller les liens HelloAsso (ou Stripe Payment Links) dans `donation` et `adhesionPayUrl`.
4. Chercher `class="todo"` dans les fichiers (Ctrl+Maj+F) : chaque repère jaune est un texte à compléter ou à valider. Les retirer une fois traités.
5. Faire relire le tamoul et valider les pages légales par l'association.
6. Remplacer les blocs `.ph` de `avancement.html` par de vraies photos, et ajouter une image de partage (`og:image`).
7. Polices : Google Fonts est chargé depuis les serveurs de Google. Pour un site 100 % sans transfert vers Google, télécharge Montserrat et Noto Sans Tamil et charge-les depuis `assets/fonts/`.

## Mettre en ligne (gratuit)
GitHub Pages : pousse le dossier dans un dépôt, puis *Settings > Pages > Deploy from a branch*. Un nom de domaine peut ensuite être branché.

## Ajouter une page
Copie une page existante, change le `<title>`, la description et le contenu ; garde l'en-tête, le pied de page et les 3 scripts finaux.
