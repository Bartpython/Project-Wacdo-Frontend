// on récupère les éléments de la page //
const zoneSlider = document.querySelector(".zone-contenu-scroll");
const choixBurger = document.querySelector("#choose-burgers");
const flecheGauche = document.querySelector(".fleche-slider-left");
const flecheDroite = document.querySelector(".fleche-slider-right");
const modeCommande = sessionStorage.getItem("modeCommande");
console.log(modeCommande); // affiche "sur place" ou "a emporter qu'on a stocké dans le sessionStorage"

// création d'une variable pour stocker les catégories //
let categories = [];

// appel de l'API locale pour récupérer les catégories //
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
      zoneSlider.appendChild(bouton); // fait apparaître le bouton dans le slider
    });
  })
  .catch((error) => {
    console.error("Erreur lors du chargement des catégories :", error);
  });

let produits = {}; // objet pour stocker les produits par catégorie

// appel de l'API locale pour récupérer les produits //
fetch("data/produits.json")
  .then((response) => response.json())
  .then((data) => {
    console.log(data); // affiche les produits récupérés avant de les stocker dans la variable produits
    produits = data;
    produits.burgers.forEach((produit) => {
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
