// ============================================================
//  CHOIX-MENU.JS : page de choix des produits de la borne Wacdo
//
//  Plan du fichier :
//   1. Les éléments de la page
//   2. Les variables et les réglages
//   3. Les fonctions
//   4. Chargement des données (catégories et produits)
//   5. Overlay 1 : taille du menu
//   6. Overlay 2 : accompagnement
//   7. Overlay 3 : boisson du menu
//   8. Overlay 4 : boisson seule (taille et quantité)
//   9. Défilement des sliders
// ============================================================

// ============================================================
//  1. LES ÉLÉMENTS DE LA PAGE
//  On récupère chaque élément du HTML une seule fois,
//  pour pouvoir le modifier plus bas dans le fichier.
// ============================================================

// --- Slider des catégories et zone des produits ---
const zoneSlider = document.querySelector(".zone-contenu-scroll");
const choixBurger = document.querySelector("#choose-burgers");
const flecheGauche = document.querySelector(".fleche-slider-left");
const flecheDroite = document.querySelector(".fleche-slider-right");

// --- Mode de commande choisi sur la page d'accueil ---
const modeCommande = sessionStorage.getItem("modeCommande");
console.log(modeCommande); // test : affiche "sur place" ou "a emporter" (à supprimer plus tard)

// --- Overlay 1 : taille du menu ---
const overlay = document.querySelector("#overlay");
const boutonFermer = document.querySelector("#button-close");
const boutonsTaille = document.querySelectorAll(
  "#overlay .choose1, #overlay .choose2",
);
const boutonSuivant = document.querySelector("#next");

// --- Overlay 2 : accompagnement ---
const overlay2 = document.querySelector("#overlay2");
const boutonFermer2 = document.querySelector("#button-close2");
const boutonRetour2 = document.querySelector("#button-return2");
const boutonsAccompagnement = document.querySelectorAll(
  "#overlay2 .choose1, #overlay2 .choose2",
);
const boutonSuivant1 = document.querySelector("#next1");

// --- Overlay 3 : boisson du menu ---
const overlay3 = document.querySelector("#overlay3");
const boutonFermer3 = document.querySelector("#button-close3");
const boutonRetour3 = document.querySelector("#button-return3");
const boutonsBoisson = document.querySelectorAll("#overlay3 .drink");
const boutonAjouter = document.querySelector("#add-to-order");
const sliderBoissons = document.querySelector("#overlay-slider-drink-content");
const flecheBoissonGauche = document.querySelector("#fleche-slider-drink-left");
const flecheBoissonDroite = document.querySelector(
  "#fleche-slider-drink-right",
);

// --- Overlay 4 : boisson seule ---
const overlay4 = document.querySelector("#overlay4");
const boutonFermer4 = document.querySelector("#button-close4");
const boutonAnnuler4 = document.querySelector("#cancel4");
const boutonsTailleBoisson = document.querySelectorAll(
  "#overlay4 .choose-size-1, #overlay4 .choose-size-2",
);
const imgTaille1 = document.querySelector("#img-choose-size1");
const imgTaille2 = document.querySelector("#img-choose-size2");
const boutonMoins = document.querySelector("#quantity-decrease");
const boutonPlus = document.querySelector("#quantity-increase");
const quantiteAffichee = document.querySelector("#quantity-value");
const boutonAjouter4 = document.querySelector("#next4");

// ============================================================
//  2. LES VARIABLES ET LES RÉGLAGES
// ============================================================

// Données chargées depuis les fichiers JSON (vides au départ)
let categories = []; // [] = un tableau (la liste des catégories)
let produits = {}; // {} = un objet (les produits rangés par catégorie)

// Quantité choisie dans l'overlay 4 (1 par défaut)
let quantite = 1;

// Distance de défilement à chaque clic sur une flèche, en pixels
const pas = 100; // slider des catégories
const pasBoissons = 185; // slider des boissons : largeur d'un bouton (175) + espace (10)

