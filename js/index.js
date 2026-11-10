// ============================================================
// Sur place / A emporter + saisie du numéro de chevalet
// ============================================================

// Plan du fichier :
//  1. Les éléments de la page
//  2. Les fonctions
//  3. Que montrer à l'ouverture de la page ?
//  4. Effet au survol des boutons
//  5. Les clics sur "Sur place" et "A emporter"
//  6. Les trois cases du chevalet
//  7. Le bouton "Enregistrer"
//  8. Le bouton "Nouvelle commande" (dernier overlay)
//
// Rappel : le navigateur lit ce fichier de haut en bas.
// Les éléments (section 1) et les fonctions (section 2) sont donc
// préparés en premier, puis utilisés dans les sections suivantes.

// 1. LES ÉLÉMENTS DE LA PAGE
// document.querySelector("...") retrouve un élément de la page HTML :
// un point (.nom) cherche une classe, un dièse (#nom) cherche un id.

// --- La boîte d'accueil et ses deux boutons ---
const menuBox = document.querySelector(".menu-box");
const surPlaceButton = document.querySelector("#sur-place");
const aEmporterButton = document.querySelector("#a-emporter");

// --- L'écran du chevalet : le conteneur, les trois cases et le bouton ---
const chevaletContainer = document.querySelector(".chevalet-container");
const chiffreCentaines = document.querySelector("#chevalet-number-input-100");
const chiffreDizaines = document.querySelector("#chevalet-number-input-10");
const chiffreUnites = document.querySelector("#chevalet-number-input-1");
const boutonEnregistrer = document.querySelector("#save-number");
const casesChevalet = [chiffreCentaines, chiffreDizaines, chiffreUnites]; // une liste qui regroupe les 3 cases : on pourra leur appliquer la même règle avec une seule boucle

// --- Le message de remerciement : la boîte et son bouton ---
const dernierOverlay = document.querySelector("#last-overlay");
const boutonNouvelleCommande = document.querySelector("#last-overlay-close");

// 2. LES FONCTIONS
// Une fonction est un bloc de code mis de côté : elle ne s'exécute que
// quand on l'appelle par son nom, par exemple commencerNouvelleCommande().

// Efface les restes d'une ancienne commande
function commencerNouvelleCommande() {
  sessionStorage.removeItem("panier"); // removeItem supprime une information rangée dans le sessionStorage
  sessionStorage.removeItem("numeroCommande");
  sessionStorage.removeItem("numeroChevalet");
}

// Cache la boîte d'accueil et affiche la saisie du chevalet
function afficherChevalet() {
  menuBox.style.display = "none"; // "none" cache l'élément
  chevaletContainer.style.display = "block"; // "block" l'affiche
  chiffreCentaines.focus(); // le curseur est déjà dans la 1re case
}

// 3. QUE MONTRER À L'OUVERTURE DE LA PAGE ?
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
// mouseover : la souris ENTRE sur le bouton, mouseout : elle en SORT.
// Le contour passe de 8px à 10px quand on survole, puis revient à 8px.

// --- Le bouton "Sur place" ---
surPlaceButton.addEventListener("mouseover", () => {
  surPlaceButton.style.border = "10px solid #ffc836";
});

surPlaceButton.addEventListener("mouseout", () => {
  surPlaceButton.style.border = "8px solid #ffc836";
});

// --- Le bouton "A emporter" ---
aEmporterButton.addEventListener("mouseover", () => {
  aEmporterButton.style.border = "10px solid #ffc836";
});

aEmporterButton.addEventListener("mouseout", () => {
  aEmporterButton.style.border = "8px solid #ffc836";
});

// 5. LES CLICS SUR "SUR PLACE" ET "A EMPORTER"
// sessionStorage.setItem("nom", "valeur") range une information pour la page suivante.
// Attention : les valeurs s'écrivent avec des tirets ("sur-place", "a-emporter"),
// car choix-menu.js les compare avec exactement les mêmes textes.

// --- Clic sur "Sur place" ---
surPlaceButton.addEventListener("click", () => {
  commencerNouvelleCommande();
  sessionStorage.setItem("modeCommande", "sur-place");
  afficherChevalet(); // sur place : on demande le numéro de chevalet
});

// --- Clic sur "A emporter" ---
aEmporterButton.addEventListener("click", () => {
  commencerNouvelleCommande();
  sessionStorage.setItem("modeCommande", "a-emporter");
  window.location.href = "/choix-menu.html"; // à emporter : pas de chevalet
});

// 6. LES TROIS CASES DU CHEVALET
// forEach répète la même action pour chaque case de la liste.
// "position" vaut 0 pour la 1re case, 1 pour la 2e, 2 pour la 3e.
casesChevalet.forEach((caseSaisie, position) => {
  // l'événement "input" se déclenche à chaque touche tapée dans la case
  caseSaisie.addEventListener("input", () => {
    // ne garde que le dernier caractère tapé, et seulement s'il est un chiffre
    // (replace(/[^0-9]/g, "") supprime tout ce qui n'est pas un chiffre, slice(-1) garde le dernier caractère)
    caseSaisie.value = caseSaisie.value.replace(/[^0-9]/g, "").slice(-1);
    // passe automatiquement à la case suivante
    // (sauf si la case est vide, ou si c'est déjà la dernière case)
    if (caseSaisie.value !== "" && position < casesChevalet.length - 1) {
      casesChevalet[position + 1].focus();
    }
  });
});

// 7. LE BOUTON "ENREGISTRER"
boutonEnregistrer.addEventListener("click", () => {
  // le + colle les trois chiffres : "4" + "5" + "6" donne "456"
  const numero =
    chiffreCentaines.value + chiffreDizaines.value + chiffreUnites.value;
  // /^[0-9]{3}$/ veut dire "exactement 3 chiffres" ; le ! devant veut dire "le contraire de"
  if (!/^[0-9]{3}$/.test(numero)) {
    alert("Veuillez saisir les 3 chiffres du numéro inscrit sur le chevalet.");
    return; // on s'arrête là : le client reste sur l'écran du chevalet
  }
  sessionStorage.setItem("numeroChevalet", numero); // on mémorise le numéro pour la page suivante
  window.location.href = "/choix-menu.html";
});

// 8. LE BOUTON "NOUVELLE COMMANDE" (dernier overlay)
boutonNouvelleCommande.addEventListener("click", () => {
  commencerNouvelleCommande();
  window.location.href = "/index.html"; // recharge l'accueil
});
