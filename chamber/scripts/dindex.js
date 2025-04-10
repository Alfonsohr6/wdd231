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
        logo: "images/logo.png",
        noEventsMessage: "No events available at the moment.",
        weatherLoading: "Loading weather data...",
        weatherError: "Unable to load weather data."
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
        logo: "images/logo.png",
        noEventsMessage: "No hay eventos disponibles por el momento.",
        weatherLoading: "Cargando datos del clima...",
        weatherError: "No se pudo cargar el pronóstico del clima."
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

    // Actualizar mensajes de eventos
    updateEvents(translations[lang].noEventsMessage);

    // Actualizar texto del clima
    document.getElementById("weather-info").innerHTML = `<p>${translations[lang].weatherLoading}</p>`;
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

    // Cargar pronóstico del clima
    loadWeather();

    // Cargar eventos
    updateEvents(translations.en.noEventsMessage); // Mensaje predeterminado
});

// Función para cargar el pronóstico del clima
async function loadWeather() {
    const apiKey = "06f42527f001d6fcc88d814b75fb67b9"; // Reemplaza con tu clave de API
    const city = "Zumpango"; // Cambia a tu ciudad
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("City not found or API key invalid");
        }

        const data = await response.json();
        const temp = data.main.temp;
        const condition = data.weather[0].description;
        const location = data.name;

        // Actualizar el DOM con el pronóstico del clima
        document.getElementById("weather-info").innerHTML = `
            <p><strong>Location:</strong> ${location}</p>
            <p><strong>Temperature:</strong> ${temp}°C</p>
            <p><strong>Condition:</strong> ${condition}</p>
        `;
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
        document.getElementById("weather-info").innerHTML = `<p>Error loading weather data.</p>`;
    }
}

// Función para actualizar eventos
function updateEvents(message) {
    const eventsList = document.getElementById("events-list");

    // Ejemplo: Lista vacía de eventos
    const events = []; // Aquí puedes agregar eventos dinámicamente

    if (events.length === 0) {
        eventsList.innerHTML = `<p>${message}</p>`;
    } else {
        eventsList.innerHTML = "";
        events.forEach(event => {
            const p = document.createElement("p");
            p.textContent = event;
            eventsList.appendChild(p);
        });
    }
}
