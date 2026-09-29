
// STATE MANAGEMENT OBJECT
export const appState = {
    program: {
        ward: '',
        date: '',
        isFastSunday: false,
        presiding: '',
        authorities: [],
        announcements: [],
        openingHymn: { number: '', title: '', url: '', inApp: false },
        openingPrayer: '',
        business: {
            sustainings: [],
            ordinations: [],
            newMembers: [],
            baptizedChildren: [],
            blessings: [],
            confirmations: []
        },
        sacramentHymn: { number: '', title: '', url: '', inApp: false },
        messages: [{ type: 'speaker', name: '' }],
        closingHymn: { number: '', title: '', url: '', inApp: false },
        closingPrayer: ''
    },
    fetchedHymns: [],
    activeModalTarget: null
};

// INITIALIZE APP ON DOM CONTENT LOADED
document.addEventListener('DOMContentLoaded', () => {
    loadStateFromLocalStorage();
    bindStaticEventListeners();
    fetchHymnsData(); // Fetch API demonstration
    renderAll();
});

/* ==========================================================================
   1. LOCAL STORAGE & FETCH API (Course Requirements)
   ========================================================================== */

/**
 * Saves current app state into browser LocalStorage
 */
function saveStateToLocalStorage() {
    try {
        localStorage.setItem('sacramental_app_data', JSON.stringify(appState.program));
    } catch (error) {
        console.error('Error saving state to LocalStorage:', error);
    }
}

/**
 * Retrieves saved app state from browser LocalStorage
 */
function loadStateFromLocalStorage() {
    try {
        const savedData = localStorage.getItem('sacramental_app_data');
        if (savedData) {
            appState.program = JSON.parse(savedData);
        }
    } catch (error) {
        console.error('Error loading state from LocalStorage:', error);
    }
}

/**
 * Asynchronous Data Fetching using Fetch API and Try...Catch block
 * Meets WDD231 requirement for external/local JSON retrieval.
 */
async function fetchHymnsData() {
    try {
        const response = await fetch('hymns.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        appState.fetchedHymns = await response.json();
        console.log(`Successfully fetched ${appState.fetchedHymns.length} hymns from API.`);
    } catch (error) {
        console.error('Error fetching hymns dataset:', error);
        appState.fetchedHymns = [
            { number: '1', title: 'Reverently and Meekly Now', url: 'https://www.churchofjesuschrist.org' },
            { number: '2', title: 'Faith in Every Footstep', url: 'https://www.churchofjesuschrist.org' }
        ];
    }
}

/* ==========================================================================
   2. EVENT LISTENERS & DOM MANIPULATION
   ========================================================================== */

function bindStaticEventListeners() {
    // Print Button
    document.getElementById('btn-print').addEventListener('click', () => window.print());

    // Basic Inputs
    bindInput('input-ward', 'ward');
    bindInput('input-date', 'date');
    bindInput('input-presiding', 'presiding');
    bindInput('input-opening-prayer', 'openingPrayer');
    bindInput('input-closing-prayer', 'closingPrayer');

    // Fast Sunday Checkbox
    const fastSundayCheck = document.getElementById('input-fast-sunday');
    fastSundayCheck.checked = appState.program.isFastSunday;
    fastSundayCheck.addEventListener('change', (e) => {
        appState.program.isFastSunday = e.target.checked;
        saveStateToLocalStorage();
        renderAll();
    });

    // Opening Hymn Inputs
    bindHymnInputs('openingHymn', 'opening-hymn');
    bindHymnInputs('sacramentHymn', 'sacrament-hymn');
    bindHymnInputs('closingHymn', 'closing-hymn');

    // Dynamic Item Buttons
    document.getElementById('btn-add-authority').addEventListener('click', () => {
        appState.program.authorities.push({ title: '', name: '' });
        updateAndRender();
    });

    document.getElementById('btn-add-announcement').addEventListener('click', () => {
        appState.program.announcements.push({ title: '', description: '', dateTime: '' });
        updateAndRender();
    });

    document.getElementById('btn-add-sustaining').addEventListener('click', () => {
        appState.program.business.sustainings.push({ name: '', role: '' });
        updateAndRender();
    });

    document.getElementById('btn-add-ordination').addEventListener('click', () => {
        appState.program.business.ordinations.push({ name: '' });
        updateAndRender();
    });

    document.getElementById('btn-add-new-member').addEventListener('click', () => {
        appState.program.business.newMembers.push({ name: '' });
        updateAndRender();
    });

    document.getElementById('btn-add-baptized-child').addEventListener('click', () => {
        appState.program.business.baptizedChildren.push({ name: '' });
        updateAndRender();
    });

    document.getElementById('btn-add-blessing').addEventListener('click', () => {
        appState.program.business.blessings.push({ name: '', officiant: '', participants: '' });
        updateAndRender();
    });

    document.getElementById('btn-add-confirmation').addEventListener('click', () => {
        appState.program.business.confirmations.push({ name: '', officiant: '', participants: '' });
        updateAndRender();
    });

    document.getElementById('btn-add-speaker').addEventListener('click', () => {
        appState.program.messages.push({ type: 'speaker', name: '' });
        updateAndRender();
    });

    document.getElementById('btn-add-intermediate-hymn').addEventListener('click', () => {
        const count = appState.program.messages.filter(m => m.type === 'hymn').length;
        if (count >= 1) {
            alert('Only one intermediate hymn is permitted per program.');
            return;
        }
        appState.program.messages.push({ type: 'hymn', number: '', title: '', url: '', inApp: false });
        updateAndRender();
    });

    // Modal Search Dialog Handlers
    const modal = document.getElementById('hymn-modal');
    document.querySelectorAll('.btn-search-hymn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            appState.activeModalTarget = e.target.dataset.target;
            modal.showModal();
            renderModalHymnResults(appState.fetchedHymns);
        });
    });

    document.getElementById('btn-close-modal').addEventListener('click', () => modal.close());

    document.getElementById('modal-search-input').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        // Array Filter Method Requirement
        const filtered = appState.fetchedHymns.filter(h => 
            h.number.includes(query) || h.title.toLowerCase().includes(query)
        );
        renderModalHymnResults(filtered);
    });
}

