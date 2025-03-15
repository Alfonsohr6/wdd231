// Función para manejar el menú desplegable y el filtro de certificados
document.addEventListener("DOMContentLoaded", () => {
    // Menú desplegable
    const menuToggle = document.getElementById("menu-toggle");
    const navbar = document.getElementById("navbar");

    // Agregar evento al botón de hamburguesa
    menuToggle.addEventListener("click", () => {
        navbar.classList.toggle("active"); // Alterna la clase 'active' en el menú
    });

    // Cerrar el menú si se hace clic fuera de él
    document.addEventListener("click", (event) => {
        if (!navbar.contains(event.target) && !menuToggle.contains(event.target)) {
            navbar.classList.remove("active"); // Quita la clase 'active' si se hace clic fuera
        }
    });

    // Pie de página dinámico
    const currentYear = new Date().getFullYear();
    const copyrightElement = document.getElementById("copyright");
    copyrightElement.textContent = `© ${currentYear} Alfonso Habana Rosales | México`;

    const lastModifiedElement = document.getElementById("lastModified");
    const lastModifiedDate = new Date(document.lastModified);
    lastModifiedElement.textContent = `Last modified: ${lastModifiedDate.toLocaleString()}`;

    // Filtro de certificados
    const filterButtons = document.querySelectorAll(".filter-btn");
    const certificates = document.querySelectorAll(".certificate");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Remover clase 'active' de todos los botones
            filterButtons.forEach(btn => btn.classList.remove("active"));
            // Agregar clase 'active' al botón clicado
            button.classList.add("active");

            // Obtener el filtro seleccionado
            const filter = button.getAttribute("data-filter");

            // Mostrar/ocultar certificados según el filtro
            certificates.forEach(cert => {
                if (filter === "all" || cert.classList.contains(filter)) {
                    cert.style.display = "inline-block";
                } else {
                    cert.style.display = "none";
                }
            });
        });
    });

    // Inicializar con el filtro "All" activo
    document.querySelector(".filter-btn.active").click();
});