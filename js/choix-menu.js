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

// Les suppléments de prix
// Pour ajouter un supplément, il suffit d'ajouter une ligne dans la constante "supplements"
const supplements = {
  // est un objet car il y a les {  } qui contient les suppléments de prix
  "50 cl": 0.5, // grande boisson : +0.50€
  "Menu Maxi Best Of": 2, // Menu Maxi Best Of : +2€
};

// Distance de défilement à chaque clic sur une flèche, en pixels
const pas = 185; // slider des catégories
const pasBoissons = 185; // slider des boissons

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

  // Object.values(options) transforme les valeurs d’un objet en liste. Avec { taille: "50 cl" }, tu obtiens ["50 cl"].
  // Avec un menu, ["Menu Best Of", "Frites", "Coca-Cola"].
  Object.values(options).forEach((valeur) => {
    // forEach parcourt chaque valeur
    if (supplements[valeur]) {
      // si la valeur correspond à un supplément comme dans l'objet "supplements"
      supplement += supplements[valeur]; // on ajoute ce supplément au total des suppléments
    }
  });

  return supplement; // renvoie le résulat a celui qui a appelé la fonction
}

// Prix d'une ligne du panier : (prix + suppléments) x quantité
function calculerPrixArticle(article) {
  //Lorsqu'on fait appel à cette fonction, on lui passe un article et elle renvoie son prix total (prix + suppléments) x quantité
  return (
    // on lui revoie le prix total calculé ci-dessous
    (Number(article.prix) + calculerSupplement(article.options)) *
    article.quantite // nombre articles+suppléments* quantité
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
// type : "menu", "burger", "boisson", ...
// nom : nom de l'article
// prix : prix de base de l'article
// options : objet des options choisies (taille, accompagnement, boisson, ...)
// quantite : nombre d'articles à ajouter (par défaut 1)
function ajouterAuPanier(type, nom, prix, options = {}, quantite = 1) {
  //si même type, même nom, mêmes options) est-il déjà dans le panier ?
  const articleExistant = panier.find(
    // find parcourt le panier et renvoie le premier article qui respecte la condition ci-dessous
    (article) =>
      article.type === type && // compare le type de l'article et
      article.nom === nom && // compare le nom de l'article et
      JSON.stringify(article.options) === JSON.stringify(options), // compare les options transformé en texte
  ); //car les objets ne sont pas directement comparables en brut , il faut le convertir avec JSON.stringify

  if (articleExistant) {
    // si articleExistant est vrai
    articleExistant.quantite += quantite; // oui : on ajoute à sa quantité
  } else {
    // sinon
    panier.push({
      // on ajoute (push) un nouvel objet dans le panier (type, nom, prix, options, quantite)
      type: type,
      nom: nom,
      prix: prix,
      options: options,
      quantite: quantite,
    });
  }

  sessionStorage.setItem("panier", JSON.stringify(panier)); // on stocke le panier, converti en texte via JSON.stringify
  afficherPanier(); // on met l'affichage à jour
}

// Supprime la ligne du panier
function supprimerDuPanier(index) {
  // index est une variable représentant la position de l'article dans le panier (0, 1, 2...)
  panier.splice(index, 1); // index = la position de l'article à supprimer, 1 = nombre d'éléments à supprimer
  //Exemple : panier.splice(1, 1), on enlève 1 élément à partir de la position 1 :
  //     Avant	          Après
  // 0 : Big Mac	        0 : Big Mac
  // 1 : Menu Big Mac	    (supprimé)
  // 2 : Fanta Orange	    1 : Fanta Orange
  sessionStorage.setItem("panier", JSON.stringify(panier)); //on enregistre le panier mis à jour dans le sessionStorage
  afficherPanier(); // on met l'affichage à jour après suppression
}

// Vide entièrement le panier (utilisé par le bouton "Abandon")
function viderPanier() {
  // () veut dire qu'on n'a pas besoin de paramètre pour cette fonction
  panier = []; // le panier devient une liste vide
  sessionStorage.removeItem("panier"); // on efface aussi le panier enregistré
  afficherPanier(); // l'affichage et le total repassent à zéro
}

// Dessine le panier dans la page et met à jour le total
function afficherPanier() {
  listePanier.innerHTML = ""; // on vide l'affichage avec "" (texte vide)

  panier.forEach((article, index) => {
    //pour chaque article et position index (0, 1, 2...) dans le panier
    const ligne = document.createElement("div"); // créé une div en mémoire dans la constante "ligne"
    ligne.classList.add("ligne-panier"); // on ajoute la classe CSS "ligne-panier" à la div

    //---------------------------------------------------------------------------------------------------------------------------//
    // On écrit dans la div "ligne" le contenu HTML représentant l'article du panier

    // Les accents graves (`) créent un texte sur plusieurs lignes.
    // Les expressions ${...} insèrent des valeurs, par exemple article.nom ( "Big Mac") ou calculerPrixArticle(article) ( 5.99)
    // toFixed(2) permet d'afficher toujours deux décimales pour le prix
    // Object.values est une méthode JavaScript qui récupère toutes les valeurs d'un objet sous forme de tableau.
    // et .join(", ") les colles en un seul texte séparé par des virgules :
    //  Exemple : "Menu Best Of, Frites, Coca-Cola".
    ligne.innerHTML = `
      <div class="ligne-haut">
        <span>${article.quantite} x ${article.nom}</span>
        <span>${calculerPrixArticle(article).toFixed(2)}€</span> 
      </div>
      <div class="ligne-details">${Object.values(article.options || {}).join(", ")}</div>
    `;
    //----------------------------------------------------------------------------------------------------------------------------//

    // le bouton poubelle de la ligne
    const boutonSupprimer = document.createElement("button"); // création de la constante
    boutonSupprimer.classList.add("bouton-supprimer"); // on ajoute la classe CSS "bouton-supprimer"
    boutonSupprimer.innerHTML =
      '<img src="asset/images/trash.png" alt="Supprimer" />'; // création image + alt
    boutonSupprimer.title = "Supprimer"; // infobulle au survol du bouton
    boutonSupprimer.addEventListener("click", () => {
      // au clic sur le bouton, on supprime l'article du panier
      supprimerDuPanier(index);
      //Au clic, on supprime l’article de sa position. Chaque bouton est créé dans un tour différent de la boucle,
      //donc il « se souvient » de son propre index : la première poubelle supprime la position 0, la deuxième la position 1, etc.
    });

    ligne.appendChild(boutonSupprimer); // affiche le bouton poubelle dans la ligne du panier
    listePanier.appendChild(ligne); // affiche la ligne dans la liste du panier
    //appendChild accroche un élément à la fin d’un autre. Le bouton rejoint sa ligne, puis la ligne rejoint le panier.
    // C’est à ce moment qu’ils deviennent visibles : tant qu’un élément n’est pas accroché à la page, il n’existe qu’en mémoire.
  });

  // on met à jour le total (toFixed(2) affiche toujours deux décimales)
  totalPrix.textContent = `${calculerTotal().toFixed(2)}€`;
}

// --- Les produits ---

// Affiche les produits d'une catégorie (par exemple "menus" ou "boissons")
function afficherProduits(categorie) {
  //La fonction reçoit le nom d’une catégorie (par exemple "boissons")
  choixBurger.innerHTML = ""; // on vide la zone avant de la remplir

  // pour chaque produit de la catégorie, on crée une carte
  produits[categorie].forEach((produit) => {
    //produits[categorie] ouvre la case de l’objet produits dont le nom est dans categorie
    const bouton = document.createElement("button"); // on crée un bouton pour chaque produit
    bouton.classList.add("card-products"); // on ajoute la classe CSS "card-products" au bouton
    // on remplit le bouton avec l'image, le nom et le prix du produit
    bouton.innerHTML = `
      <img class="img-card-products" src="asset/${produit.image}" alt="${produit.nom}" />
      <span class="text-choose-burgers">${produit.nom}</span>
      <span class="price-choose-burgers">${produit.prix}€</span>
    `;

    // au clic sur la carte
    bouton.addEventListener("mouseover", () => {
      bouton.style.border = "7px solid #ffc836";
    });

    bouton.addEventListener("mouseout", () => {
      bouton.style.border = "";
    });
    bouton.addEventListener("click", () => {
      // 1. le cadre orange passe sur la carte cliquée
      document
        .querySelectorAll(".card-products")
        .forEach((el) => el.classList.remove("actif")); // on retire le cadre orange de toutes les cartes
      bouton.classList.add("actif"); // on ajoute le cadre orange à la carte cliquée

      produitChoisi = produit; // on assigne le produit cliqué à produitChoisi, qui est la variable avec la valeur null au départ

      // 2. selon la catégorie, on ouvre un overlay ou on ajoute au panier
      if (categorie === "menus") {
        // si c'est un menu, on ouvre l'overlay pour choisir les options
        reinitialiserChoix(); // on réinitialise les choix du menu avant d'afficher l'overlay
        overlay.style.display = "block"; // overlay 1 s'affichepour les menus
      } else if (categorie === "boissons") {
        // si c'est une boisson, on ouvre l'overlay pour choisir la taille
        reinitialiserBoisson(); // on réinitialise les choix de la boisson avant d'afficher l'overlay
        imgTaille1.src = `asset/${produit.image}`; // l'overlay affiche l'image de cette boisson
        imgTaille2.src = `asset/${produit.image}`; // l'overlay affiche l'image de cette boisson aussi
        overlay4.style.display = "block"; // overlay 4 s'affiche pour les boissons
      } else {
        // si ce n'est ni un menu ni une boisson, on ajoute directement au panier
        ajouterAuPanier("produit", produit.nom, produit.prix); // un clic = ajouté au panier
      }
    });

    choixBurger.appendChild(bouton); // la carte apparaît dans la page
  }); // fin de forEach sur les produits
} // fin de la fonction afficherProduits

// ============================================================
//  4. CHARGEMENT DES DONNÉES
//  fetch va chercher un fichier JSON. La réponse arrive plus tard,
//  donc tout ce qui a besoin des données se trouve dans les .then
// ============================================================

// --- On appelle la fonction au chargement de la page : si un panier était déjà enregistré, il s’affiche tout de suite. ---
afficherPanier();

// --- Les catégories : on crée un bouton par catégorie dans le slider ---
fetch("data/categories.json") // on va chercher les catégories dans le fichier JSON
  .then((response) => response.json()) // signifie « puis, quand la réponse arrive, convertis-la en données JavaScript ».
  .then((data) => {
    // signifie « puis, avec ces données, fais ceci ». data est une variable temporaire.
    categories = data; // on stocke les catégories dans la variable

    categories.forEach((categorie) => {
      const bouton = document.createElement("button"); // on créé un bouton par catégorie
      bouton.classList.add("elements-slider"); // on ajoute la classe pour le style du slider
      // on met le contenu HTML du bouton : image + titre
      // Même principe que pour les cartes produit
      bouton.innerHTML = `
        <img class="img-elements-slider" src="asset/${categorie.image}" alt="${categorie.title}" />
        <span class="text-elements-slider">${categorie.title}</span>
      `;

      // le cadre orange est sur "menus" au chargement de la page
      if (categorie.title === "menus") {
        bouton.classList.add("actif");
      }

      // au clic sur la catégorie
      bouton.addEventListener("mouseover", () => {
        bouton.style.border = "7px solid #ffc836";
      });

      bouton.addEventListener("mouseout", () => {
        bouton.style.border = "";
      });
      bouton.addEventListener("click", () => {
        // 1. le cadre orange passe sur le bouton cliqué
        document
          .querySelectorAll(".elements-slider")
          .forEach((el) => el.classList.remove("actif")); // on retire le cadre orange de tous les boutons
        bouton.classList.add("actif"); // on met le cadre orange sur le bouton cliqué

        // 2. on affiche les produits de cette catégorie
        afficherProduits(categorie.title);
      });

      zoneSlider.appendChild(bouton); // le bouton apparaît dans le slider
    });
  })
  //.catch attrape n’importe quelle erreur de la chaîne et l'affiche en rouge dans la console.
  .catch((error) => {
    console.error("Erreur lors du chargement des catégories :", error);
  });

//On appelle le fichier produits.json. On range les données dans produits, puis on affiche les produits de la catégorie « menus »
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
  bouton.addEventListener("mouseover", () => {
    bouton.style.border = "7px solid #ffc836";
  });

  bouton.addEventListener("mouseout", () => {
    bouton.style.border = "";
  });
  bouton.addEventListener("click", () => {
    boutonsTaille.forEach((el) => el.classList.remove("actif"));
    bouton.classList.add("actif");

    const texte = bouton
      .querySelector(".text-choose-burgers-size")
      .textContent.trim(); // on récupère le texte de la taille choisie, trim enlève les espaces superflus
    sessionStorage.setItem("tailleMenu", texte); // on mémorise le choix dans le sessionStorage,
    // on pourra ensuite récupérer ce choix avec sessionStorage.getItem("tailleMenu")
    //setItem prend le nom de la case, puis la valeur.
  });
}); // fin du choix de la taille du menu/ overlay 1

