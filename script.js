const initialData = [
    {
        id: 1,
        title: "Module 1",
        location: "Rennes",
        startDate: "2026-03-09",
        endDate: "2026-03-13",
        hotels: [
            {
                id: "h1",
                name: "Le Sévigné",
                address: "47bis Av. Jean Janvier, 35000, Rennes",
                image: "https://images.bestwestern.com/bwi/brochures/93971/photos/1024/26041023.jpg",
                checkIn: "2026-03-09",
                checkOut: "2026-03-10",
                times: "Check-in: après 15h | Check-out: avant 12h",
                amenities: ["Chambre double classique", "1 lit double", "Pas de repas inclus"],
                ref: "572403654",
                price: 52.50,
                status: "paid",
                platform: null
            },
            {
                id: "h2",
                name: "Best Western Plus Hôtel Isidore",
                address: "1, Rue Nicéphore Niépce, 35136, Rennes-St Jacques de la Lande",
                image: "https://images.bestwestern.com/bwi/brochures/93799/photos/1024/17214791.jpg",
                checkIn: "2026-03-10",
                checkOut: "2026-03-12",
                times: "Check-in: 14h-21h | Check-out: 08h-12h",
                amenities: ["Chambre: 1 (2 Adultes)", "Petit-déjeuner inclus", "Parking intérieur privé", "Accès à l'espace détente"],
                ref: "37160845",
                price: 239.00,
                status: "pending",
                platform: null
            },
            {
                id: "h3",
                name: "BW Premier Collection Le Saint Antoine",
                address: "27 avenue Jean Janvier, Rennes",
                image: "https://images.bestwestern.com/bwi/brochures/95018/photos/1024/15674902.jpg",
                checkIn: "2026-03-12",
                checkOut: "2026-03-13",
                times: "Arrivée: 14h | Départ: 12h",
                amenities: ["Chambre Supérieure", "1 grand lit", "Non-fumeurs"],
                ref: "8929359712",
                price: 116.24,
                status: "pending",
                platform: "Vio",
                deadline: "Prix garanti jusqu'au 21 févr. 2026"
            }
        ],
        transports: [
            {
                id: "t1",
                title: "Paris Montparnasse 1 Et 2 vers Rennes",
                type: "train",
                outbound: {
                    label: "ALLER",
                    date: "2026-03-09T09:54"
                },
                return: {
                    label: "RETOUR",
                    date: "2026-03-13T13:35"
                },
                ref: "LKB9AM",
                price: 112.00,
                status: "paid"
            }
        ]
    },
    {
        id: 2,
        title: "Module 2",
        location: "Rennes",
        startDate: "2026-05-18",
        endDate: "2026-05-22",
        hotels: [],
        transports: []
    },
    {
        id: 3,
        title: "Module 3",
        location: "Rennes",
        startDate: "2026-06-15",
        endDate: "2026-06-19",
        hotels: [
            {
                id: "h4",
                name: "Kyriad Rennes Centre Gare",
                address: "6 Place De La Gare, Rennes, 35000",
                image: "https://image.kyriad.com/data/4/hotel/7/6/7/6767/6767_outside_view_1.jpg",
                checkIn: "2026-06-15",
                checkOut: "2026-06-19",
                times: "Check-in: 14h30 - 00h00 | Check-out: avant 12h",
                amenities: ["Standard Room, 1 Double Bed", "1 Adulte", "Free WiFi"],
                ref: "9019224702516",
                price: 472.32,
                status: "pending",
                platform: "Revolut",
                deadline: "Payer sur place. Annul. gratuite jusqu'au 26 Mai"
            }
        ],
        transports: []
    },
    {
        id: 4,
        title: "Module 4",
        location: "Rennes",
        startDate: "2026-09-07",
        endDate: "2026-09-11",
        hotels: [],
        transports: []
    },
    {
        id: 5,
        title: "Module 5",
        location: "Rennes",
        startDate: "2026-10-05",
        endDate: "2026-10-09",
        hotels: [],
        transports: []
    },
    {
        id: 6,
        title: "Module 6",
        location: "Rennes",
        startDate: "2026-12-07",
        endDate: "2026-12-11",
        hotels: [],
        transports: []
    }
];

// --- Data Management ---
let state = {
    sessions: []
};

