// Función principal que se ejecuta cuando el DOM está completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. CONFIGURACIÓN DEL MENÚ MÓVIL ---
    const menuToggle = document.getElementById("menu-toggle");
    const navbar = document.getElementById("navbar");

    if (menuToggle && navbar) {
        // Alternar visibilidad del menú al hacer clic en el botón de hamburguesa
        menuToggle.addEventListener("click", () => {
            navbar.classList.toggle("active");
        });

        // Cerrar el menú si el usuario hace clic fuera de él en dispositivos móviles
        document.addEventListener("click", (event) => {
            if (!navbar.contains(event.target) && !menuToggle.contains(event.target)) {
                navbar.classList.remove("active");
            }
        });
    }

    // --- 2. PIE DE PÁGINA DINÁMICO ---
    const currentYearElement = document.getElementById("currentyear");
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    const lastModifiedElement = document.getElementById("lastModified");
    if (lastModifiedElement) {
        const lastModifiedDate = new Date(document.lastModified);
        lastModifiedElement.textContent = `Last modified: ${lastModifiedDate.toLocaleString()}`;
    }

    // --- 3. DATOS DE LOS CURSOS (Arreglo de Objetos) ---
    const courses = [
        {
            subject: 'CSE',
            number: 110,
            title: 'Introduction to Programming',
            credits: 2,
            certificate: 'Web and Computer Programming',
            completed: true
        },
        {
            subject: 'WDD',
            number: 130,
            title: 'Web Fundamentals',
            credits: 2,
            certificate: 'Web and Computer Programming',
            completed: true
        },
        {
            subject: 'CSE',
            number: 111,
            title: 'Programming with Functions',
            credits: 2,
            certificate: 'Web and Computer Programming',
            completed: true
        },
        {
            subject: 'CSE',
            number: 210,
            title: 'Programming with Classes',
            credits: 2,
            certificate: 'Web and Computer Programming',
            completed: false
        },
        {
            subject: 'WDD',
            number: 131,
            title: 'Dynamic Web Fundamentals',
            credits: 2,
            certificate: 'Web and Computer Programming',
            completed: true
        },
        {
            subject: 'WDD',
            number: 231,
            title: 'Web Frontend Development I',
            credits: 2,
            certificate: 'Web and Computer Programming',
            completed: true
        }
    ];

    // --- 4. FUNCIÓN PARA RENDERIZAR LOS CURSOS Y CALCULAR CRÉDITOS ---
    function displayCourses(filteredCourses) {
        const container = document.getElementById("course-container");
        if (!container) return;

        // Limpiar el contenedor antes de renderizar
        container.innerHTML = "";

        // Crear dinámicamente cada botón/tarjeta de curso
        filteredCourses.forEach(course => {
            const courseBtn = document.createElement("button");
            courseBtn.classList.add("certificate");
            courseBtn.classList.add(course.subject.toLowerCase());

            // Marcar visualmente si el curso ya fue completado
            if (course.completed) {
                courseBtn.classList.add("highlighted");
            }

            courseBtn.textContent = `${course.subject} ${course.number}`;
            container.appendChild(courseBtn);
        });

        // Calcular el total de créditos utilizando la función reduce()
        const totalCredits = filteredCourses.reduce((sum, course) => sum + course.credits, 0);
        const creditsElement = document.getElementById("total-credits");
        if (creditsElement) {
            creditsElement.textContent = `Total Credits Required: ${totalCredits}`;
        }
    }

    // --- 5. CONFIGURACIÓN DE LOS FILTROS DE CURSOS ---
    const filterButtons = document.querySelectorAll(".filter-btn");

    filterButtons.button = filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Remover la clase 'active' de todos los botones de filtro
            filterButtons.forEach(btn => btn.classList.remove("active"));
            // Agregar la clase 'active' al botón seleccionado
            button.classList.add("active");

            const filter = button.getAttribute("data-filter");

            // Filtrar los cursos según la categoría elegida
            if (filter === "all") {
                displayCourses(courses);
            } else {
                const filtered = courses.filter(course => course.subject.toLowerCase() === filter);
                displayCourses(filtered);
            }
        });
    });

    // Inicializar la vista mostrando todos los cursos por defecto
    displayCourses(courses);
});