// "Etape suivante" : passe à l'overlay 2 (seulement si une taille est choisie)
boutonSuivant.addEventListener("click", () => {
  if (!sessionStorage.getItem("tailleMenu")) return;
  overlay.style.display = "none";
  overlay2.style.display = "block";
  // ! veut dire « pas ». !sessionStorage.getItem("tailleMenu") est vrai quand la case est vide (null).
  // return arrête la fonction à cet endroit : si aucune taille n’est choisie, rien ne se passe.
  // Sinon, on cache l’overlay 1 et on affiche l’overlay 2.
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
  bouton.addEventListener("mouseover", () => {
    bouton.style.border = "7px solid #ffc836";
  });

  bouton.addEventListener("mouseout", () => {
    bouton.style.border = "";
  });
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
  bouton.addEventListener("mouseover", () => {
    bouton.style.border = "7px solid #ffc836";
  });

  bouton.addEventListener("mouseout", () => {
    bouton.style.border = "";
  });
  bouton.addEventListener("click", () => {
    boutonsBoisson.forEach((el) => el.classList.remove("actif"));
    bouton.classList.add("actif");
    sessionStorage.setItem("boisson", bouton.textContent.trim());
  });
});

// "Ajouter le menu à ma commande" : le menu et ses trois choix vont dans le panier
boutonAjouter.addEventListener("click", () => {
  // au clic sur "Ajouter le menu à ma commande"
  if (!sessionStorage.getItem("boisson")) return; // aucune boisson choisie : on ne fait rien

  ajouterAuPanier("menu", produitChoisi.nom, produitChoisi.prix, {
    taille: sessionStorage.getItem("tailleMenu"),
    accompagnement: sessionStorage.getItem("accompagnement"),
    boisson: sessionStorage.getItem("boisson"),
  });
  // On appelle ajouterAuPanier avec quatre valeurs : le type "menu", le nom et le prix du menu cliqué (retenus dans produitChoisi),
  // puis un objet { ... } qui rassemble les trois choix lus dans la mémoire.
  // la quantité vaut 1 par défaut, car on ne propose pas de choix de quantité pour le menu.
  // On ferme l'overlay 3 après avoir ajouté le menu au panier.
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
  bouton.addEventListener("mouseover", () => {
    bouton.style.border = "7px solid #ffc836";
  });

  bouton.addEventListener("mouseout", () => {
    bouton.style.border = "";
  });
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
  quantite++; //quantite++ ajoute 1 à la variable. Puis on écrit la nouvelle valeur dans le chiffre affiché.
  quantiteAffichee.textContent = quantite;
});