function loadData() {
    const stored = localStorage.getItem('sessions_data');
    if (stored) {
        state.sessions = JSON.parse(stored);
    } else {
        state.sessions = JSON.parse(JSON.stringify(initialData));
        saveData();
    }
}

function saveData() {
    localStorage.setItem('sessions_data', JSON.stringify(state.sessions));
}

// --- Utils ---
const escapeHTML = (str) => {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[&<>"']/g, function(m) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[m];
    });
};

const parseDateString = (dateStr) => {
    if (!dateStr) return new Date();
    // Handle YYYY-MM-DD
    if (dateStr.length === 10 && dateStr.indexOf('-') === 4) {
        const [y, m, d] = dateStr.split('-').map(Number);
        return new Date(y, m - 1, d);
    }
    // Handle YYYY-MM-DDTHH:MM (datetime-local) or other ISO
    return new Date(dateStr);
};

const formatMonth = (dateStr) => {
    const d = parseDateString(dateStr);
    return d.toLocaleString('fr-FR', { month: 'short' }).toUpperCase().replace('.', '');
};

const formatDay = (dateStr) => {
    const d = parseDateString(dateStr);
    return d.getDate().toString().padStart(2, '0');
};

const formatFullDate = (dateStr) => {
    const d = parseDateString(dateStr);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

const formatDateTime = (dateStr) => {
    const d = new Date(dateStr); // datetime-local format is safe to pass to Date() constructor for local time usually, but consistency is key.
    // However, datetime-local value '2026-03-09T09:54' passed to Date() works in local time.
    return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) +
           ' à ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

const formatPrice = (price) => {
    return parseFloat(price).toFixed(2).replace('.', ',') + ' €';
};

// --- Rendering Logic ---

function renderApp() {
    const container = document.getElementById('app-container');
    container.innerHTML = '';

    // Sort sessions by date
    state.sessions.sort((a, b) => {
        const dateA = a.startDate ? a.startDate : '';
        const dateB = b.startDate ? b.startDate : '';
        return dateA.localeCompare(dateB);
    });

    state.sessions.forEach(module => {
        container.appendChild(createModuleCard(module));
    });
}

function createModuleCard(module) {
    const article = document.createElement('article');
    article.className = 'module';
    article.dataset.id = module.id;

    const startDay = formatDay(module.startDate);
    const endDay = formatDay(module.endDate);
    const month = formatMonth(module.startDate);

    // Module Header
    let html = `
        <div class="module-header">
            <div class="date-badge">
                <span class="day-month">${escapeHTML(startDay)}-${escapeHTML(endDay)}</span>
                <span class="month-name">${escapeHTML(month)}</span>
            </div>
            <div class="module-info">
                <h2>${escapeHTML(module.title)}</h2>
                <p>${escapeHTML(module.location)}</p>
            </div>
            <div class="accordion-icon">
                <i class="fas fa-chevron-down"></i>
            </div>
        </div>
        <div class="module-content">
            <!-- Hotels Section -->
            <section class="details-section">
                <div class="section-title">
                    <div class="icon-box"><i class="fas fa-hotel"></i></div>
                    <h3>Hébergement</h3>
                    <button class="btn-icon-small add-hotel-btn" data-id="${escapeHTML(module.id)}"><i class="fas fa-plus"></i></button>
                </div>
                <div class="timeline">
                    ${renderHotels(module.hotels, module)}
                </div>
            </section>

            <!-- Transports Section -->
            <section class="details-section">
                <div class="section-title">
                    <div class="icon-box"><i class="fas fa-train"></i></div>
                    <h3>Votre voyage</h3>
                    <button class="btn-icon-small add-transport-btn" data-id="${escapeHTML(module.id)}"><i class="fas fa-plus"></i></button>
                </div>
                <div class="timeline">
                    ${renderTransports(module.transports, module)}
                </div>
            </section>
        </div>
    `;

    article.innerHTML = html;

    // Attach header click (Accordion)
    const header = article.querySelector('.module-header');
    header.addEventListener('click', (e) => {
         // Prevent closing if we clicked something interactive inside header (unlikely here but good practice)
         if (e.target.closest('button')) return;
         toggleAccordion(article);
    });

    // Attach Add Buttons
    article.querySelector('.add-hotel-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        openModal('modal-add-hotel', module.id);
    });

    article.querySelector('.add-transport-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        openModal('modal-add-transport', module.id);
    });

    return article;
}