// Helper function to bind inputs to state
function bindInput(elementId, stateProperty) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.value = appState.program[stateProperty] || '';
    el.addEventListener('input', (e) => {
        appState.program[stateProperty] = e.target.value;
        saveStateToLocalStorage();
        renderPreview();
    });
}

// Helper function for Hymn inputs
function bindHymnInputs(hymnKey, idPrefix) {
    const num = document.getElementById(`${idPrefix}-number`);
    const title = document.getElementById(`${idPrefix}-title`);
    const url = document.getElementById(`${idPrefix}-url`);
    const app = document.getElementById(`${idPrefix}-app`);

    num.value = appState.program[hymnKey].number || '';
    title.value = appState.program[hymnKey].title || '';
    url.value = appState.program[hymnKey].url || '';
    app.checked = appState.program[hymnKey].inApp || false;

    const updateHymn = () => {
        appState.program[hymnKey] = {
            number: num.value,
            title: title.value,
            url: url.value,
            inApp: app.checked
        };
        saveStateToLocalStorage();
        renderPreview();
    };

    num.addEventListener('input', updateHymn);
    title.addEventListener('input', updateHymn);
    url.addEventListener('input', updateHymn);
    app.addEventListener('change', updateHymn);
}

function updateAndRender() {
    saveStateToLocalStorage();
    renderAll();
}

/* ==========================================================================
   3. RENDERING UI FUNCTIONS (Template Literals & DOM Processing)
   ========================================================================== */

export function renderAll() {
    renderFormContainers();
    renderPreview();
}

