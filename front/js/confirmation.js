//Trouver orderId dans l'url
let url = new URLSearchParams(window.location.search);
let orderId = url.get("orderId");

//Récupération de l'élément order id dans le dom et affectation de l'orderId
domOrderId = document.getElementById("orderId");
domOrderId.innerHTML = orderId;

