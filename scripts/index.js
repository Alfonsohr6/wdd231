document.addEventListener("DOMContentLoaded", () => {
    // 1. Manejo dinámico del footer (Año actual y última modificación)
    const currentYear = new Date().getFullYear();
    const currentYearEl = document.getElementById("currentYear");
    if (currentYearEl) currentYearEl.textContent = currentYear;

    const lastModifiedEl = document.getElementById("lastModified");
    if (lastModifiedEl) lastModifiedEl.textContent = document.lastModified;

    // 2. Cargar funciones principales
    loadWeather();
    loadSpotlights();
});

// Función para obtener clima actual y pronóstico a 3 días desde OpenWeatherMap
async function loadWeather() {
    const apiKey = "06f42527f001d6fcc88d814b75fb67b9"; // Clave de OpenWeatherMap
    const city = "Zumpango,MX";
    
    // Endpoints para clima actual y pronóstico
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    const weatherContainer = document.getElementById("weather-info");

    try {
        // Peticiones simultáneas con Promise.all
        const [currentRes, forecastRes] = await Promise.all([
            fetch(currentUrl),
            fetch(forecastUrl)
        ]);

        if (!currentRes.ok || !forecastRes.ok) {
            throw new Error("Weather service unavailable");
        }

        const currentData = await currentRes.json();
        const forecastData = await forecastRes.json();

        // Filtrar pronóstico para tomar una lectura por día (cada 24h / índice de cada 8 bloques de 3 horas)
        const dailyForecasts = forecastData.list.filter((item, index) => index % 8 === 0).slice(0, 3);

        // Construcción del HTML dinámico
        let weatherHTML = `
            <div class="current-weather">
                <p><strong>Location:</strong> ${currentData.name}</p>
                <p><strong>Current Temp:</strong> ${Math.round(currentData.main.temp)}°C</p>
                <p><strong>Condition:</strong> ${currentData.weather[0].description}</p>
            </div>
            <hr class="weather-divider">
            <div class="forecast-section">
                <h4>3-Day Forecast:</h4>
                <ul class="forecast-list">
        `;

        dailyForecasts.forEach(day => {
            const date = new Date(day.dt * 1000);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            weatherHTML += `
                <li><strong>${dayName}:</strong> ${Math.round(day.main.temp)}°C - ${day.weather[0].description}</li>
            `;
        });

        weatherHTML += `</ul></div>`;
        weatherContainer.innerHTML = weatherHTML;

    } catch (error) {
        console.error("Error loading weather:", error);
        weatherContainer.innerHTML = `<p>Unable to load weather information at this time.</p>`;
    }
}

// Función para obtener miembros Silver y Gold de forma aleatoria (Spotlights)
async function loadSpotlights() {
    const container = document.getElementById("spotlight-container");
    if (!container) return;

    try {
        const response = await fetch('data/members.json');
        if (!response.ok) throw new Error("Failed to load members dataset");

        const data = await response.json();
        const members = data.members || data; // Adapta la estructura del JSON

        // Filtrar miembros cuyo nivel de membresía sea Silver (2) o Gold (3)
        const eligibleMembers = members.filter(m => m.membershipLevel === 2 || m.membershipLevel === 3 || m.membership === 'Silver' || m.membership === 'Gold');

        // Seleccionar aleatoriamente 2 o 3 miembros
        const selectedMembers = [];
        const count = Math.min(eligibleMembers.length, Math.floor(Math.random() * 2) + 2); // Devuelve 2 o 3

        while (selectedMembers.length < count && eligibleMembers.length > 0) {
            const randomIndex = Math.floor(Math.random() * eligibleMembers.length);
            selectedMembers.push(eligibleMembers.splice(randomIndex, 1)[0]);
        }

        // Renderizar las tarjetas
        container.innerHTML = "";
        selectedMembers.forEach(member => {
            const levelName = (member.membershipLevel === 3 || member.membership === 'Gold') ? 'Gold' : 'Silver';
            
            const card = document.createElement("div");
            card.className = `spotlight-card level-${levelName.toLowerCase()}`;
            card.innerHTML = `
                <img src="images/${member.image}" alt="${member.name} logo" loading="lazy">
                <h3>${member.name}</h3>
                <p><strong>Phone:</strong> ${member.phone}</p>
                <p><strong>Address:</strong> ${member.address}</p>
                <p><strong>Website:</strong> <a href="${member.website}" target="_blank" rel="noopener">${member.website}</a></p>
                <p class="membership-tag"><strong>Membership:</strong> ${levelName}</p>
            `;
            container.appendChild(card);
        });

    } catch (error) {
        console.error("Error loading spotlights:", error);
        container.innerHTML = `<p>Unable to load business spotlights.</p>`;
    }
}