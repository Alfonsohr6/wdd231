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

    esButton.addEventListener("click", () => changeLanguage("es"));
    enButton.addEventListener("click", () => changeLanguage("en"));

    // Idioma predeterminado: Español
    changeLanguage("es");

    // Añadir año actual al footer
    const currentYear = new Date().getFullYear();
    document.getElementById("current-year").textContent = currentYear;

    // Carrito de Compras
    const cart = [];
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    document.querySelectorAll(".add-to-cart").forEach((button) => {
        button.addEventListener("click", (e) => {
            const productName = e.target.getAttribute("data-name");
            const quantity = parseInt(e.target.previousElementSibling.value);
            const price = parseFloat(e.target.previousElementSibling.getAttribute("data-price"));

            if (quantity > 0) {
                const existingItem = cart.find((item) => item.name === productName);
                if (existingItem) {
                    existingItem.quantity += quantity;
                } else {
                    cart.push({ name: productName, quantity, price });
                }
                updateCart();
            }
        });
    });

    function updateCart() {
        cartItems.innerHTML = "";
        let total = 0;
        cart.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = `${item.name} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`;
            cartItems.appendChild(li);
            total += item.price * item.quantity;
        });
        cartTotal.textContent = total.toFixed(2);
    }

    // Actualizar Productos
    const productList = document.getElementById("product-list");
    const productForm = document.getElementById("product-form");

    productForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("product-name").value;
        const description = document.getElementById("product-description").value;
        const price = document.getElementById("product-price").value;
        const image = document.getElementById("product-image").value;

        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${name}</strong>: ${description} - $${price}
            <img src="${image}" alt="${name}" width="50">
            <button class="delete-product">Eliminar</button>
        `;
        productList.appendChild(li);

        productForm.reset();

        // Eliminar producto
        li.querySelector(".delete-product").addEventListener("click", () => {
            productList.removeChild(li);
        });
    });
});