// Renders dynamic form inputs (left side)
function renderFormContainers() {
    // 1. Authorities Container
    const authContainer = document.getElementById('container-authorities');
    authContainer.innerHTML = appState.program.authorities.map((aut, idx) => `
        <div class="flex-gap-2">
            <input type="text" placeholder="Title/Calling" value="${aut.title}" data-idx="${idx}" data-field="title" class="input-auth">
            <input type="text" placeholder="Full Name" value="${aut.name}" data-idx="${idx}" data-field="name" class="input-auth">
            <button type="button" class="btn-danger-xs btn-remove-auth" data-idx="${idx}">✕</button>
        </div>
    `).join('');

    bindDynamicEvents('.input-auth', (idx, field, val) => appState.program.authorities[idx][field] = val);
    bindRemoveEvents('.btn-remove-auth', (idx) => appState.program.authorities.splice(idx, 1));

    // 2. Announcements Container
    const annContainer = document.getElementById('container-announcements');
    annContainer.innerHTML = appState.program.announcements.map((ann, idx) => `
        <div class="card card-light form-stack">
            <div class="flex-between">
                <span class="text-xs font-bold">Announcement #${idx + 1}</span>
                <button type="button" class="btn-danger-xs btn-remove-ann" data-idx="${idx}">Delete</button>
            </div>
            <input type="text" placeholder="Title" value="${ann.title}" data-idx="${idx}" data-field="title" class="input-ann">
            <textarea placeholder="Description..." data-idx="${idx}" data-field="description" class="input-ann">${ann.description}</textarea>
            <input type="text" placeholder="Date/Time (Optional)" value="${ann.dateTime}" data-idx="${idx}" data-field="dateTime" class="input-ann">
        </div>
    `).join('');

    bindDynamicEvents('.input-ann', (idx, field, val) => appState.program.announcements[idx][field] = val);
    bindRemoveEvents('.btn-remove-ann', (idx) => appState.program.announcements.splice(idx, 1));

    // 3. Sustainings Container
    renderSimpleList('container-sustainings', appState.program.business.sustainings, 'Role / Calling', 'btn-remove-sus', 'input-sus', 'sustainings');
    
    // 4. Ordinations
    renderSingleInputList('container-ordinations', appState.program.business.ordinations, 'Brother\'s Name', 'btn-remove-ord', 'input-ord', 'ordinations');

    // 5. New Members
    renderSingleInputList('container-new-members', appState.program.business.newMembers, 'Full Name', 'btn-remove-nm', 'input-nm', 'newMembers');

    // 6. Baptized Children
    renderSingleInputList('container-baptized-children', appState.program.business.baptizedChildren, 'Child\'s Name', 'btn-remove-bc', 'input-bc', 'baptizedChildren');

    // 7. Blessings Container
    const blessContainer = document.getElementById('container-blessings');
    blessContainer.innerHTML = appState.program.business.blessings.map((b, idx) => `
        <div class="card card-light form-stack">
            <div class="flex-between">
                <span class="text-xs font-bold text-amber-dark">Child #${idx + 1}</span>
                <button type="button" class="btn-danger-xs btn-remove-bless" data-idx="${idx}">Delete</button>
            </div>
            <input type="text" placeholder="Child's Full Name" value="${b.name}" data-idx="${idx}" data-field="name" class="input-bless">
            <input type="text" placeholder="Principal Officiant" value="${b.officiant}" data-idx="${idx}" data-field="officiant" class="input-bless">
            <input type="text" placeholder="Other Participants (Optional)" value="${b.participants}" data-idx="${idx}" data-field="participants" class="input-bless">
        </div>
    `).join('');

    bindDynamicEvents('.input-bless', (idx, field, val) => appState.program.business.blessings[idx][field] = val);
    bindRemoveEvents('.btn-remove-bless', (idx) => appState.program.business.blessings.splice(idx, 1));

    // 8. Confirmations Container
    const confContainer = document.getElementById('container-confirmations');
    confContainer.innerHTML = appState.program.business.confirmations.map((c, idx) => `
        <div class="card card-light form-stack">
            <div class="flex-between">
                <span class="text-xs font-bold text-green-dark">Converse #${idx + 1}</span>
                <button type="button" class="btn-danger-xs btn-remove-conf" data-idx="${idx}">Delete</button>
            </div>
            <input type="text" placeholder="Person's Full Name" value="${c.name}" data-idx="${idx}" data-field="name" class="input-conf">
            <input type="text" placeholder="Officiant" value="${c.officiant}" data-idx="${idx}" data-field="officiant" class="input-conf">
            <input type="text" placeholder="Other Participants (Optional)" value="${c.participants}" data-idx="${idx}" data-field="participants" class="input-conf">
        </div>
    `).join('');

    bindDynamicEvents('.input-conf', (idx, field, val) => appState.program.business.confirmations[idx][field] = val);
    bindRemoveEvents('.btn-remove-conf', (idx) => appState.program.business.confirmations.splice(idx, 1));

    // Fast Sunday UI Toggle
    const alertBox = document.getElementById('fast-sunday-alert');
    const spkModule = document.getElementById('speakers-music-module');

    if (appState.program.isFastSunday) {
        alertBox.classList.remove('hidden');
        spkModule.classList.add('hidden');
    } else {
        alertBox.classList.add('hidden');
        spkModule.classList.remove('hidden');
    }
}

// Helper for generic list rendering
function renderSimpleList(containerId, list, secondPlaceholder, removeClass, inputClass, key) {
    document.getElementById(containerId).innerHTML = list.map((item, idx) => `
        <div class="flex-gap-2">
            <input type="text" placeholder="Full Name" value="${item.name}" data-idx="${idx}" data-field="name" class="${inputClass}">
            <input type="text" placeholder="${secondPlaceholder}" value="${item.role}" data-idx="${idx}" data-field="role" class="${inputClass}">
            <button type="button" class="btn-danger-xs ${removeClass}" data-idx="${idx}">✕</button>
        </div>
    `).join('');

    bindDynamicEvents(`.${inputClass}`, (idx, field, val) => appState.program.business[key][idx][field] = val);
    bindRemoveEvents(`.${removeClass}`, (idx) => appState.program.business[key].splice(idx, 1));
}