// Récupération de la commande existante dans le sessionStorage, si elle existe.
// Si une commande existe déjà dans le sessionStorage, on la récupère, sinon on part d'une liste vide.
// On utilise JSON.parse pour convertir le texte en objet JavaScript.
// Si sessionStorage.getItem("commande") est null, on utilise [] par défaut qui représente une commande vide.
let commande = JSON.parse(sessionStorage.getItem("commande")) || []; 

// ============================================================
//  3. LES FONCTIONS
//  Une fonction est un bloc de code mis de côté.
//  Elle ne s'exécute que lorsqu'on l'appelle par son nom.
// ============================================================

// Remet à zéro les choix du menu (cadres orange et mémoire)
function reinitialiserChoix() {
  boutonsTaille.forEach((el) => el.classList.remove("actif")); // on enlève le cadre orange des tailles
  boutonsAccompagnement.forEach((el) => el.classList.remove("actif")); // on enlève le cadre orange des accompagnements
  boutonsBoisson.forEach((el) => el.classList.remove("actif")); // on enlève le cadre orange des boissons
  sessionStorage.removeItem("tailleMenu"); // on supprime la taille du menu mémorisée
  sessionStorage.removeItem("accompagnement"); // on supprime l'accompagnement mémorisé
  sessionStorage.removeItem("boisson"); // on supprime la boisson mémorisée
}

// Remet à zéro l'overlay 4 (cadre orange, mémoire et quantité)
function reinitialiserBoisson() {
  boutonsTailleBoisson.forEach((el) => el.classList.remove("actif")); // on enlève le cadre orange des tailles de boisson
  sessionStorage.removeItem("tailleBoisson"); // on supprime la taille de boisson mémorisée
  quantite = 1;
  quantiteAffichee.textContent = quantite; // on met à jour l'affichage de la quantité
}

// Affiche les produits d'une catégorie (par exemple "menus" ou "boissons")
function afficherProduits(categorie) {
  choixBurger.innerHTML = ""; // on vide la zone avant de la remplir avec les produits de la catégorie

  // pour chaque produit de la catégorie, on crée une carte
  produits[categorie].forEach((produit) => {
    const bouton = document.createElement("button");
    bouton.classList.add("card-products");
    bouton.innerHTML = `
      <img class="img-card-products" src="asset/${produit.image}" alt="${produit.nom}" /> 
      <span class="text-choose-burgers">${produit.nom}</span>
      <span class="price-choose-burgers">${produit.prix}€</span>
    `;

    // au clic sur la carte
    bouton.addEventListener("click", () => {
      // 1. le cadre orange passe sur la carte cliquée
      document
        .querySelectorAll(".card-products")
        .forEach((el) => el.classList.remove("actif"));
      bouton.classList.add("actif");

      // 2. on ouvre l'overlay qui correspond à la catégorie
      if (categorie === "menus") {
        reinitialiserChoix();
        overlay.style.display = "block"; // overlay 1 pour les menus
      } else if (categorie === "boissons") {
        reinitialiserBoisson();
        sessionStorage.setItem("boissonChoisie", produit.nom); // on mémorise la boisson cliquée
        imgTaille1.src = `asset/${produit.image}`; // l'overlay affiche l'image de cette boisson
        imgTaille2.src = `asset/${produit.image}`;
        overlay4.style.display = "block"; // overlay 4 pour les boissons
      }
        else { // toutes les autres catégories : un clic = ajouté à la commande
        ajouterALaCommande(produit); // toutes les autres catégories : un clic = ajouté à la commande
      }
    });

    choixBurger.appendChild(bouton); // la carte apparaît dans la page
  });
}

// Ajoute un produit à la commande (une seule ligne par produit, avec sa quantité)
function ajouterALaCommande(produit) {
  // ce produit est-il déjà dans la commande ?
  const articleExistant = commande.find(
    (article) => article.nom === produit.nom,
  );

  if (articleExistant) {
    articleExistant.quantite++; // oui : on ajoute 1 à sa quantité
  } else {
    commande.push({ nom: produit.nom, prix: produit.prix, quantite: 1 }); // non : on l'ajoute à la liste avec nom, prix et quantité initiale de 1
  }

  sessionStorage.setItem("commande", JSON.stringify(commande)); // on range la liste, convertie en texte
  console.log(commande); // affiche la commande sur la console , on peut voir ce qui a été ajouté en format JSON
}

