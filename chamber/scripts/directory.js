document.addEventListener("DOMContentLoaded", () => {
    // 1. Pie de página dinámico (Año y última modificación)
    const currentYearElement = document.getElementById("currentYear");
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    const lastModifiedElement = document.getElementById("lastModified");
    if (lastModifiedElement) {
        lastModifiedElement.textContent = document.lastModified;
    }

    // 2. Carga de miembros mediante Async/Await y Fetch
    const url = "data/members.json";
    const businessList = document.getElementById("business-list");

    async function getMembers() {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("No se pudo cargar el archivo JSON");
            }
            const data = await response.json();
            displayMembers(data.members);
        } catch (error) {
            console.error("Error al cargar los datos de los miembros:", error);
        }
    }

    // 3. Función para mostrar los miembros en el DOM
    const displayMembers = (members) => {
        businessList.innerHTML = ""; // Limpiar contenedor

        members.forEach((member) => {
            const card = document.createElement("section");
            card.classList.add("member-card");

            // Elementos de la tarjeta
            const img = document.createElement("img");
            img.setAttribute("src", `images/${member.image}`);
            img.setAttribute("alt", `Logo de ${member.name}`);
            img.setAttribute("loading", "lazy");
            img.setAttribute("width", "150");
            img.setAttribute("height", "150");

            const name = document.createElement("h3");
            name.textContent = member.name;

            const address = document.createElement("p");
            address.textContent = member.address;

            const phone = document.createElement("p");
            phone.textContent = member.phone;

            const website = document.createElement("a");
            website.setAttribute("href", member.website);
            website.setAttribute("target", "_blank");
            website.textContent = member.website;

            const level = document.createElement("p");
            level.textContent = `Nivel de Membresía: ${member.membershipLevel}`;
            level.classList.add(`level-${member.membershipLevel}`);

            // Agregar elementos a la tarjeta
            card.appendChild(img);
            card.appendChild(name);
            card.appendChild(address);
            card.appendChild(phone);
            card.appendChild(website);
            card.appendChild(level);

            businessList.appendChild(card);
        });
    };

    // Llamada inicial para obtener los datos
    getMembers();

    // 4. Funcionalidad de botones para alternar entre Grid y List
    const gridButton = document.getElementById("grid-view");
    const listButton = document.getElementById("list-view");

    if (gridButton && listButton) {
        gridButton.addEventListener("click", () => {
            businessList.classList.add("grid-view");
            businessList.classList.remove("list-view");
        });

        listButton.addEventListener("click", () => {
            businessList.classList.add("list-view");
            businessList.classList.remove("grid-view");
        });
    }
});