// Bouton - : enlève 1 à la quantité, sans descendre sous 1
boutonMoins.addEventListener("click", () => {
  if (quantite > 1) {
    // empêche la quantité de descendre en dessous de 1
    quantite--; //quantite-- enlève 1 à la variable. Puis on écrit la nouvelle valeur dans le chiffre affiché.
    quantiteAffichee.textContent = quantite; // met à jour l'affichage de la quantité
  }
});

// "Ajouter à ma commande" :
// On lit la taille de la boisson choisie, et on s’arrête si elle est vide.
// Sinon, on ajoute la boisson au panier avec cinq valeurs :
// le type, le nom, le prix de base, les options ({ taille: taille }) et la quantité (la variable quantite).
// Le supplément de 0.50€ n’est pas ajouté ici : c’est calculerSupplement qui l’ajoute à l’affichage, grâce au tableau supplements.
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

  overlay4.style.display = "none"; // ferme l'overlay après ajout au panier
});

// ============================================================
//  9. LE BOUTON "ABANDON" DU PANIER
// ============================================================

// "Abandon" : on demande confirmation, puis on vide le panier
boutonAbandon.addEventListener("click", () => {
  if (confirm("Voulez-vous vraiment abandonner votre commande ?")) {
    // affiche un pop-up de confirmation
    viderPanier(); // vide le panier si l'utilisateur confirme l'abandon, sinon ne fait rien
  }
});

