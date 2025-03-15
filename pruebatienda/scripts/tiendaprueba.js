document.addEventListener("DOMContentLoaded", () => {
    // Cambio de idioma
    const elements = document.querySelectorAll("[data-es], [data-en]");
    const esButton = document.getElementById("es-button");
    const enButton = document.getElementById("en-button");

    function changeLanguage(language) {
        elements.forEach((element) => {
            if (language === "es") {
                element.textContent = element.getAttribute("data-es");
            } else if (language === "en") {
                element.textContent = element.getAttribute("data-en");
            }
        });
    }

    // Botones de idioma
    esButton.addEventListener("click", () => changeLanguage("es"));
    enButton.addEventListener("click", () => changeLanguage("en"));

    // Idioma predeterminado: Español
    changeLanguage("es");

    // Añadir año actual al footer
    const currentYear = new Date().getFullYear();
    document.getElementById("current-year").textContent = currentYear;
});