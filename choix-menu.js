function chargerCategories() {
fetch('data/categories.json', {
    method: 'GET', 
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('Error fetching categories:', error);
  });
}
function chargerProduits() {
  fetch('data/produits.json', {
    method: 'GET',
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Error fetching products:', error);
    });
} 
chargerCategories();
chargerProduits();