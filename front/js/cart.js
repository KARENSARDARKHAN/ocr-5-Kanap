/**Récupération du code HTML et répartition des données de l'API dans le dom*/
function getCartItemCardHtml(product, color, quantity) {
  return `<article class="cart__item" data-id="${
    product._id
  }" data-color="${color}">
    <div class="cart__item__img">
      <img src="${product.imageUrl}" alt="${product.altTxt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${product.name}</h2>
        <p>${color}</p>
        <p>${product.price.toFixed(2)} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantity}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
  </article>`;
}

/**Initialisation à 0 du total du panier dans le dom*/
function updateCartTotal(cart) {
  let totalQuantity = 0;
  let totalPrice = 0;
 
  /**Boucle for pour récupération des éléments utiles au calcul des totaux*/
  for (let cartKey in cart) {
    let [id, color] = cartKey.split("#");
    let product = productsMemo[id];
    let quantity = cart[cartKey];
    totalQuantity += quantity;
    totalPrice += quantity * product.price;
  }

  /**Après calcul des variables de cumul, on modifie le dom avec les valeurs obtenues*/
  let domTotalQuantity = document.getElementById("totalQuantity");
  domTotalQuantity.innerHTML = totalQuantity;
  
  let domTotalPrice = document.getElementById("totalPrice");
  domTotalPrice.innerHTML = totalPrice.toFixed(2);

    let domTotalQuantityTop = document.getElementById("cartTotalItems");
    domTotalQuantityTop.innerHTML = totalQuantity;
}

/**Transformation du cart en une liste d'id de produit*/
function transformCartToOrderProductIdList(cart) {
  let ids = [];
  for (let cartKey in cart) {
    let [id, color] = cartKey.split("#");
    ids.push(id);
  }
  return ids;
}

