// On récupère les éléments de la page html //
const zoneSlider = document.querySelector(".zone-contenu-scroll");
const choixBurger = document.querySelector("#choose-burgers");
const flecheGauche = document.querySelector(".fleche-slider-left");
const flecheDroite = document.querySelector(".fleche-slider-right");
const modeCommande = sessionStorage.getItem("modeCommande"); // on stock le choix dans sessionStorage (sur place ou à emporter)
console.log(modeCommande); // affiche le choixqu'on a stocké dans le sessionStorage"
const overlay = document.querySelector("#overlay");
const boutonFermer = document.querySelector("#button-close");
const overlay2 = document.querySelector("#overlay2");
const boutonsTaille = document.querySelectorAll(
  "#overlay .choose1, #overlay .choose2",
);
const boutonSuivant = document.querySelector("#next");
const boutonFermer2 = document.querySelector("#button-close2");
const boutonRetour2 = document.querySelector("#button-return2");
const overlay3 = document.querySelector("#overlay3");
const boutonsAccompagnement = document.querySelectorAll(
  "#overlay2 .choose1, #overlay2 .choose2",
);
const boutonSuivant1 = document.querySelector("#next1");
const boutonFermer3 = document.querySelector("#button-close3");
const boutonRetour3 = document.querySelector("#button-return3");
const boutonsBoisson = document.querySelectorAll("#overlay3 .drink");
const boutonAjouter = document.querySelector("#add-to-order");
// fin de la récupération des éléments de la page //

// création d'une variable pour stocker les catégories et les produits //
let categories = []; // variable pour stocker les catégories [] pour stocker un tableau
let produits = {}; // variable pour stocker les produits par catégorie {} pour stocker un objet

// création d'une fonction pour afficher les élements selon les catégories dans le fichier produits.json //
function afficherProduits(categorie) {
  choixBurger.innerHTML = "";
  produits[categorie].forEach((produit) => {
    const bouton = document.createElement("button");
    bouton.classList.add("card-products");
    bouton.innerHTML = `
                  <img class="img-card-products" src="asset/${produit.image}" alt="${produit.nom}" />
                    <span class="text-choose-burgers">${produit.nom}</span>
                    <span class="price-choose-burgers">${produit.prix}€</span>
              `;

    // fonction pour réinitialiser les choix des menus
    function reinitialiserChoix() {
      boutonsTaille.forEach((el) => el.classList.remove("actif")); // on retire la classe actif des boutons de taille
      boutonsAccompagnement.forEach((el) => el.classList.remove("actif")); // on retire la classe actif des boutons d'accompagnement
      boutonsBoisson.forEach((el) => el.classList.remove("actif")); // on retire la classe actif des boutons de boisson
      sessionStorage.removeItem("tailleMenu"); // on supprime le choix de taille du menu dans le sessionStorage
      sessionStorage.removeItem("accompagnement"); // on supprime le choix d'accompagnement dans le sessionStorage
      sessionStorage.removeItem("boisson"); // on supprime le choix de boisson dans le sessionStorage
    }

    // au clic, le cadre actif passe sur la carte cliquée
    bouton.addEventListener("click", () => {
      document
        .querySelectorAll(".card-products")
        .forEach((el) => el.classList.remove("actif"));
      bouton.classList.add("actif");
      if (categorie === "menus") {
        reinitialiserChoix(); // on efface les choix précédents (garde le nom que tu as dans ton fichier)
        overlay.style.display = "block"; // l'overlay ne s'ouvre que pour les menus
      }
    });

    choixBurger.appendChild(bouton);
  });
}

// récupération des catégories depuis le fichier JSON //

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
      if (categorie.title === "menus") {
        // mettre le cadre actif par défaut sur menus
        bouton.classList.add("actif");
      }
      bouton.addEventListener("click", () => {
        // affiche le cadre actif sur le bouton cliqué
        afficherProduits(categorie.title);
      });
      bouton.addEventListener("click", () => {
        document
          .querySelectorAll(".elements-slider")
          .forEach((el) => el.classList.remove("actif"));
        bouton.classList.add("actif");
      });

      zoneSlider.appendChild(bouton); // fait apparaître le bouton dans le slider
    });
  })
  .catch((error) => {
    console.error("Erreur lors du chargement des catégories :", error);
  });

// récupération des produits depuis le fichier JSON //

fetch("data/produits.json")
  .then((response) => response.json())
  .then((data) => {
    produits = data;
    afficherProduits("menus"); // affiche les produits de la catégorie "menus" par défaut
  })
  .catch((error) => {
    console.error("Erreur lors du chargement des produits :", error);
  });

// fermeture de l'overlay quand on clique sur le bouton de fermeture X

