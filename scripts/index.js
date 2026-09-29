// Diccionario de traducciones en inglés y español
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
        noEventsMessage: "No events available at the moment.",
        weatherLoading: "Loading weather data..."
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
        noEventsMessage: "No hay eventos disponibles por el momento.",
        weatherLoading: "Cargando datos del clima..."
    }
};

// Función para cambiar el idioma
function changeLanguage(lang) {
    const siteTitle = document.getElementById("site-title");
    const aboutTitle = document.getElementById("about-title");
    const aboutContent = document.getElementById("about-content");
    const servicesTitle = document.getElementById("services-title");
    const ul = document.getElementById("services-list");

    if (siteTitle) siteTitle.textContent = translations[lang].siteTitle;
    if (aboutTitle) aboutTitle.textContent = translations[lang].aboutTitle;
    if (aboutContent) aboutContent.textContent = translations[lang].aboutContent;
    if (servicesTitle) servicesTitle.textContent = translations[lang].servicesTitle;

    if (ul) {
        ul.innerHTML = "";
        translations[lang].servicesList.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            ul.appendChild(li);
        });
    }

    updateEvents(translations[lang].noEventsMessage);
}

// Inicialización de la aplicación
document.addEventListener("DOMContentLoaded", () => {
    // 1. Ocultar cuadro del Hero Banner al hacer clic en la X
    const closeBtn = document.getElementById("close-hero-overlay");
    const heroOverlay = document.getElementById("hero-overlay");

    if (closeBtn && heroOverlay) {
        closeBtn.addEventListener("click", () => {
            heroOverlay.style.display = "none";
        });
    }

    // 2. Actualización de año y fecha en el pie de página
    const currentYear = new Date().getFullYear();
    const currentYearEl = document.getElementById("currentYear");
    if (currentYearEl) currentYearEl.textContent = currentYear;

    const lastModifiedEl = document.getElementById("lastModified");
    if (lastModifiedEl) lastModifiedEl.textContent = document.lastModified;

    // 3. Ejecutar servicios del sitio
    changeLanguage('en');
    loadWeather();
    loadSpotlights();
});

// Función para cargar el clima mediante OpenWeatherMap API
async function loadWeather() {
    const apiKey = "06f42527f001d6fcc88d814b75fb67b9"; 
    const city = "Zumpango,MX"; 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const weatherInfo = document.getElementById("weather-info");
    if (!weatherInfo) return;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Weather service response error");

        const data = await response.json();
        const temp = Math.round(data.main.temp);
        const condition = data.weather[0].description;
        const location = data.name;

        weatherInfo.innerHTML = `
            <p><strong>Location:</strong> ${location}</p>
            <p><strong>Temperature:</strong> ${temp}°C</p>
            <p><strong>Condition:</strong> ${condition}</p>
        `;
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
        weatherInfo.innerHTML = `<p>Error loading weather data.</p>`;
    }
}

// Función para mostrar eventos
function updateEvents(message) {
    const eventsList = document.getElementById("events-list");
    if (!eventsList) return;

    const events = [];

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

// Función para cargar los miembos destacados (Spotlights) desde members.json
async function loadSpotlights() {
    const container = document.getElementById("spotlight-container");
    if (!container) return;

    try {
        const response = await fetch('data/members.json');
        if (!response.ok) throw new Error("Failed to load members.json");

        const data = await response.json();
        const members = data.members || data;

        // Filtrar por membresías Gold (3) y Silver (2)
        const spotlightCandidates = members.filter(m => m.membershipLevel === 2 || m.membershipLevel === 3 || m.membership === 2 || m.membership === 3);

        const selected = [];
        const count = Math.min(spotlightCandidates.length, Math.floor(Math.random() * 2) + 2); 
        while (selected.length < count && spotlightCandidates.length > 0) {
            const index = Math.floor(Math.random() * spotlightCandidates.length);
            selected.push(spotlightCandidates.splice(index, 1)[0]);
        }

        container.innerHTML = "";

        selected.forEach(member => {
            const card = document.createElement("div");
            card.className = "spotlight-card";
            const isGold = (member.membershipLevel === 3 || member.membership === 3);
            
            card.innerHTML = `
                <img src="images/${member.image}" alt="${member.name} logo" loading="lazy">
                <h3>${member.name}</h3>
                <p><strong>Phone:</strong> ${member.phone}</p>
                <p><strong>Address:</strong> ${member.address}</p>
                <p><strong>Website:</strong> <a href="${member.website}" target="_blank" rel="noopener">${member.website}</a></p>
                <p><strong>Membership:</strong> ${isGold ? 'Gold' : 'Silver'}</p>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error("Error loading spotlights:", error);
        container.innerHTML = `<p>Unable to load spotlights.</p>`;
    }
}