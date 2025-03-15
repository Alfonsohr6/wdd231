// Textos en inglés y español
const translations = {
    en: {
        siteTitle: "Business Chamber",
        aboutTitle: "About Us",
        aboutContent: "The Business Chamber is an institution dedicated to promoting business development in our region.",
        servicesTitle: "Our Services",
        servicesList: [
            "Business consulting",
            "Training and workshops",
            "International trade promotion",
            "Commercial dispute resolution"
        ],
        logo: "images/logo.png"
    },
    es: {
        siteTitle: "Cámara de Negocios",
        aboutTitle: "Sobre Nosotros",
        aboutContent: "La Cámara de Negocios es una institución dedicada a promover el desarrollo empresarial en nuestra región.",
        servicesTitle: "Nuestros Servicios",
        servicesList: [
            "Asesoramiento empresarial",
            "Capacitaciones y talleres",
            "Promoción del comercio internacional",
            "Resolución de conflictos comerciales"
        ],
        logo: "images/logo-es.png"
    }
};

// Función para cambiar el idioma
function changeLanguage(lang) {
    document.getElementById("site-title").textContent = translations[lang].siteTitle;
    document.getElementById("about-title").textContent = translations[lang].aboutTitle;
    document.getElementById("about-content").textContent = translations[lang].aboutContent;
    document.getElementById("services-title").textContent = translations[lang].servicesTitle;

    const servicesList = translations[lang].servicesList;
    const ul = document.getElementById("services-list");
    ul.innerHTML = ""; // Limpiar lista anterior
    servicesList.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        ul.appendChild(li);
    });

    // Cambiar el logo según el idioma
    document.getElementById("logo").src = translations[lang].logo;
}

// Idioma predeterminado al cargar la página
window.onload = () => {
    changeLanguage('en'); // Establecer inglés como idioma inicial

    // Año actual y última modificación
    const currentYear = new Date().getFullYear();
    document.getElementById("currentYear").textContent = currentYear;
    document.getElementById("lastModified").textContent = document.lastModified;
};