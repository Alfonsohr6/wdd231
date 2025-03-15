document.addEventListener("DOMContentLoaded", () => {
    // Cambio de idioma
    const elements = document.querySelectorAll("[data-es], [data-en]");
    const esButton = document.getElementById("es-button");
    const enButton = document.getElementById("en-button");

    function changeLanguage(language) {
        elements.forEach((element) => {
            if (language === "es") {
                element.textContent = element.getAttribute("data-es");
            } else if (language === "en") {
                element.textContent = element.getAttribute("data-en");
            }
        });
    }

    // Botones de idioma
    esButton.addEventListener("click", () => changeLanguage("es"));
    enButton.addEventListener("click", () => changeLanguage("en"));

    // Idioma predeterminado: Español
    changeLanguage("es");

    // Añadir año actual al footer
    const currentYear = new Date().getFullYear();
    document.getElementById("current-year").textContent = currentYear;
});

// Función para agregar productos al carrito
document.addEventListener("DOMContentLoaded", function () {
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    const cartItemsList = document.getElementById("cart-items");
    const cartTotalElement = document.getElementById("cart-total");

    let cart = [];

    // Agregar evento a cada botón "Agregar al Carrito"
    addToCartButtons.forEach(button => {
        button.addEventListener("click", function () {
            const product = this.dataset.name;
            const price = parseFloat(this.dataset.price);
            const quantityInput = this.parentElement.querySelector(".quantity");
            const quantity = parseInt(quantityInput.value);

            if (quantity > 0) {
                addToCart(product, price, quantity);
                updateCartUI();
            }
        });
    });

    // Función para agregar un producto al carrito
    function addToCart(name, price, quantity) {
        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ name, price, quantity });
        }
    }

    // Actualizar la interfaz del carrito
    function updateCartUI() {
        cartItemsList.innerHTML = "";
        let total = 0;

        cart.forEach(item => {
            const listItem = document.createElement("li");
            listItem.textContent = `${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`;
            cartItemsList.appendChild(listItem);

            total += item.price * item.quantity;
        });

        cartTotalElement.textContent = total.toFixed(2);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const products = loadProductsFromLocalStorage();
    const productContainer = document.getElementById('products');
  
    products.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.className = 'product';
      productDiv.innerHTML = `
        <h3>${product.name}</h3>
        <p>Precio: $${product.price.toFixed(2)}</p>
        <input type="number" min="0" value="0" class="quantity" data-price="${product.price}">
        <button class="add-to-cart" data-name="${product.name}">Agregar al Carrito</button>
      `;
      productContainer.appendChild(productDiv);
    });
  });