// ============================================================
//  CHOIX-MENU.JS : page de choix des produits de la borne Wacdo
//
//  Plan du fichier :
//   1. Les éléments de la page
//   2. Les variables et les réglages
//   3. Les fonctions
//        - remise à zéro des choix
//        - le panier : calcul des prix
//        - le panier : ajouter, supprimer, vider, afficher
//        - les produits
//   4. Chargement des données (catégories et produits)
//   5. Overlay 1 : taille du menu
//   6. Overlay 2 : accompagnement
//   7. Overlay 3 : boisson du menu
//   8. Overlay 4 : boisson seule (taille et quantité)
//   9. Le bouton "Abandon" du panier
//  10. Défilement des sliders
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

// --- Panier (colonne de droite) ---
const listePanier = document.querySelector("#liste-panier");
const totalPrix = document.querySelector("#total-prix");
const boutonAbandon = document.querySelector("#abandon");

// --- Mode de commande choisi sur la page d'accueil ---
const modeCommande = sessionStorage.getItem("modeCommande");
console.log(modeCommande); // Test dans console log , affiche "sur place" ou "a emporter"

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

// Le panier : une liste d'objets (menus et produits choisis par le client).
// Chaque objet contient : type, nom, prix, options et quantité.
// Si un panier existe déjà dans le sessionStorage, on le récupère, sinon on part d'une liste vide.
let panier = JSON.parse(sessionStorage.getItem("panier")) || []; 
                                                  //JSON.parse veut dire convertir une chaîne JSON ( en texte ) en objet JavaScript
                                                                  // || veut dire "ou", [] veut dire "nul" (liste vide)

// Le produit sur lequel le client vient de cliquer (utilisé par les overlays)
let produitChoisi = null; // null signifie qu'aucun produit n'est choisi au départ

// Quantité choisie dans l'overlay 4 (1 par défaut)
let quantite = 1;

// Les suppléments de prix, en euros, selon l'option choisie.
// Pour ajouter un supplément, il suffit d'ajouter une ligne ici.
const supplements = { // est un objet qui contient les suppléments de prix
  "50 cl": 0.5, // grande boisson : +0.50€
  "Menu Maxi Best Of": 2, // Menu Maxi Best Of : +2€
};

// Distance de défilement à chaque clic sur une flèche, en pixels
const pas = 100; // slider des catégories
const pasBoissons = 185; // slider des boissons : largeur d'un bouton (175) + espace (10)

// ============================================================
//  3. LES FONCTIONS
//  Une fonction est un bloc de code mis de côté.
//  Elle ne s'exécute que lorsqu'on l'appelle par son nom.
// ============================================================

// --- Remise à zéro des choix ---

// Remet à zéro les choix du menu (cadres orange et mémoire)quand on ouvre l'overlay du menu
function reinitialiserChoix() {
  boutonsTaille.forEach((el) => el.classList.remove("actif")); //el veut dire élément en cours et on retire la classe "actif"
  boutonsAccompagnement.forEach((el) => el.classList.remove("actif"));
  boutonsBoisson.forEach((el) => el.classList.remove("actif"));
  sessionStorage.removeItem("tailleMenu"); //supprime la mémoire dans le sessionStorage
  sessionStorage.removeItem("accompagnement");
  sessionStorage.removeItem("boisson");
}

// Remet à zéro l'overlay 4 (cadre orange, mémoire et quantité)
function reinitialiserBoisson() {
  boutonsTailleBoisson.forEach((el) => el.classList.remove("actif"));
  sessionStorage.removeItem("tailleBoisson");
  quantite = 1;
  quantiteAffichee.textContent = quantite; // affiche la quantité dans l'overlay 4
}

// --- Le panier : calcul des prix ---

// Additionne les suppléments des options d'un article (par exemple +0.50€ pour "50 cl")
function calculerSupplement(options = {}) {
  let supplement = 0;

  // Object.values(options) transforme les valeurs d’un objet en liste. Avec { taille: "50 cl" }, tu obtiens ["50 cl"]. Avec un menu, ["Menu Best Of", "Frites", "Coca-Cola"].
  Object.values(options).forEach((valeur) => { // forEach parcourt chaque valeur 
    if (supplements[valeur]) { // si la valeur correspond à un supplément comme dans l'objet "supplements"
      supplement += supplements[valeur]; // on ajoute ce supplément au total
    }
  });

  return supplement; // renvoie dans la variable supplement la valeur totale des suppléments
}

// Prix d'une ligne du panier : (prix + suppléments) x quantité
function calculerPrixArticle(article) {
  return (
    (Number(article.prix) + calculerSupplement(article.options)) *
    article.quantite
  );
}

// Prix total du panier : on additionne le prix de chaque ligne
function calculerTotal() {
  let total = 0;
  panier.forEach((article) => {
    total += calculerPrixArticle(article);
  });
  return total;
}

// --- Le panier : ajouter, supprimer, vider, afficher ---

// Ajoute un article au panier.
// options et quantite sont facultatifs : sans valeur donnée, ils valent {} et 1.
function ajouterAuPanier(type, nom, prix, options = {}, quantite = 1) {
  // cet article (même type, même nom, mêmes options) est-il déjà dans le panier ?
  const articleExistant = panier.find(
    (article) =>
      article.type === type &&
      article.nom === nom &&
      JSON.stringify(article.options) === JSON.stringify(options), // on compare les options en les transformant en texte
  );

  if (articleExistant) {
    articleExistant.quantite += quantite; // oui : on ajoute à sa quantité
  } else {
    panier.push({
      type: type,
      nom: nom,
      prix: prix,
      options: options,
      quantite: quantite,
    }); // non : nouvel objet dans le panier
  }

  sessionStorage.setItem("panier", JSON.stringify(panier)); // on range le panier, converti en texte
  afficherPanier(); // on met l'affichage à jour
}

