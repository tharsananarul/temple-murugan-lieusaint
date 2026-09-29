/* ==========================================================================
   Configuration du site : c'est ici (et seulement ici) que tu branches
   les liens et services. Laisse une valeur vide "" tant qu'elle n'est pas prête.
   ========================================================================== */
window.SITE = {
  // Adresse e-mail publique de contact
  contactEmail: "",

  // URL publique du site une fois en ligne (utilisée pour le bouton "Partager")
  siteUrl: "",

  // Lien de la pétition (celui du QR code des affiches)
  petitionUrl: "",

  // Paiement des dons : lien par défaut (HelloAsso, Stripe Payment Link...)
  // + éventuellement un lien par montant (utile avec Stripe Payment Links)
  donation: { default: "", 10: "", 30: "", 50: "", 100: "" },

  // Paiement de l'adhésion (page HelloAsso d'adhésion, par exemple)
  adhesionPayUrl: "",

  // Réception des formulaires (adhésion + contact).
  // Un service comme Formspree ou Getform te donne une adresse à coller ici.
  formEndpoint: "",

  // Tant que formEndpoint est vide : true = affiche un message "démo" au lieu d'un vrai envoi.
  // Passe à false avant la mise en ligne.
  demoMode: true,

  // Réseaux sociaux : les liens vides sont masqués automatiquement
  social: { instagram: "", facebook: "", youtube: "", tiktok: "" }
};
