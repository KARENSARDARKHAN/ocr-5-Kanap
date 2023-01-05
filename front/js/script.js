/**Récupération du code HTML et Répartition des données de l'API dans le DOM*/
function htmlItemCard(product) {
  return `<a href="./product.html?id=${product._id}">
  <article>
    <img src="${product.imageUrl}" alt='${product.altTxt}'>
    <h3 class="productName">${product.name}</h3>
    <p class="productDescription">${product.description}</p>
  </article>
  </a>`;
}

/**Récupération des articles de l'API*/
let response = await fetch("http://localhost:3000/api/products");
let products = await response.json();

/**Utilisation la propriété .innerHTML pour vider le HTML de la section*/
let sectionItems = document.getElementById("items");
sectionItems.innerHTML = "";

/**Boucle for modifiant le HTML et générant l'apparition des cartes produits
les unes après les autres dans la page web*/
for (let index = 0; index < products.length; index++) {
  let productData = products[index];
  let productCardHtml = htmlItemCard(productData);
  sectionItems.innerHTML = sectionItems.innerHTML + productCardHtml;
}