/**Vérification de la conformité des données entrées par l'utilisateur
dans les champs du formulaire*/
function validateForm() {
  let isValid = true;

  let domFirstName = document.getElementById("firstName");
  let domFirstNameErrorMsg = document.getElementById("firstNameErrorMsg");
  if (!/^[a-z ,.'-]+$/i.test(domFirstName.value)) {
    isValid = false;
    domFirstNameErrorMsg.innerHTML = "Le format du prénom n'est pas valide";
  } else {
    domFirstNameErrorMsg.innerHTML = "";
  }

  let domLastName = document.getElementById("lastName");
  let domLastNameErrorMsg = document.getElementById("lastNameErrorMsg");
  if (!/^[a-z ,.'-]+$/i.test(domLastName.value)) {
    isValid = false;
    domLastNameErrorMsg.innerHTML = "Le format du nom n'est pas valide";
  } else {
    domLastNameErrorMsg.innerHTML = "";
  }

  let domAddress = document.getElementById("address");
  let domAddressErrorMsg = document.getElementById("addressErrorMsg");
  if (!/[0-9]+[a-z ,.'-]/i.test(domAddress.value)) {
    isValid = false;
    domAddressErrorMsg.innerHTML = "Le format de l'adresse n'est pas valide";
  } else {
    domAddressErrorMsg.innerHTML = "";
  }

  let domCity = document.getElementById("city");
  let domCityErrorMsg = document.getElementById("cityErrorMsg");
  if (!/^[a-z ,.'-]+$/i.test(domCity.value)) {
    isValid = false;
    domCityErrorMsg.innerHTML = "Le format de la ville n'est pas valide";
  } else {
    domCityErrorMsg.innerHTML = "";
  }

  let domEmail = document.getElementById("email");
  let domEmailErrorMsg = document.getElementById("emailErrorMsg");
  if (!/.+@.+\..+/.test(domEmail.value)) {
    isValid = false;
    domEmailErrorMsg.innerHTML = "Le format de l'email n'est pas valide";
  } else {
    domEmailErrorMsg.innerHTML = "";
  }

  return isValid;
}

/**Chargement du contenu du panier à partir du local storage dès l'ouverture de la page cart*/
let cart = JSON.parse(localStorage.getItem("cart") || "{}");

/**Création d'un storage temporaire pour accéder plus rapidement aux informations
des produits déja selectionnés dans le panier sans avoir à interroger à nouveau l'api*/
let productsMemo = {};

/**Récupèration de l'élément cart__items dans le dom afin de modifier le contenu HTML ultérieurement*/
let domCartItems = document.getElementById("cart__items");

//Boucle for in pour parcourir les propriétés d'un object une par une*/
for (let cartKey in cart) {
  /**Séparation des proprétés de cartKey poutr obtenir un array de 2 éléments*/
  let [id, color] = cartKey.split("#");

  /**Récupération de la quantité commandée*/
  let quantity = cart[cartKey];

  /**Demande des informations des produits ajoutés au panier via productsMemo ou via l'api*/
  let product;
  if (!productsMemo[id]) {

    /**Si le produit n'est pas dans productMemo, on va chercher les informations dans l'api*/
    let response = await fetch(`http://localhost:3000/api/products/${id}`);
    product = await response.json();
    productsMemo[id] = product;
  } else {
   
    /**Au cas où les informations du produit trouvent déja dans productMemo, ses informations y seront récupérées*/
    product = productsMemo[id];
  }

  /**Appel de fonction getCartItemCardHtml contenant le code HTML de la card
  de l'item du panier pour l'insérer dans le HTML de la section cart__items*/
  domCartItems.innerHTML += getCartItemCardHtml(product, color, quantity);
}

/**Appel de la fonction permettant l'updating du total du panier dans le dom**/
updateCartTotal(cart);

/**Récupération des éléments du dom relatifs aux boutons supprimer et stockage
de ces éléments dans la variable domDeleteButtons qui est un array qui sera
parcouru pour ajouter les évènements onClick un par un*/
let domDeleteButtons = document.querySelectorAll(".deleteItem");
for (let index = 0; index < domDeleteButtons.length; index++) {
  let domDeleteButton = domDeleteButtons[index];

  /**Récupération de l'élément article dans le dom et adjonction d'un addEventListener
  au click sur le bouton supprimer*/
  let domCartArticle = domDeleteButton.closest("article");
  let id = domCartArticle.dataset.id;
  let color = domCartArticle.dataset.color;
  domDeleteButton.addEventListener("click", function (event) {
   
    /**Fonction executé au click sur le bouton supprimer : supprime l'article dans
    la variable cart, update le panier dans localStorage, supprime l'article du dom
    et update le total*/
    delete cart[`${id}#${color}`];
    localStorage.setItem("cart", JSON.stringify(cart));
    domCartArticle.remove();
    updateCartTotal(cart);
  });
}

/**Ajout d'un évènement Change sur chaque input*/
let domQuantityInputs = document.querySelectorAll(".itemQuantity");
for (let index = 0; index < domQuantityInputs.length; index++) {
  let domQuantityInput = domQuantityInputs[index];
  let domCartArticle = domQuantityInput.closest("article");
  let id = domCartArticle.dataset.id;
  let color = domCartArticle.dataset.color;
  domQuantityInput.addEventListener("change", function (event) {
    
    /**Fonction executée à chaque modification de la quantité d'un item du panier :
    update l'entrée dans notre variable cart ou on supprime l'entrée si la quantité est à 0,
    sauvegarde le panier dans localStorage, update le total*/
    let quantity = Number(domQuantityInput.value);
    if (quantity === 0) {
      delete cart[`${id}#${color}`];
      domCartArticle.remove();
    } else {
      cart[`${id}#${color}`] = Number(domQuantityInput.value);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartTotal(cart);
  });
}  

/**Récupération de l'élément form dans le dom et adjonction d'un addEventListener
à la soumission du formulaire*/
let domOrderForm = document.querySelector("form.cart__order__form");
domOrderForm.addEventListener("submit", async function (event) {
  // Pour que le formulaire ne soit pas validé automatiquement sans vérification
  event.preventDefault();

  /**Fonction à executer à chaque soumission du formulaire pour vérifier que les valeurs entrées
  sont validables et que le panier n'est pas vide*/
  if (!validateForm()) {
    return;
  }

  if (Object.keys(cart).length === 0) {
    alert(`Vous devez ajouter des produits à 
      votre panier pour passer une commande`);
    return;
  }

  /**Construction et stockage dans la variable data de l'objet qui sera envoyé à l'api*/
  let data = {
    contact: {
      /**Récupération des valeurs saisies par l'utilisateur dans le formulaire à partir du dom*/
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      email: document.getElementById("email").value,
    },

    /**Conversion du panier en une liste d'ids*/
    products: transformCartToOrderProductIdList(cart),
  };

  /**Envoi de la data complète vers l'api par la méthode POST*/
  let response = await fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  let order = await response.json();

  /**Cas où la commande est validée : obtention d'une orderId, le panier est vidé,
  le localStorage est mis à jour puis redirection vers la page de confirmation de commande*/
  if (order.orderId) {
    cart = {};
    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = `confirmation.html?orderId=${order.orderId}`;
  }
  console.log(data, order);
});
