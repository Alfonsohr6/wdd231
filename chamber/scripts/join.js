let currentLang = 'en'; // Variable global para el idioma actual

// Textos en inglés y español
const translations = {
    en: {
        joinTitle: "Join the Chamber",
        joinContent: "Fill out the form below to register your business in the Business Chamber network.",
        labels: {
            businessName: "Business Name:",
            ownerName: "Owner Name:",
            email: "Email:",
            phone: "Phone:",
            address: "Address:"
        },
        submitButton: "Submit",
        successMessage: "Business registered successfully!"
    },
    es: {
        joinTitle: "Únete a la Cámara",
        joinContent: "Completa el formulario a continuación para registrar tu negocio en la red de la Cámara de Negocios.",
        labels: {
            businessName: "Nombre del Negocio:",
            ownerName: "Nombre del Propietario:",
            email: "Correo Electrónico:",
            phone: "Teléfono:",
            address: "Dirección:"
        },
        submitButton: "Enviar",
        successMessage: "¡Negocio registrado exitosamente!"
    }
};

// Función para cambiar el idioma
function changeLanguage(lang) {
    currentLang = lang; // Actualizar el idioma actual
    document.getElementById("site-title").textContent = translations[lang].siteTitle || "Business Chamber";
    document.getElementById("join-title").textContent = translations[lang].joinTitle;
    document.getElementById("join-content").textContent = translations[lang].joinContent;

    document.getElementById("business-name-label").textContent = translations[lang].labels.businessName;
    document.getElementById("owner-name-label").textContent = translations[lang].labels.ownerName;
    document.getElementById("email-label").textContent = translations[lang].labels.email;
    document.getElementById("phone-label").textContent = translations[lang].labels.phone;
    document.getElementById("address-label").textContent = translations[lang].labels.address;
    document.getElementById("submit-button").textContent = translations[lang].submitButton;
}

// Validación del formulario
function validateForm(businessName, ownerName, email, phone, address) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById("email-error").textContent = "Please enter a valid email address.";
        document.getElementById("email-error").classList.add("show");
        return false;
    } else {
        document.getElementById("email-error").classList.remove("show");
    }

    if (isNaN(phone)) {
        document.getElementById("phone-error").textContent = "Phone number must contain only numbers.";
        document.getElementById("phone-error").classList.add("show");
        return false;
    } else {
        document.getElementById("phone-error").classList.remove("show");
    }

    return true;
}

// Evento submit del formulario
document.getElementById("business-form").addEventListener("submit", function (event) {
    event.preventDefault();

    // Obtener datos del formulario
    const businessName = document.getElementById("business-name").value.trim();
    const ownerName = document.getElementById("owner-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();

    // Validar datos
    if (!validateForm(businessName, ownerName, email, phone, address)) {
        return;
    }

    // Guardar datos en localStorage
    const businessData = {
        id: Date.now(), // Identificador único
        businessName,
        ownerName,
        email,
        phone,
        address
    };

    let businesses = JSON.parse(localStorage.getItem("businesses")) || [];
    businesses.push(businessData);
    localStorage.setItem("businesses", JSON.stringify(businesses));

    // Mostrar mensaje de éxito en el idioma actual
    document.getElementById("form-message").textContent = translations[currentLang].successMessage;
    document.getElementById("business-form").reset();
});

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

      const currentYear = new Date().getFullYear();
      document.getElementById("currentYear").textContent = currentYear;

      const lastModified = new Date(document.lastModified).toLocaleString();
      document.getElementById("lastModified").textContent = lastModified;
    })
    .catch(error => console.error("Error loading footer:", error));

  // Timestamp
  const timestampField = document.getElementById("timestamp");
  if (timestampField) {
    timestampField.value = new Date().toISOString();
  }

  // Idioma predeterminado al cargar la página
  changeLanguage('en');
});