// ============================================================
//  10. DÉFILEMENT DES SLIDERS
//  scrollBy fait défiler la zone : un nombre positif va vers la droite,
//  un nombre négatif (-pas) va vers la gauche.
// ============================================================

// --- Sliders ---
// left veut dire décalage horizontal du scroll imposé par scrollBy
// ( info top = décalage vertical du scroll et smooth = défilement fluide qu'on utilise deja dans le CSS scroll-behavior: smooth )
// pas et pasBoissons sont les constantes qu'on avait déjà définies pour le défilement des sliders à 185pixels
flecheDroite.addEventListener("click", () => {
  zoneSlider.scrollBy({ left: pas }); // fait défiler le slider des catégories vers la droite
});

flecheGauche.addEventListener("click", () => {
  zoneSlider.scrollBy({ left: -pas }); // fait défiler le slider des catégories vers la gauche
});

// --- Slider des boissons de l'overlay 3 ---
flecheBoissonDroite.addEventListener("click", () => {
  sliderBoissons.scrollBy({ left: pasBoissons }); // fait défiler le slider des boissons vers la droite
});

flecheBoissonGauche.addEventListener("click", () => {
  sliderBoissons.scrollBy({ left: -pasBoissons }); // fait défiler le slider des boissons vers la gauche
});