function renderSingleInputList(containerId, list, placeholder, removeClass, inputClass, key) {
    document.getElementById(containerId).innerHTML = list.map((item, idx) => `
        <div class="flex-gap-2">
            <input type="text" placeholder="${placeholder}" value="${item.name}" data-idx="${idx}" data-field="name" class="${inputClass}">
            <button type="button" class="btn-danger-xs ${removeClass}" data-idx="${idx}">✕</button>
        </div>
    `).join('');

    bindDynamicEvents(`.${inputClass}`, (idx, field, val) => appState.program.business[key][idx][field] = val);
    bindRemoveEvents(`.${removeClass}`, (idx) => appState.program.business[key].splice(idx, 1));
}

// Helpers for event binding on dynamic lists
function bindDynamicEvents(selector, updateCallback) {
    document.querySelectorAll(selector).forEach(input => {
        input.addEventListener('input', (e) => {
            const idx = e.target.dataset.idx;
            const field = e.target.dataset.field;
            updateCallback(idx, field, e.target.value);
            saveStateToLocalStorage();
            renderPreview();
        });
    });
}

function bindRemoveEvents(selector, removeCallback) {
    document.querySelectorAll(selector).forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = e.target.dataset.idx;
            removeCallback(idx);
            updateAndRender();
        });
    });
}

/* Renders Right Side Preview Document */
function renderPreview() {
    const p = appState.program;

    document.getElementById('preview-ward-date').textContent = 
        `Ward: ${p.ward || '_________'} | Date: ${p.date || '_________'}`;

    const fastTag = document.getElementById('preview-fast-tag');
    p.isFastSunday ? fastTag.classList.remove('hidden') : fastTag.classList.add('hidden');

    document.getElementById('preview-presiding').textContent = p.presiding || '__________________________';

    // Authorities list using Array Map
    const authList = document.getElementById('preview-authorities');
    authList.innerHTML = p.authorities.length > 0 
        ? p.authorities.map(a => `<li>${a.title ? a.title + ': ' : ''}${a.name || '___________'}</li>`).join('')
        : '<li>__________________________</li>';

    // Announcements
    const annBox = document.getElementById('preview-announcements-box');
    const annList = document.getElementById('preview-announcements-list');
    if (p.announcements.length > 0) {
        annBox.classList.remove('hidden');
        annList.innerHTML = p.announcements.map(a => `
            <div>
                <p class="font-bold">${a.title}</p>
                <p class="text-xs">${a.description}</p>
                ${a.dateTime ? `<p class="text-xs italic text-muted">📅 ${a.dateTime}</p>` : ''}
            </div>
        `).join('');
    } else {
        annBox.classList.add('hidden');
    }

    // Hymns
    formatHymnPreview('preview-opening-hymn', 'preview-opening-app-tag', p.openingHymn);
    formatHymnPreview('preview-sacrament-hymn', 'preview-sacrament-app-tag', p.sacramentHymn);
    formatHymnPreview('preview-closing-hymn', 'preview-closing-app-tag', p.closingHymn);

    document.getElementById('preview-opening-prayer').textContent = p.openingPrayer || '__________________________';
    document.getElementById('preview-closing-prayer').textContent = p.closingPrayer || '__________________________';

    // Ward Business Preview
    renderBusinessPreview();

    // Messages Preview
    const msgList = document.getElementById('preview-messages-list');
    if (p.isFastSunday) {
        msgList.innerHTML = '<p class="italic">Time reserved for congregational testimonies.</p>';
    } else {
        msgList.innerHTML = p.messages.map(m => {
            if (m.type === 'speaker') {
                return `<p>• <strong>Speaker:</strong> ${m.name || '__________________________'}</p>`;
            } else {
                return `<p class="text-primary">• <strong>Congregational Hymn:</strong> #${m.number || ''} - ${m.title || '__________________________'}</p>`;
            }
        }).join('');
    }

    // Ordinance Support Cards
    renderOrdinanceCards();
}

function formatHymnPreview(elementId, tagId, hymn) {
    const el = document.getElementById(elementId);
    const tag = document.getElementById(tagId);

    const text = (hymn.number ? `#${hymn.number} - ` : '') + (hymn.title || '__________________________');
    el.innerHTML = hymn.url ? `<a href="${hymn.url}" target="_blank" class="external-link">${text}</a>` : text;

    hymn.inApp ? tag.classList.remove('hidden') : tag.classList.add('hidden');
}

