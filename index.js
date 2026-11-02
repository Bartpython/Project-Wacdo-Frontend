const menuBox = document.querySelector('.menu-box');
menuBox.style.display = 'block';


const surPlaceButton = document.querySelector('#sur-place');
const aEmporterButton = document.querySelector('#a-emporter');

surPlaceButton.addEventListener('click', () => {
  console.log('Sur place button clicked');
  window.location.href = '/choix-menu.html';
});

aEmporterButton.addEventListener('click', () => {
  console.log('A emporter button clicked');
  window.location.href = 'choix-menu.html';
});