// Supprime la ligne du panier qui se trouve à la position "index"
function supprimerDuPanier(index) {
  panier.splice(index, 1); // enlève 1 élément à partir de cette position
  sessionStorage.setItem("panier", JSON.stringify(panier));
  afficherPanier();
}

// Vide entièrement le panier (utilisé par le bouton "Abandon")
function viderPanier() {
  panier = []; // le panier devient une liste vide
  sessionStorage.removeItem("panier"); // on efface aussi le panier enregistré
  afficherPanier(); // l'affichage et le total repassent à zéro
}

// Dessine le panier dans la page et met à jour le total
function afficherPanier() {
  listePanier.innerHTML = ""; // on vide l'affichage avant de le redessiner

  // index = la position de l'article dans le panier (0, 1, 2...)
  panier.forEach((article, index) => {
    const ligne = document.createElement("div");
    ligne.classList.add("ligne-panier");
    ligne.innerHTML = `
      <div class="ligne-haut">
        <span>${article.quantite} x ${article.nom}</span>
        <span>${calculerPrixArticle(article).toFixed(2)}€</span>
      </div>
      <div class="ligne-details">${Object.values(article.options || {}).join(", ")}</div>
    `;

    // le bouton poubelle de la ligne
    const boutonSupprimer = document.createElement("button");
    boutonSupprimer.classList.add("bouton-supprimer");
    boutonSupprimer.innerHTML =
      '<img src="asset/images/trash.png" alt="Supprimer" />';
    boutonSupprimer.title = "Supprimer";
    boutonSupprimer.addEventListener("click", () => {
      supprimerDuPanier(index);
    });

    ligne.appendChild(boutonSupprimer);
    listePanier.appendChild(ligne);
  });

  // on met à jour le total (toFixed(2) affiche toujours deux décimales)
  totalPrix.textContent = `${calculerTotal().toFixed(2)}€`;
}

// --- Les produits ---

// Affiche les produits d'une catégorie (par exemple "menus" ou "boissons")
function afficherProduits(categorie) {
  choixBurger.innerHTML = ""; // on vide la zone avant de la remplir

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

      produitChoisi = produit; // on retient le produit cliqué

      // 2. selon la catégorie, on ouvre un overlay ou on ajoute au panier
      if (categorie === "menus") {
        reinitialiserChoix();
        overlay.style.display = "block"; // overlay 1 pour les menus
      } else if (categorie === "boissons") {
        reinitialiserBoisson();
        imgTaille1.src = `asset/${produit.image}`; // l'overlay affiche l'image de cette boisson
        imgTaille2.src = `asset/${produit.image}`;
        overlay4.style.display = "block"; // overlay 4 pour les boissons
      } else {
        ajouterAuPanier("produit", produit.nom, produit.prix); // un clic = ajouté au panier
      }
    });

    choixBurger.appendChild(bouton); // la carte apparaît dans la page
  });
}

// ============================================================
//  4. CHARGEMENT DES DONNÉES
//  fetch va chercher un fichier JSON. La réponse arrive plus tard,
//  donc tout ce qui a besoin des données se trouve dans les .then
// ============================================================

// --- On affiche le panier déjà enregistré (si la page est actualisée) ---
afficherPanier();

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
  if (!sessionStorage.getItem("tailleMenu")) return;
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
  if (!sessionStorage.getItem("accompagnement")) return;
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
    sessionStorage.setItem("boisson", bouton.textContent.trim());
  });
});

// "Ajouter le menu à ma commande" : le menu et ses trois choix vont dans le panier
boutonAjouter.addEventListener("click", () => {
  if (!sessionStorage.getItem("boisson")) return; // aucune boisson choisie : on ne fait rien

  ajouterAuPanier("menu", produitChoisi.nom, produitChoisi.prix, {
    taille: sessionStorage.getItem("tailleMenu"),
    accompagnement: sessionStorage.getItem("accompagnement"),
    boisson: sessionStorage.getItem("boisson"),
  });

  overlay3.style.display = "none";
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

// "Ajouter à ma commande" : la boisson, sa taille et sa quantité vont dans le panier.
// Le supplément du 50 cl n'est pas ajouté ici : il est calculé avec le tableau "supplements".
boutonAjouter4.addEventListener("click", () => {
  const taille = sessionStorage.getItem("tailleBoisson");
  if (!taille) return; // aucune taille choisie : on ne fait rien

  ajouterAuPanier(
    "produit",
    produitChoisi.nom,
    produitChoisi.prix,
    { taille: taille },
    quantite,
  );

  overlay4.style.display = "none";
});

// ============================================================
//  9. LE BOUTON "ABANDON" DU PANIER
// ============================================================

// "Abandon" : on demande confirmation, puis on vide le panier
boutonAbandon.addEventListener("click", () => {
  if (confirm("Voulez-vous vraiment abandonner votre commande ?")) {
    viderPanier();
  }
});

// ============================================================
//  10. DÉFILEMENT DES SLIDERS
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