function toggleAccordion(moduleElement) {
    const isOpen = moduleElement.classList.contains('expanded');

    // Close all others
    document.querySelectorAll('.module').forEach(m => {
        m.classList.remove('expanded');
        const icon = m.querySelector('.accordion-icon i');
        if (icon) {
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        }
    });

    if (!isOpen) {
        moduleElement.classList.add('expanded');
        const icon = moduleElement.querySelector('.accordion-icon i');
        if (icon) {
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        }
    }
}


function renderHotels(hotels, module) {
    if (!hotels || hotels.length === 0) {
        return createEmptyState('hotel', module);
    }

    return hotels.map((hotel, index) => {
        const isLast = index === hotels.length - 1;
        const lineClass = isLast ? 'solid' : '';

        return `
            <div class="timeline-item">
                <div class="timeline-left">
                    <div class="timeline-line ${lineClass}"></div>
                    <div class="timeline-marker"></div>
                </div>
                <div class="timeline-content">
                    <div class="card-details has-thumb">
                        <div class="thumb-container">
                            <img src="${escapeHTML(hotel.image) || 'https://via.placeholder.com/150?text=Hotel'}" alt="${escapeHTML(hotel.name)}" class="hotel-thumb">
                        </div>
                        <div class="details-body">
                            <h4>${escapeHTML(hotel.name)}</h4>
                            <p class="address">${escapeHTML(hotel.address)}</p>

                            <div class="date-info">
                                <i class="far fa-calendar-alt"></i> ${escapeHTML(formatFullDate(hotel.checkIn))} - ${escapeHTML(formatFullDate(hotel.checkOut))}
                            </div>
                            <p class="check-times">${escapeHTML(hotel.times || '')}</p>

                            ${hotel.amenities ? `<ul class="amenities">${hotel.amenities.map(a => `<li>${escapeHTML(a)}</li>`).join('')}</ul>` : ''}

                            <div class="price-row">
                                <span class="ref">${hotel.ref ? 'Réf: ' + escapeHTML(hotel.ref) : ''}</span>
                                <div class="price-info">
                                    <span class="status-badge ${escapeHTML(hotel.status)}">${hotel.status === 'paid' ? 'Payé' : 'À payer'}</span>
                                    <span class="price">${escapeHTML(formatPrice(hotel.price))}</span>
                                </div>
                            </div>
                            ${hotel.platform ? `
                            <div class="platform-info">
                                Réservé via <span class="platform-tag">${escapeHTML(hotel.platform)}</span>
                            </div>` : ''}
                            ${hotel.deadline ? `
                            <div class="deadline-info">
                                <i class="fas fa-exclamation-circle"></i> ${escapeHTML(hotel.deadline)}
                            </div>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderTransports(transports, module) {
    if (!transports || transports.length === 0) {
        return createEmptyState('transport', module);
    }

    return transports.map((trip, index) => {
         const isLast = index === transports.length - 1;
         return `
            <div class="timeline-item">
                <div class="timeline-left">
                    <div class="timeline-line ${isLast ? 'solid' : ''}"></div>
                    <div class="timeline-marker"></div>
                </div>
                <div class="timeline-content">
                    <div class="card-details">
                        <h4>${escapeHTML(trip.title)}</h4>

                        <div class="trip-leg">
                            <span class="leg-label">${escapeHTML(trip.outbound.label)}</span>
                            <p class="leg-time">${escapeHTML(formatDateTime(trip.outbound.date))}</p>
                        </div>

                        ${trip.return ? `
                        <div class="trip-leg">
                            <span class="leg-label">${escapeHTML(trip.return.label)}</span>
                            <p class="leg-time">${escapeHTML(formatDateTime(trip.return.date))}</p>
                        </div>` : ''}

                        <div class="price-row">
                            <span class="ref">Réf: ${escapeHTML(trip.ref || 'N/A')}</span>
                            <div class="price-info">
                                <span class="status-badge ${escapeHTML(trip.status)}">${trip.status === 'paid' ? 'Payé' : 'À payer'}</span>
                                <span class="price">${escapeHTML(formatPrice(trip.price))}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         `;
    }).join('');
}

function createEmptyState(type, module) {
    const icon = type === 'hotel' ? 'fa-bed' : 'fa-train';
    const text = type === 'hotel' ? "Pas d'hébergement réservé" : "Pas de voyage réservé";
    const subtext = type === 'hotel' ? "Aucune réservation pour cette session." : "Aucun billet de train enregistré.";
    const start = formatFullDate(module.startDate);
    const end = formatFullDate(module.endDate);

    return `
        <div class="timeline-item empty-state">
            <div class="timeline-left">
                <div class="timeline-line solid"></div>
                <div class="timeline-marker empty"></div>
            </div>
            <div class="timeline-content">
                <div class="card-details has-thumb empty-card">
                    <div class="thumb-container empty-thumb">
                        <i class="fas ${icon}"></i>
                    </div>
                    <div class="details-body">
                        <h4>${text}</h4>
                        <div class="date-info">
                            <i class="far fa-calendar-alt"></i> ${escapeHTML(start)} - ${escapeHTML(end)}
                        </div>
                        <p class="address">${subtext}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// --- Interaction Logic ---

function setupEventListeners() {
    // Bottom Nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            // Logic for switching views can go here (home, calendar, etc.)
        });
    });

    // FAB - Add Module
    const fab = document.getElementById('fab-add');
    if (fab) {
        fab.addEventListener('click', () => {
            document.getElementById('modal-add-module').showModal();
        });
    }

    // Modal Close Buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('dialog');
            modal.close();
        });
    });

    // Form: Add Module
    document.getElementById('form-add-module').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const newModule = {
            id: Date.now(),
            title: formData.get('title'),
            location: formData.get('location'),
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            hotels: [],
            transports: []
        };

        state.sessions.push(newModule);
        saveData();
        renderApp();
        e.target.reset();
        document.getElementById('modal-add-module').close();
    });

    // Form: Add Hotel
    document.getElementById('form-add-hotel').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const moduleId = parseInt(formData.get('moduleId'));
        const module = state.sessions.find(s => s.id === moduleId);

        if (module) {
            const newHotel = {
                id: 'h' + Date.now(),
                name: formData.get('name'),
                address: formData.get('address'),
                checkIn: formData.get('checkIn'),
                checkOut: formData.get('checkOut'),
                price: formData.get('price'),
                status: formData.get('status'),
                image: formData.get('image'),
                times: "Check-in: 14h | Check-out: 12h", // Default
                amenities: ["Standard Room"], // Default
            };
            module.hotels.push(newHotel);
            saveData();
            renderApp();

            // Re-open module to show change? Or just keep it closed/preserve state?
            // Currently renderApp resets state (all closed).
            // Ideally we should preserve expanded state.

            // Find the rendered module and expand it
            setTimeout(() => {
                const el = document.querySelector(`.module[data-id="${moduleId}"]`);
                if(el) toggleAccordion(el);
            }, 100);
        }
        e.target.reset();
        document.getElementById('modal-add-hotel').close();
    });

    // Form: Add Transport
    document.getElementById('form-add-transport').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const moduleId = parseInt(formData.get('moduleId'));
        const module = state.sessions.find(s => s.id === moduleId);

        if (module) {
            const newTransport = {
                id: 't' + Date.now(),
                title: formData.get('title'),
                type: formData.get('type'),
                price: formData.get('price'),
                status: formData.get('status'),
                outbound: {
                    label: "ALLER",
                    date: formData.get('outboundDate')
                },
                return: {
                    label: "RETOUR",
                    date: formData.get('returnDate')
                }
            };
            module.transports.push(newTransport);
            saveData();
            renderApp();

            setTimeout(() => {
                const el = document.querySelector(`.module[data-id="${moduleId}"]`);
                if(el) toggleAccordion(el);
            }, 100);
        }
        e.target.reset();
        document.getElementById('modal-add-transport').close();
    });
}

function openModal(modalId, moduleId = null) {
    const modal = document.getElementById(modalId);
    if (moduleId) {
        const input = modal.querySelector('input[name="moduleId"]');
        if (input) input.value = moduleId;
    }
    modal.showModal();
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderApp();
    setupEventListeners();

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('SW Registered'))
            .catch(err => console.log('SW Fail', err));
    }
});
