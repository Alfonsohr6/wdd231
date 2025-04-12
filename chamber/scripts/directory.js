
const businessData = {
    en: [
        {
            name: "Tech Solutions",
            owner: "John Doe",
            email: "tech@example.com",
            phone: "123-456-7890",
            address: "123 Tech Ave, Silicon Valley"
        },
        {
            name: "Green Garden",
            owner: "Jane Smith",
            email: "garden@example.com",
            phone: "987-654-3210",
            address: "456 Green St, Eco City"
        }
    ],
    es: [
        {
            name: "Soluciones Tecnológicas",
            owner: "Juan Pérez",
            email: "tech@example.com",
            phone: "123-456-7890",
            address: "123 Av. Tecnológica, Silicon Valley"
        },
        {
            name: "Jardín Verde",
            owner: "Juana López",
            email: "garden@example.com",
            phone: "987-654-3210",
            address: "456 Calle Verde, Ciudad Ecológica"
        }
    ]
};

// Función para cambiar el idioma
function changeLanguage(lang) {
    document.getElementById("site-title").textContent = translations[lang].siteTitle || "Business Chamber";
    document.getElementById("directory-title").textContent = translations[lang].directoryTitle;
    document.getElementById("directory-content").textContent = translations[lang].directoryContent;

    // Cargar lista de empresas según el idioma
    const ul = document.getElementById("business-list");
    ul.innerHTML = ""; // Limpiar lista anterior
    businessData[lang].forEach((business, index) => {
        const li = document.createElement("li");
        li.textContent = business.name;
        li.dataset.index = index; // Guardar índice para identificar la empresa
        li.style.cursor = "pointer"; // Indicar que es clickeable
        li.addEventListener("click", () => openModal(business, lang));
        ul.appendChild(li);
    });
}

// Función para abrir el modal con los detalles de la empresa
function openModal(business, lang) {
    const modal = document.getElementById("business-modal");
    const modalContent = modal.querySelector(".modal-content");

    // Actualizar contenido del modal
    document.getElementById("modal-business-name").textContent = business.name;
    document.getElementById("modal-owner-name").textContent = business.owner;
    document.getElementById("modal-email").textContent = business.email;
    document.getElementById("modal-phone").textContent = business.phone;
    document.getElementById("modal-address").textContent = business.address;

    // Mostrar el modal
    modal.style.display = "block";

    // Cerrar el modal al hacer clic en la X
    const closeModalButton = modal.querySelector(".close-modal");
    closeModalButton.onclick = () => closeModal();

    // Cerrar el modal al hacer clic fuera del contenido
    window.onclick = event => {
        if (event.target === modal) {
            closeModal();
        }
    };
}

// Función para cerrar el modal
function closeModal() {
    const modal = document.getElementById("business-modal");
    modal.style.display = "none";
}

// Cargar contenido dinámicamente cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
    // Cargar header
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
        })
        .catch(error => console.error("Error loading header:", error));

    // Cargar footer
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;

            // Actualizar año actual y fecha de última modificación
            const currentYear = new Date().getFullYear();
            document.getElementById("currentYear").textContent = currentYear;

            const lastModified = new Date(document.lastModified).toLocaleString();
            document.getElementById("lastModified").textContent = lastModified;
        })
        .catch(error => console.error("Error loading footer:", error));

    // Idioma predeterminado al cargar la página
    changeLanguage('en');
});