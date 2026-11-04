// on récupère les éléments de la page //
const zoneSlider = document.querySelector(".zone-contenu-scroll");
const choixBurger = document.querySelector("#choose-burgers");
const flecheGauche = document.querySelector(".fleche-slider-left");
const flecheDroite = document.querySelector(".fleche-slider-right");
const modeCommande = sessionStorage.getItem("modeCommande");
console.log(modeCommande); // affiche "sur place" ou "a emporter qu'on a stocké dans le sessionStorage"

// création d'une variable pour stocker les catégories et les produits //
let categories = []; // variable pour stocker les catégories [] pour stocker un tableau
let produits = {}; // variable pour stocker les produits par catégorie {} pour stocker un objet

// récupération des catégories depuis le fichier JSON //

fetch("data/categories.json")
  .then((response) => response.json())
  .then((data) => {
    categories = data;

    // création d'une fonction pour afficher les élements selon les catégories dans le fichier produits.json

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
        choixBurger.appendChild(bouton);
      });
    }
    categories.forEach((categorie) => {
      const bouton = document.createElement("button");
      bouton.classList.add("elements-slider");
      bouton.innerHTML = `
                <img class="img-elements-slider" src="asset/${categorie.image}" alt="${categorie.title}" />
                <span class="text-elements-slider">${categorie.title}</span>
            `;
      bouton.addEventListener("click", () => {
        afficherProduits(categorie.title);
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
    produits.burgers.forEach((produit) => {
      // la variable produit qu'on retrouve dans la fonction afficherProduits
      const bouton = document.createElement("button");
      bouton.classList.add("card-products");
      bouton.innerHTML = `
                  <img class="img-card-products" src="asset/${produit.image}" alt="${produit.nom}" />
                    <span class="text-choose-burgers">${produit.nom}</span>
                    <span class="price-choose-burgers">${produit.prix}€</span>
              `;
      choixBurger.appendChild(bouton);
    });
  })
  .catch((error) => {
    console.error("Erreur lors du chargement des produits :", error);
  });

//défilement du slider //

const pas = 100; // distance de défilement à chaque clic, en pixels

flecheDroite.addEventListener("click", () => {
  zoneSlider.scrollBy({ left: pas }); // fait défiler vers la droite
});

flecheGauche.addEventListener("click", () => {
  zoneSlider.scrollBy({ left: -pas }); // fait défiler vers la gauche , -pas = -100 pixels donc vers la gauche
});
