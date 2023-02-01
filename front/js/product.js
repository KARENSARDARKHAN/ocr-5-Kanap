/**Récuperation du contenu du localStorage dans la variable cart 
 * dans le cadre d'un panier vide*/
let cart = JSON.parse(localStorage.getItem("cart") || "{}");

/**Récuperation des informations des produits via l'api et stockage des données
collectées dans la variable product*/
let url = new URLSearchParams(window.location.search);
let id = url.get("id");
let response = await fetch(`http://localhost:3000/api/products/${id}`);
let product = await response.json();

/**Répartition dans le dom des données d'information sur les produits provenant de l'API*/
let domPageTitle = document.getElementsByTagName("title");
domPageTitle.innerHTML = product.name;

let domProductImage = document.querySelector(".item__img");
domProductImage.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;

let domProductName = document.getElementById("title");
domProductName.innerHTML = product.name;

let domProductPrice = document.getElementById("price");
domProductPrice.innerHTML = product.price;

let domProductDescription = document.getElementById("description");
domProductDescription.innerHTML = product.description;

let domColorInputSelect = document.getElementById("colors");
let arrayHtmlOptions = product.colors.map(function (color) {
  return `<option value="${color}">${color}</option>`;
});
domColorInputSelect.innerHTML = arrayHtmlOptions.join("");

/**Fonctions permettant l'affichage du nombre d'articles actuellement 
 * dans le panier dans la navbar  */

function updateCartTotal(cart) {
  let totalQuantity = 0;

  for (let cartKey in cart) {
    let quantity = cart[cartKey];
    totalQuantity += quantity;
  }
  let domTotalQuantity = document.getElementById("cartTotalItems");
  domTotalQuantity.innerHTML = totalQuantity;
}

updateCartTotal(cart);

/**Fonctions permettant l'affichage de messages d'erreur
 * et de validation au clic sur add to cart */
function optionMissing() {
  document.querySelector(
    ".orderError"
  ).textContent = `Sélectionnez une quantité entre 1 et 100 par article de même couleur, le cumul dans le panier est limité à 100 articles`;

  window.location.reload();
}

function productAdded() {
  let hideErrorMessage = document.querySelector(".orderError");
  hideErrorMessage.remove();

  document.querySelector(".orderValidation").textContent =
    `Sélection ajoutée au panier`;

  window.location.reload();
  
}

/**Gestion de l'ajout des produits au panier*/

/**Création d'une interraction avec le bouton addtToCart avec la fonction addEventListener*/
let domAddToCartButton = document.getElementById("addToCart");
domAddToCartButton.addEventListener("click", function () {

  /**Récuperation de la quantité grâce à l'input du dom #quantity et
  conversion en number grace à la fonction javascript Number*/
  let domQuantityInput = document.getElementById("quantity");
  let quantity = Number(domQuantityInput.value);

  /**Pour une quantité supérieure à 0 et inférieure à 101, l'élément est ajouté au panier*/
  if (quantity > 0 && quantity < 101) {
    let cartKey = `${id}#${domColorInputSelect.value}`;
    

    /**Si le panier ne contient aucune entrée pour cette id et cette couleur,
    l'entrée id#selectedColor sera initialisée à 0*/
    if (!cart[cartKey]) {
      cart[cartKey] = 0;
    }

    /**Si l'entrée id#selectedColor existe, la quantité sera ajoutée à l'entrée correspondante*/
    cart[cartKey] = cart[cartKey] + quantity;

    if (cart[cartKey] > 100) {
      optionMissing();
      return false
    }
 
    /**Dès la mise à jour de la variable cart avec les bonnes quantités,
    tout le panier est sauvegardé dans le localStorage*/
    localStorage.setItem("cart", JSON.stringify(cart));
    productAdded();
    
    /**Affichage d'un message d'avertissement si la quantité est égale à zéro*/
   } else {
     optionMissing();
   }

  /**appel de la fonction qui affiche la quantité dans le panier 
   * en haut de la page au moment du clic*/
  updateCartTotal(cart);
});

