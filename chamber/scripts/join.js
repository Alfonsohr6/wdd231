document.getElementById("business-form").addEventListener("submit", function (event) {
    event.preventDefault();

    // Obtener datos del formulario
    const businessName = document.getElementById("business-name").value;
    const ownerName = document.getElementById("owner-name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;

    // Guardar datos en localStorage
    const businessData = {
        businessName,
        ownerName,
        email,
        phone,
        address
    };

    let businesses = JSON.parse(localStorage.getItem("businesses")) || [];
    businesses.push(businessData);
    localStorage.setItem("businesses", JSON.stringify(businesses));

    // Mostrar mensaje de éxito
    document.getElementById("form-message").textContent = "Business registered successfully!";
    document.getElementById("business-form").reset();
});