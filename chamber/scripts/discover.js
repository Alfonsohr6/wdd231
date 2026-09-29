import { places } from "../data/places.mjs";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Manejo del mensaje de última visita con localStorage
  handleVisitMessage();

  // 2. Renderizado dinámico de las 8 tarjetas
  renderCards(places);

  // 3. Información del pie de página
  const currentYearElement = document.getElementById("currentYear");
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  const lastModifiedElement = document.getElementById("lastModified");
  if (lastModifiedElement) {
    lastModifiedElement.textContent = document.lastModified;
  }
});

function handleVisitMessage() {
  const messageElement = document.getElementById("visit-message");
  if (!messageElement) return;

  const msInDay = 86400000;
  const lastVisit = localStorage.getItem("lastVisitDate");
  const currentVisit = Date.now();

  if (!lastVisit) {
    messageElement.textContent = "Welcome! Let us know if you have any questions.";
  } else {
    const timeDifference = currentVisit - parseInt(lastVisit, 10);

    if (timeDifference < msInDay) {
      messageElement.textContent = "Back so soon! Awesome!";
    } else {
      const days = Math.floor(timeDifference / msInDay);
      if (days === 1) {
        messageElement.textContent = "You last visited 1 day ago.";
      } else {
        messageElement.textContent = `You last visited ${days} days ago.`;
      }
    }
  }

  // Guardar la fecha actual de la visita
  localStorage.setItem("lastVisitDate", currentVisit.toString());
}

function renderCards(items) {
  const galleryContainer = document.getElementById("discover-gallery");
  if (!galleryContainer) return;

  galleryContainer.innerHTML = "";

  items.forEach((item, index) => {
    const card = document.createElement("article");
    card.classList.add("card");
    // Asignar nombre de área para Grid Areas nominadas (card1, card2, ... card8)
    card.style.gridArea = `card${index + 1}`;

    card.innerHTML = `
      <h2>${item.title}</h2>
      <figure>
        <img src="images/${item.photo}" alt="${item.title}" loading="lazy" width="300" height="200">
      </figure>
      <address>${item.address}</address>
      <p>${item.description}</p>
      <button type="button" class="learn-more-btn">Learn More</button>
    `;

    galleryContainer.appendChild(card);
  });
}