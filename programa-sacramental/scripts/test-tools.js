
import { appState, renderAll } from './app.js';

document.addEventListener('DOMContentLoaded', () => {
    const headerContainer = document.querySelector('.header-actions');
    if (!headerContainer) return;

    const testControls = document.createElement('div');
    testControls.className = 'flex-gap-2';
    testControls.innerHTML = `
        <button id="btn-fill-test" class="btn" style="background-color: #f59e0b; color: white;">
            🧪 Fill Sample Data
        </button>
        <button id="btn-clear-test" class="btn" style="background-color: #ef4444; color: white;">
            🗑️ Clear Data
        </button>
    `;

    headerContainer.insertBefore(testControls, headerContainer.firstChild);

    // Event listeners
    document.getElementById('btn-fill-test').addEventListener('click', () => {
        appState.program = {
            ward: 'Central Ward',
            date: '2026-08-16',
            isFastSunday: false,
            presiding: 'Bishop Silva',
            authorities: [{ title: 'High Council', name: 'Brother Ramirez' }],
            announcements: [{ title: 'Ward Activity', description: 'Family home evening this Friday.', dateTime: 'Friday 19:00' }],
            openingHymn: { number: '1', title: 'Reverently and Meekly Now', url: 'https://www.churchofjesuschrist.org', inApp: true },
            openingPrayer: 'Sister Mendoza',
            business: {
                sustainings: [{ name: 'John Doe', role: 'Ward Clerk' }],
                ordinations: [{ name: 'Carlos Lopez' }],
                newMembers: [{ name: 'Gomez Family' }],
                baptizedChildren: [{ name: 'Mateo Fernandez' }],
                blessings: [{ name: 'Sofia Martinez', officiant: 'Richard Martinez', participants: 'Grandfather' }],
                confirmations: [{ name: 'Anna Torres', officiant: 'Elder Smith', participants: 'Elder Johnson' }]
            },
            sacramentHymn: { number: '2', title: 'Faith in Every Footstep', url: 'https://www.churchofjesuschrist.org', inApp: true },
            messages: [{ type: 'speaker', name: 'Brother Perez' }],
            closingHymn: { number: '4', title: 'Hark, Listen to the Trumpeters', url: 'https://www.churchofjesuschrist.org', inApp: false },
            closingPrayer: 'Brother Castro'
        };

        localStorage.setItem('sacramental_app_data', JSON.stringify(appState.program));
        location.reload(); // Reload to refresh inputs
    });

    document.getElementById('btn-clear-test').addEventListener('click', () => {
        localStorage.removeItem('sacramental_app_data');
        location.reload();
    });
});