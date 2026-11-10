// ============================================================
// Sur place / A emporter + saisie du numéro de chevalet
// ============================================================

// 1. LES ÉLÉMENTS DE LA PAGE
const menuBox = document.querySelector(".menu-box");
const surPlaceButton = document.querySelector("#sur-place");
const aEmporterButton = document.querySelector("#a-emporter");
const chevaletContainer = document.querySelector(".chevalet-container");
const chiffreCentaines = document.querySelector("#chevalet-number-input-100");
const chiffreDizaines = document.querySelector("#chevalet-number-input-10");
const chiffreUnites = document.querySelector("#chevalet-number-input-1");
const boutonEnregistrer = document.querySelector("#save-number");
const casesChevalet = [chiffreCentaines, chiffreDizaines, chiffreUnites];

// 2. LES FONCTIONS
// Efface les restes d'une ancienne commande
function commencerNouvelleCommande() {
  sessionStorage.removeItem("panier");
  sessionStorage.removeItem("numeroCommande");
  sessionStorage.removeItem("numeroChevalet");
}

// Cache la boîte d'accueil et affiche la saisie du chevalet
function afficherChevalet() {
  menuBox.style.display = "none";
  chevaletContainer.style.display = "block";
  chiffreCentaines.focus(); // le curseur est déjà dans la 1re case
}

// 3. QUE MONTRER À L'OUVERTURE DE LA PAGE ?
const dernierOverlay = document.querySelector("#last-overlay");
const commandeTerminee = sessionStorage.getItem("commandeTerminee"); // le petit mot laissé par choix-menu.js

if (commandeTerminee) {
  // le client vient de terminer sa commande : on lui dit merci
  sessionStorage.removeItem("commandeTerminee"); // on efface le mot, pour ne pas le montrer deux fois
  dernierOverlay.style.display = "block"; // affiche "Toute l'équipe vous remercie"
} else {
  // sinon, c'est un nouveau client : on affiche "Sur place / A emporter"
  menuBox.style.display = "block";
}

// 4. EFFET AU SURVOL DES BOUTONS
surPlaceButton.addEventListener("mouseover", () => {
  surPlaceButton.style.border = "10px solid #ffc836";
});

surPlaceButton.addEventListener("mouseout", () => {
  surPlaceButton.style.border = "8px solid #ffc836";
});

aEmporterButton.addEventListener("mouseover", () => {
  aEmporterButton.style.border = "10px solid #ffc836";
});

aEmporterButton.addEventListener("mouseout", () => {
  aEmporterButton.style.border = "8px solid #ffc836";
});

// 5. LES CLICS SUR "SUR PLACE" ET "A EMPORTER"
surPlaceButton.addEventListener("click", () => {
  commencerNouvelleCommande();
  sessionStorage.setItem("modeCommande", "sur-place");
  afficherChevalet(); // sur place : on demande le numéro de chevalet
});

aEmporterButton.addEventListener("click", () => {
  commencerNouvelleCommande();
  sessionStorage.setItem("modeCommande", "a-emporter");
  window.location.href = "/choix-menu.html"; // à emporter : pas de chevalet
});

// 6. LES TROIS CASES DU CHEVALET
casesChevalet.forEach((caseSaisie, position) => {
  caseSaisie.addEventListener("input", () => {
    // ne garde que le dernier caractère tapé, et seulement s'il est un chiffre
    caseSaisie.value = caseSaisie.value.replace(/[^0-9]/g, "").slice(-1);
    // passe automatiquement à la case suivante
    if (caseSaisie.value !== "" && position < casesChevalet.length - 1) {
      casesChevalet[position + 1].focus();
    }
  });
});

// 7. LE BOUTON "ENREGISTRER"
boutonEnregistrer.addEventListener("click", () => {
  const numero =
    chiffreCentaines.value + chiffreDizaines.value + chiffreUnites.value;
  if (!/^[0-9]{3}$/.test(numero)) {
    alert("Veuillez saisir les 3 chiffres du numéro inscrit sur le chevalet.");
    return;
  }
  sessionStorage.setItem("numeroChevalet", numero);
  window.location.href = "/choix-menu.html";
});

// 8. LE BOUTON "NOUVELLE COMMANDE" (dernier overlay)
const boutonNouvelleCommande = document.querySelector("#last-overlay-close");
boutonNouvelleCommande.addEventListener("click", () => {
  commencerNouvelleCommande();
  window.location.href = "/index.html"; // recharge l'accueil
});
