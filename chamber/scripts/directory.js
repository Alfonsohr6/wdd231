// Variable global para idioma actual
let currentLang = 'en';

// Traducciones internas (solo para ti)
const translations = {
  en: {
    directoryTitle: "Business Directory",
    directoryContent: "Explore the list of local businesses that are part of the Business Chamber.",
    membershipLevels: {
      1: "Member",
      2: "Silver",
      3: "Gold"
    }
  },
  es: {
    directoryTitle: "Directorio de Negocios",
    directoryContent: "Explora la lista de negocios locales que forman parte de la Cámara de Negocios.",
    membershipLevels: {
      1: "Miembro",
      2: "Plata",
      3: "Oro"
    }
  }
};

// Función para cambiar idioma
function changeLanguage(lang) {
  currentLang = lang;
  document.getElementById("site-title").textContent = "Business Chamber";
  document.getElementById("directory-title").textContent = translations[lang].directoryTitle;
  document.getElementById("directory-content").textContent = translations[lang].directoryContent;
}

// Función para obtener etiqueta de membresía
function getMembershipLabel(level) {
  return translations[currentLang].membershipLevels[level] || "Unknown";
}

// Función para mostrar miembros en el contenedor
function displayMembers(members) {
  const container = document.getElementById("business-list");
  container.innerHTML = ""; // Limpiar contenido anterior

  members.forEach(member => {
    const card = document.createElement("div");
    card.className = container.classList.contains("list-view") ? "member-list-item" : "member-card";

    card.innerHTML = `
      <img src="images/${member.image}" alt="${member.name} logo">
      <h3>${member.name}</h3>
      <p><strong>Address:</strong> ${member.address}</p>
      <p><strong>Phone:</strong> ${member.phone}</p>
      <p><strong>Website:</strong> <a href="${member.website}" target="_blank">${member.website}</a></p>
      <p><strong>Membership:</strong> ${getMembershipLabel(member.membership)}</p>
    `;

    container.appendChild(card);
  });
}

// Función para cargar miembros desde JSON
async function loadMembers() {
  try {
    const response = await fetch('data/members.json');
    if (!response.ok) throw new Error("Failed to load members.json");

    const members = await response.json();
    displayMembers(members);
  } catch (error) {
    console.error("Error loading members:", error);
  }
}

// Alternar vista entre grid y lista
function setupViewToggle() {
  const container = document.getElementById("business-list");
  document.getElementById("grid-view").addEventListener("click", () => {
    container.classList.remove("list-view");
    container.classList.add("grid-view");
    loadMembers(); // Recargar para aplicar estilo
  });

  document.getElementById("list-view").addEventListener("click", () => {
    container.classList.remove("grid-view");
    container.classList.add("list-view");
    loadMembers(); // Recargar para aplicar estilo
  });
}

// Cargar contenido dinámico al iniciar
document.addEventListener("DOMContentLoaded", () => {
  // Cargar header externo si se usa
  fetch('header.html')
    .then(response => response.text())
    .then(data => {
      const header = document.getElementById('header-placeholder');
      if (header) header.innerHTML = data;
    })
    .catch(error => console.error("Error loading header:", error));

  // Cargar footer externo si se usa
  fetch('footer.html')
    .then(response => response.text())
    .then(data => {
      const footer = document.getElementById('footer-placeholder');
      if (footer) footer.innerHTML = data;

      // Actualizar año y fecha de modificación
      const currentYear = new Date().getFullYear();
      document.getElementById("currentYear").textContent = currentYear;

      const lastModified = new Date(document.lastModified).toLocaleString();
      document.getElementById("lastModified").textContent = lastModified;
    })
    .catch(error => console.error("Error loading footer:", error));

  // Idioma por defecto
  changeLanguage('en');

  // Inicializar vista y cargar miembros
  setupViewToggle();
  loadMembers();
});