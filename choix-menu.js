// on récupère les éléments de la page //
const zoneSlider = document.querySelector(".zone-contenu-scroll");
const flecheGauche = document.querySelector(".fleche-slider-left");
const flecheDroite = document.querySelector(".fleche-slider-right");

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
      zoneSlider.appendChild(bouton);
    });
  })
  .catch((error) => {
    console.error("Erreur lors du chargement des catégories :", error);
  });
