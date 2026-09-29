/**
 * prueba.js - Herramienta modular de pruebas para el Programa Sacramental.
 * Inyecta botones en el header para llenar y limpiar el formulario en Alpine.js
 * adaptado a la estructura exacta del HTML.
 */

// Función auxiliar para extraer de manera limpia únicamente la URL válida de cualquier texto
function obtenerUrlLimpia(texto) {
    if (!texto) return '';
    const patronUrl = /(https?:\/\/[^\s]+)/g;
    const coincidencias = texto.match(patronUrl);
    return coincidencias ? coincidencias[0] : '';
}

// Datos de prueba con los enlaces de los himnos
const enlacesHimnosPrueba = [
    "https://www.churchofjesuschrist.org/study/manual/hymns/reverently-and-meekly-now?lang=spa",
    "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/faith-in-every-footstep?lang=spa",
    "https://www.churchofjesuschrist.org/study/music/hymns-for-home-and-church/softly-and-tenderly-jesus-is-calling?lang=spa",
    "https://www.churchofjesuschrist.org/study/manual/hymns/hark-listen-to-the-trumpeters?lang=spa"
];

document.addEventListener('DOMContentLoaded', () => {
    // 1. Localizar el contenedor del encabezado (header)
    const headerContainer = document.querySelector('header');
    if (!headerContainer) return;

    // 2. Crear contenedor de los botones de prueba
    const testControls = document.createElement('div');
    testControls.className = 'flex gap-2 mr-2';
    testControls.id = 'herramientas-prueba';

    testControls.innerHTML = `
        <button id="btn-llenar-prueba" class="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-3 rounded-lg shadow transition text-xs flex items-center gap-1">
            🧪 Llenar Datos
        </button>
        <button id="btn-limpiar-prueba" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-lg shadow transition text-xs flex items-center gap-1">
            🗑️ Limpiar
        </button>
    `;

    // Insertar los botones antes del botón de imprimir
    const btnImprimir = headerContainer.querySelector('button');
    if (btnImprimir) {
        headerContainer.insertBefore(testControls, btnImprimir);
    } else {
        headerContainer.appendChild(testControls);
    }

    // 3. Conectar evento del botón "🧪 Llenar Datos"
    document.getElementById('btn-llenar-prueba').addEventListener('click', () => {
        const alpineComponent = Alpine.$data(document.body);
        if (!alpineComponent) return;

        // Limpieza de URLs
        const urlApertura = obtenerUrlLimpia(enlacesHimnosPrueba[0]);
        const urlSacramental = obtenerUrlLimpia(enlacesHimnosPrueba[1]);
        const urlIntermedio = obtenerUrlLimpia(enlacesHimnosPrueba[2]);
        const urlCierre = obtenerUrlLimpia(enlacesHimnosPrueba[3]);

        // Asignación de datos adaptados a la estructura exacta del HTML
        alpineComponent.programa = {
            barrio: 'Barrio Central',
            fecha: '2026-08-16',
            esDomingoAyuno: false,
            preside: 'Obispo Silva',
            autoridadesAcompanantes: [
                { titulo: 'Sumo Consejo', nombre: 'Hermano Ramírez' }
            ],
            anuncios: [
                {
                    titulo: 'Actividad de Barrio',
                    descripcion: 'Noche de hogar de barrio este viernes.',
                    fechaHora: 'Viernes 19:00 hrs'
                }
            ],
            himnoApertura: {
                numero: '1',
                titulo: 'Con mansedumbre y reverencia',
                urlOriginal: enlacesHimnosPrueba[0],
                urlLimpia: urlApertura,
                subidoBiblioteca: true
            },
            oracionApertura: 'Hermana Mendoza',
            asuntos: {
                sostenimientos: [
                    { nombre: 'Juan Pérez', llamamiento: 'Secretario de Barrio' }
                ],
                ordenaciones: [
                    { nombre: 'Carlos López' }
                ],
                nuevosMiembros: [
                    { nombre: 'Familia Gómez' }
                ],
                ninosBautizados: [
                    { nombre: 'Mateo Fernández' }
                ],
                bendicionesNinos: [
                    {
                        nombre: 'Sofía Martínez',
                        oficiante: 'Ricardo Martínez',
                        participantes: 'Abuelo y Tío',
                        conformidadFamilia: true
                    }
                ],
                confirmaciones: [
                    {
                        nombre: 'Ana Torres',
                        oficiante: 'Élder Smith',
                        participantes: 'Élder Johnson'
                    }
                ]
            },
            himnoSacramental: {
                numero: '2',
                titulo: 'Fe en cada paso',
                urlOriginal: enlacesHimnosPrueba[1],
                urlLimpia: urlSacramental,
                subidoBiblioteca: true
            },
            elementosMensajes: [
                { tipo: 'discurso', nombre: 'Hermano Pérez' },
                {
                    tipo: 'himno',
                    numero: '3',
                    titulo: 'Con dulzura y ternura Jesús nos llama',
                    urlOriginal: enlacesHimnosPrueba[2], // Añadido para consistencia
                    urlLimpia: urlIntermedio,
                    subidoBiblioteca: true // Añadido
                }
            ],
            himnoCierre: {
                numero: '4',
                titulo: 'Escuchad el son del clarín',
                urlOriginal: enlacesHimnosPrueba[3],
                urlLimpia: urlCierre,
                subidoBiblioteca: false
            },
            oracionCierre: 'Hermano Castro'
        };

        console.log('¡Datos de prueba cargados correctamente en el formulario!');
    });

    // 4. Conectar evento del botón "🗑️ Limpiar"
    document.getElementById('btn-limpiar-prueba').addEventListener('click', () => {
        const alpineComponent = Alpine.$data(document.body);
        if (!alpineComponent) return;

        // Restablecer el estado del programa a sus valores iniciales exactos
        alpineComponent.programa = {
            barrio: '',
            fecha: '',
            esDomingoAyuno: false,
            preside: '',
            autoridadesAcompanantes: [],
            anuncios: [],
            himnoApertura: { numero: '', titulo: '', urlOriginal: '', urlLimpia: '', subidoBiblioteca: false },
            oracionApertura: '',
            asuntos: {
                sostenimientos: [],
                ordenaciones: [],
                nuevosMiembros: [],
                ninosBautizados: [],
                bendicionesNinos: [],
                confirmaciones: []
            },
            himnoSacramental: { numero: '', titulo: '', urlOriginal: '', urlLimpia: '', subidoBiblioteca: false },
            elementosMensajes: [
                { tipo: 'discurso', nombre: '' }
            ],
            himnoCierre: { numero: '', titulo: '', urlOriginal: '', urlLimpia: '', subidoBiblioteca: false },
            oracionCierre: ''
        };

        console.log('¡Formulario limpiado por completo!');
    });
});