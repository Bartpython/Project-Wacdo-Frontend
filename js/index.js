const menuBox = document.querySelector(".menu-box");
menuBox.style.display = "block";

const surPlaceButton = document.querySelector("#sur-place");
const aEmporterButton = document.querySelector("#a-emporter");

surPlaceButton.addEventListener("mouseover", () => {
  surPlaceButton.style.border = "10px solid #ffc836";
});

surPlaceButton.addEventListener("mouseout", () => {
  surPlaceButton.style.border = "8px solid #ffc836";
});
surPlaceButton.addEventListener("click", () => {
  sessionStorage.setItem("modeCommande", "sur-place"); // stocke le choix dans le sessionStorage qui est la mémoire de session du navigateur
  window.location.href = "/choix-menu.html";
});

aEmporterButton.addEventListener("mouseover", () => {
  aEmporterButton.style.border = "10px solid #ffc836";
});

aEmporterButton.addEventListener("mouseout", () => {
  aEmporterButton.style.border = "8px solid #ffc836";
});

aEmporterButton.addEventListener("click", () => {
  sessionStorage.setItem("modeCommande", "a-emporter");
  window.location.href = "/choix-menu.html";
});