boutonFermer.addEventListener("click", () => {
  overlay.style.display = "none";
});
// choix de la taille du menu dans l'overlay 1 //

boutonsTaille.forEach((bouton) => {
  bouton.addEventListener("click", () => {
    // le cadre orange passe sur le bouton cliqué
    boutonsTaille.forEach((el) => el.classList.remove("actif"));
    bouton.classList.add("actif");

    // on mémorise le choix
    const texte = bouton
      .querySelector(".text-choose-burgers-size")
      .textContent.trim();
    sessionStorage.setItem("tailleMenu", texte);
    console.log("Taille du menu sélectionnée :", texte);
  });
});

// bouton "Etape suivante" : passe de l'overlay 1 à l'overlay 2 //

boutonSuivant.addEventListener("click", () => {
  if (!sessionStorage.getItem("tailleMenu")) return; // aucun choix : on ne fait rien
  overlay.style.display = "none";
  overlay2.style.display = "block";
});

// overlay 2 : fermer et revenir en arrière //

boutonFermer2.addEventListener("click", () => {
  overlay2.style.display = "none";
});

boutonRetour2.addEventListener("click", () => {
  // quand on appuie sur le bouton retour
  overlay2.style.display = "none"; // overlay 2 fermé pour revenir à l'overlay
  overlay.style.display = "block"; // le choix et le cadre orange sont conservés
});

// choix de l'accompagnement dans l'overlay 2 //

boutonsAccompagnement.forEach((bouton) => {
  bouton.addEventListener("click", () => {
    // le cadre orange passe sur le bouton cliqué

    boutonsAccompagnement.forEach((el) => el.classList.remove("actif"));
    bouton.classList.add("actif");

    // on mémorise le choix (le texte du bouton)
    const texte = bouton
      .querySelector(".text-choose-burgers-size")
      .textContent.trim();
    sessionStorage.setItem("accompagnement", texte);
    console.log("Accompagnement sélectionné :", texte);
  });
});

// bouton "Etape suivante" : passe de l'overlay 2 à l'overlay 3 //

boutonSuivant1.addEventListener("click", () => {
  if (!sessionStorage.getItem("accompagnement")) return; // aucun choix : on ne fait rien
  overlay2.style.display = "none";
  overlay3.style.display = "block";
});

// overlay 3 : fermer et revenir en arrière //

boutonFermer3.addEventListener("click", () => {
  overlay3.style.display = "none";
});

boutonRetour3.addEventListener("click", () => {
  // quand on appuie sur le bouton retour
  overlay3.style.display = "none";
  overlay2.style.display = "block"; // le choix et le cadre orange sont conservés
});

// choix de la boisson dans l'overlay 3 //
boutonsBoisson.forEach((bouton) => {
  bouton.addEventListener("click", () => {
    // le cadre orange passe sur le bouton cliqué
    boutonsBoisson.forEach((el) => el.classList.remove("actif"));
    bouton.classList.add("actif");

    // on mémorise le choix (le texte du bouton, sans l'image)

    const texte = bouton.textContent.trim();
    sessionStorage.setItem("boisson", texte);
    console.log("Boisson sélectionnée :", texte);
  });
});

// bouton "Ajouter le menu à ma commande" avec mémorisation des choix et retour au début //

boutonAjouter.addEventListener("click", () => {
  if (!sessionStorage.getItem("boisson")) return; // aucun choix : on ne fait rien

  console.log(
    sessionStorage.getItem("tailleMenu"),
    sessionStorage.getItem("accompagnement"),
    sessionStorage.getItem("boisson"),
  ); // affiche les trois choix pour vérifier

  overlay3.style.display = "none";
});

//défilement du slider des catégories //

const pas = 100; // distance de défilement à chaque clic, en pixels

flecheDroite.addEventListener("click", () => {
  zoneSlider.scrollBy({ left: pas }); // fait défiler vers la droite
});

flecheGauche.addEventListener("click", () => {
  zoneSlider.scrollBy({ left: -pas }); // fait défiler vers la gauche , -pas = -100 pixels donc vers la gauche
});

// défilement du slider de boissons dans l'overlay 3 //

const sliderBoissons = document.querySelector("#overlay-slider-drink-content");
const flecheBoissonGauche = document.querySelector("#fleche-slider-drink-left");
const flecheBoissonDroite = document.querySelector(
  "#fleche-slider-drink-right",
);
const pasBoissons = 185; // largeur d'un bouton (175) + espace entre les boutons (10)

flecheBoissonDroite.addEventListener("click", () => {
  sliderBoissons.scrollBy({ left: pasBoissons }); // fait défiler vers la droite
});

flecheBoissonGauche.addEventListener("click", () => {
  sliderBoissons.scrollBy({ left: -pasBoissons }); // fait défiler vers la gauche
});