// ============================================================
//  4. CHARGEMENT DES DONNÉES
//  fetch va chercher un fichier JSON. La réponse arrive plus tard,
//  donc tout ce qui a besoin des données se trouve dans les .then
// ============================================================

// --- Les catégories : on crée un bouton par catégorie dans le slider ---
fetch("data/categories.json")
  .then((response) => response.json())
  .then((data) => {
    categories = data;

    categories.forEach((categorie) => {
      const bouton = document.createElement("button");
      bouton.classList.add("elements-slider");
      bouton.innerHTML = `
        <img class="img-elements-slider" src="asset/${categorie.image}" alt="${categorie.title}" />
        <span class="text-elements-slider">${categorie.title}</span>
      `;

      // le cadre orange est sur "menus" au chargement de la page
      if (categorie.title === "menus") {
        bouton.classList.add("actif");
      }

      // au clic sur la catégorie
      bouton.addEventListener("click", () => {
        // 1. le cadre orange passe sur le bouton cliqué
        document
          .querySelectorAll(".elements-slider")
          .forEach((el) => el.classList.remove("actif"));
        bouton.classList.add("actif");

        // 2. on affiche les produits de cette catégorie
        afficherProduits(categorie.title);
      });

      zoneSlider.appendChild(bouton); // le bouton apparaît dans le slider
    });
  })
  .catch((error) => {
    console.error("Erreur lors du chargement des catégories :", error);
  });

// --- Les produits : on affiche ceux de "menus" au chargement de la page ---
fetch("data/produits.json")
  .then((response) => response.json())
  .then((data) => {
    produits = data;
    afficherProduits("menus");
  })
  .catch((error) => {
    console.error("Erreur lors du chargement des produits :", error);
  });

// ============================================================
//  5. OVERLAY 1 : TAILLE DU MENU
// ============================================================

// La croix ferme l'overlay
boutonFermer.addEventListener("click", () => {
  overlay.style.display = "none";
});

// Choix de la taille : cadre orange + mémorisation du choix
boutonsTaille.forEach((bouton) => {
  bouton.addEventListener("click", () => {
    boutonsTaille.forEach((el) => el.classList.remove("actif"));
    bouton.classList.add("actif");

    const texte = bouton
      .querySelector(".text-choose-burgers-size")
      .textContent.trim();
    sessionStorage.setItem("tailleMenu", texte);
  });
});

// "Etape suivante" : passe à l'overlay 2 (seulement si une taille est choisie)
boutonSuivant.addEventListener("click", () => {
  if (!sessionStorage.getItem("tailleMenu")) return; // on ne passe à l'étape suivante que si une taille est choisie
  overlay.style.display = "none";
  overlay2.style.display = "block";
});

// ============================================================
//  6. OVERLAY 2 : ACCOMPAGNEMENT
// ============================================================

// La croix ferme l'overlay
boutonFermer2.addEventListener("click", () => {
  overlay2.style.display = "none";
});

// "retour" revient à l'overlay 1
boutonRetour2.addEventListener("click", () => {
  overlay2.style.display = "none";
  overlay.style.display = "block";
});

// Choix de l'accompagnement : cadre orange + mémorisation du choix
boutonsAccompagnement.forEach((bouton) => {
  bouton.addEventListener("click", () => {
    boutonsAccompagnement.forEach((el) => el.classList.remove("actif"));
    bouton.classList.add("actif");

    const texte = bouton
      .querySelector(".text-choose-burgers-size")
      .textContent.trim();
    sessionStorage.setItem("accompagnement", texte);
  });
});

// "Etape suivante" : passe à l'overlay 3 (seulement si un choix est fait)
boutonSuivant1.addEventListener("click", () => {
  if (!sessionStorage.getItem("accompagnement")) return; // on ne passe à l'étape suivante que si un accompagnement est choisi
  overlay2.style.display = "none";
  overlay3.style.display = "block";
});

