// Textos en inglés y español
const translations = {
    en: {
        directoryTitle: "Business Directory",
        directoryContent: "Explore the list of local businesses that are part of the Business Chamber.",
        businessList: [
            "Business 1: Description of Business 1",
            "Business 2: Description of Business 2",
            "Business 3: Description of Business 3"
        ]
    },
    es: {
        directoryTitle: "Directorio de Negocios",
        directoryContent: "Explora la lista de negocios locales que forman parte de la Cámara de Negocios.",
        businessList: [
            "Negocio 1: Descripción del Negocio 1",
            "Negocio 2: Descripción del Negocio 2",
            "Negocio 3: Descripción del Negocio 3"
        ]
    }
};

// Función para cambiar el idioma
function changeLanguage(lang) {
    document.getElementById("site-title").textContent = translations[lang].siteTitle || "Business Chamber";
    document.getElementById("directory-title").textContent = translations[lang].directoryTitle;
    document.getElementById("directory-content").textContent = translations[lang].directoryContent;

    const businessList = translations[lang].businessList;
    const ul = document.getElementById("business-list");
    ul.innerHTML = ""; // Limpiar lista anterior
    businessList.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        ul.appendChild(li);
    });
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