function renderBusinessPreview() {
    const b = appState.program.business;
    const container = document.getElementById('preview-business-content');
    let html = '';

    if (b.sustainings.length > 0) {
        html += `<p class="font-bold">Sustainings and Releases:</p>`;
        html += b.sustainings.map(s => `<p class="margin-left">• ${s.name} - <em>${s.role}</em></p>`).join('');
    }
    if (b.ordinations.length > 0) {
        html += `<p class="font-bold">Aaronic Priesthood Ordinations:</p>`;
        html += b.ordinations.map(o => `<p class="margin-left">• ${o.name}</p>`).join('');
    }
    if (b.newMembers.length > 0) {
        html += `<p class="font-bold">New Members Welcome:</p>`;
        html += b.newMembers.map(n => `<p class="margin-left">• ${n.name}</p>`).join('');
    }
    if (b.baptizedChildren.length > 0) {
        html += `<p class="font-bold">Recently Baptized Children:</p>`;
        html += b.baptizedChildren.map(c => `<p class="margin-left">• ${c.name}</p>`).join('');
    }

    container.innerHTML = html || '<p class="italic text-gray-500">No pending ward business recorded.</p>';
}

function renderOrdinanceCards() {
    const b = appState.program.business;

    // Blessings Cards
    const blessSec = document.getElementById('preview-blessings-section');
    const blessCards = document.getElementById('preview-blessings-cards');
    if (b.blessings.length > 0) {
        blessSec.classList.remove('hidden');
        blessCards.innerHTML = b.blessings.map(child => `
            <div class="card card-amber form-stack page-break-avoid">
                <p class="text-xs font-bold uppercase text-amber-dark">Child Blessing Card</p>
                <p class="text-xs">Child's Name: <strong>${child.name || '__________________________'}</strong></p>
                <p class="text-xs">Officiant: <strong>${child.officiant || '__________________________'}</strong></p>
                <div class="card card-light text-xs italic">
                    "Heavenly Father, by authority of the Melchizedek Priesthood, we give the name of <strong>${child.name || '[Child Name]'}</strong> and pronounce a blessing..."
                </div>
            </div>
        `).join('');
    } else {
        blessSec.classList.add('hidden');
    }

    // Confirmation Cards
    const confSec = document.getElementById('preview-confirmations-section');
    const confCards = document.getElementById('preview-confirmations-cards');
    if (b.confirmations.length > 0) {
        confSec.classList.remove('hidden');
        confCards.innerHTML = b.confirmations.map(conf => `
            <div class="card card-green form-stack page-break-avoid">
                <p class="text-xs font-bold uppercase text-green-dark">Confirmation Card</p>
                <p class="text-xs">Person: <strong>${conf.name || '__________________________'}</strong></p>
                <p class="text-xs">Officiant: <strong>${conf.officiant || '__________________________'}</strong></p>
                <div class="card card-light text-xs italic text-center">
                    "By authority of the Melchizedek Priesthood, I confirm you a member of The Church of Jesus Christ of Latter-day Saints and say unto you: Receive the Holy Ghost. In the name of Jesus Christ. Amen."
                </div>
            </div>
        `).join('');
    } else {
        confSec.classList.add('hidden');
    }
}

function renderModalHymnResults(hymns) {
    const resultsContainer = document.getElementById('modal-hymns-results');
    resultsContainer.innerHTML = hymns.map(h => `
        <div class="hymn-item" data-number="${h.number}" data-title="${h.title}" data-url="${h.url}">
            <strong>#${h.number}</strong> - ${h.title}
        </div>
    `).join('');

    document.querySelectorAll('.hymn-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const targetKey = appState.activeModalTarget;
            if (targetKey && appState.program[targetKey]) {
                appState.program[targetKey].number = e.currentTarget.dataset.number;
                appState.program[targetKey].title = e.currentTarget.dataset.title;
                appState.program[targetKey].url = e.currentTarget.dataset.url;
                
                // Re-populate inputs in form
                document.getElementById(`${targetKey === 'openingHymn' ? 'opening' : targetKey === 'sacramentHymn' ? 'sacrament' : 'closing'}-hymn-number`).value = e.currentTarget.dataset.number;
                document.getElementById(`${targetKey === 'openingHymn' ? 'opening' : targetKey === 'sacramentHymn' ? 'sacrament' : 'closing'}-hymn-title`).value = e.currentTarget.dataset.title;
                document.getElementById(`${targetKey === 'openingHymn' ? 'opening' : targetKey === 'sacramentHymn' ? 'sacrament' : 'closing'}-hymn-url`).value = e.currentTarget.dataset.url;

                updateAndRender();
                document.getElementById('hymn-modal').close();
            }
        });
    });
}