// ============================================================
//  7. OVERLAY 3 : BOISSON DU MENU
// ============================================================

// La croix ferme l'overlay
boutonFermer3.addEventListener("click", () => {
  overlay3.style.display = "none";
});

// "retour" revient à l'overlay 2
boutonRetour3.addEventListener("click", () => {
  overlay3.style.display = "none";
  overlay2.style.display = "block";
});

// Choix de la boisson : cadre orange + mémorisation du choix
boutonsBoisson.forEach((bouton) => {
  bouton.addEventListener("click", () => {
    boutonsBoisson.forEach((el) => el.classList.remove("actif"));
    bouton.classList.add("actif");
    sessionStorage.setItem("boisson", bouton.textContent.trim()); // on mémorise la boisson choisie
  });
});

// "Ajouter le menu à ma commande" : fin du parcours du menu
boutonAjouter.addEventListener("click", () => {
  if (!sessionStorage.getItem("boisson")) return; // on ne peut ajouter le menu que si une boisson est choisie

  console.log(
    sessionStorage.getItem("tailleMenu"),
    sessionStorage.getItem("accompagnement"),
    sessionStorage.getItem("boisson"),
  ); // test : affiche les trois choix (à supprimer plus tard)

  overlay3.style.display = "none"; // on ferme l'overlay 3 après avoir ajouté le menu
});

// ============================================================
//  8. OVERLAY 4 : BOISSON SEULE (TAILLE ET QUANTITÉ)
// ============================================================

// La croix et "Annuler" ferment l'overlay
boutonFermer4.addEventListener("click", () => {
  overlay4.style.display = "none";
});

boutonAnnuler4.addEventListener("click", () => {
  overlay4.style.display = "none";
});

// Choix de la taille : cadre orange + mémorisation du choix
boutonsTailleBoisson.forEach((bouton) => {
  bouton.addEventListener("click", () => {
    boutonsTailleBoisson.forEach((el) => el.classList.remove("actif"));
    bouton.classList.add("actif");

    const texte = bouton
      .querySelector(".text-choose-water-size")
      .textContent.trim();
    sessionStorage.setItem("tailleBoisson", texte); // "30 cl" ou "50 cl"
  });
});

// Bouton + : ajoute 1 à la quantité
boutonPlus.addEventListener("click", () => {
  quantite++;
  quantiteAffichee.textContent = quantite;
});

// Bouton - : enlève 1 à la quantité, sans descendre sous 1
boutonMoins.addEventListener("click", () => {
  if (quantite > 1) {
    quantite--;
    quantiteAffichee.textContent = quantite;
  }
});

// "Ajouter à ma commande" : mémorise la quantité et ferme l'overlay
boutonAjouter4.addEventListener("click", () => {
  if (!sessionStorage.getItem("tailleBoisson")) return; // aucune taille choisie : on ne fait rien
  sessionStorage.setItem("quantiteBoisson", quantite);

  console.log( // affiche la taille et la quantité de la boisson
    sessionStorage.getItem("boissonChoisie"),
    sessionStorage.getItem("tailleBoisson"),
    sessionStorage.getItem("quantiteBoisson"),
  ); // test : affiche la boisson, la taille et la quantité (à supprimer plus tard)

  overlay4.style.display = "none";
});

// ============================================================
//  9. DÉFILEMENT DES SLIDERS
//  scrollBy fait défiler la zone : un nombre positif va vers la droite,
//  un nombre négatif (-pas) va vers la gauche.
// ============================================================

// --- Slider des catégories ---
flecheDroite.addEventListener("click", () => {
  zoneSlider.scrollBy({ left: pas });
});

flecheGauche.addEventListener("click", () => {
  zoneSlider.scrollBy({ left: -pas });
});

// --- Slider des boissons de l'overlay 3 ---
flecheBoissonDroite.addEventListener("click", () => {
  sliderBoissons.scrollBy({ left: pasBoissons });
});

flecheBoissonGauche.addEventListener("click", () => {
  sliderBoissons.scrollBy({ left: -pasBoissons });
});