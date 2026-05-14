/* ============================================
   JM2 ENGINEERING - SERVICE DETAIL OVERLAY
   Rockstar-style expandable service panels
   ============================================ */

// Embedded services data (fallback for browsers that block fetch on local files)
const SERVICES_FALLBACK = {
    "services": {
        "engineering": {
            "title": "Engineering Services",
            "subtitle": "20+ Years of Mechanical & Electrical Design Excellence",
            "intro": "JM2 Associates brings two decades of experience designing mechanical and electrical systems for industrial, distribution, institutional, educational, medical, food processing, and commercial facilities.",
            "image": "assets/images/large-1.jpg",
            "capabilities": [
                { "title": "HVAC Systems", "description": "Central equipment design, ductwork and piping layouts featuring humidity control, pressurization, refrigeration, and energy-efficient solutions.", "icon": "hvac" },
                { "title": "Plumbing Systems", "description": "Complete sizing and detailing, including specialized services like process waste and syphonic roof drainage.", "icon": "plumbing" },
                { "title": "Electrical Systems", "description": "Power distribution, lighting design, motor controls, and low voltage systems for commercial and industrial facilities.", "icon": "power" },
                { "title": "Industrial & Process", "description": "Process piping design from conceptual to fabrication-level drawings, plus ventilation, dust collection, and compressed air systems.", "icon": "industrial" },
                { "title": "Fire Protection", "description": "Sprinkler system sizing, selection, and layout plus fire alarm integration for comprehensive building protection.", "icon": "fire" },
                { "title": "Energy & LEED", "description": "Energy-efficient retrofits and new construction solutions with LEED certification expertise.", "icon": "energy" }
            ],
            "additionalServices": ["Project Management & Oversight", "Contractor Qualification & Bid Review", "Arc Flash & Electrical Safety Studies", "New Construction Commissioning", "Retro-Commissioning Services", "Test and Balance Verification"]
        },
        "bim": {
            "title": "BIM Modeling",
            "subtitle": "Building Information Modeling for the Modern Age",
            "intro": "JM2 has 8+ years of expertise modeling MEP systems for coordination and prefabrication, serving as both lead coordinators and team participants on major projects.",
            "image": "assets/images/Large-3.jpg",
            "capabilities": [
                { "title": "MEP Coordination", "description": "Full 3D coordination of mechanical, electrical, and plumbing systems to identify and resolve conflicts before construction.", "icon": "coordination" },
                { "title": "Prefabrication Support", "description": "Detailed models enabling off-site fabrication of MEP components, reducing field labor and improving quality.", "icon": "prefab" },
                { "title": "Energy Analysis", "description": "Building loads analysis, energy calculations, and lifetime cost evaluation for informed decision making.", "icon": "energy" },
                { "title": "Project Scheduling", "description": "4D BIM integration linking 3D models with construction schedules for visual project planning.", "icon": "schedule" }
            ],
            "software": ["Autodesk Revit with Fabrication Add-ons", "Navisworks for Clash Detection", "Building Load Calculation Tools", "MEP System Efficiency Analysis"],
            "approach": "We emphasize detail and installation feasibility, utilizing advanced software to create models that closely match real-world conditions for seamless installation."
        },
        "scanning": {
            "title": "3D Point Cloud Scanning",
            "subtitle": "Precision As-Built Documentation",
            "intro": "Laser scanning technology that rotates 360 degrees to collect 3D location data, creating near-perfect as-built documentation of existing conditions.",
            "image": "assets/images/Blu-2.jpg",
            "capabilities": [
                { "title": "As-Built Documentation", "description": "Capture existing conditions with millimeter accuracy for renovation and retrofit projects.", "icon": "documentation" },
                { "title": "Virtual Walkthroughs", "description": "Eliminate reliance on photographs and field measurements with immersive 3D environment exploration.", "icon": "walkthrough" },
                { "title": "Coordination & Sharing", "description": "Share accurate existing conditions with all project stakeholders through integrated BIM workflows.", "icon": "sharing" },
                { "title": "Prefabrication Planning", "description": "Enable accurate MEP prefabrication by knowing exact field conditions before manufacturing.", "icon": "planning" }
            ],
            "benefits": ["Reduces rework costs significantly", "Improves field safety through planning", "Eliminates weeks of rough-in activities", "Enables advanced prefabrication coordination", "Creates permanent digital record of facilities"]
        }
    }
};

let servicesData = SERVICES_FALLBACK;
let isDetailOpen = false;

// Load services data on page load
document.addEventListener('DOMContentLoaded', async function() {
    await loadServicesData();
    initServicePanels();
});

// Load the services JSON data (uses fallback if fetch fails)
async function loadServicesData() {
    try {
        const response = await fetch('data/services.json');
        servicesData = await response.json();
    } catch (error) {
        console.warn('Using embedded services data (fetch blocked or failed)');
        servicesData = SERVICES_FALLBACK;
    }
}

// Initialize click handlers for service panels
function initServicePanels() {
    const servicePanels = document.querySelectorAll('.service-panel[data-service]');
    const overlay = document.getElementById('serviceDetailOverlay');
    const backBtn = document.getElementById('serviceDetailBack');

    servicePanels.forEach(function(panel) {
        panel.addEventListener('click', function() {
            const serviceKey = this.dataset.service;
            openServiceDetail(serviceKey);
        });
    });

    // Back button handler
    if (backBtn) {
        backBtn.addEventListener('click', closeServiceDetail);
    }

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isDetailOpen) {
            closeServiceDetail();
        }
    });
}

// Open the service detail overlay
function openServiceDetail(serviceKey) {
    if (!servicesData || !servicesData.services[serviceKey]) return;

    const service = servicesData.services[serviceKey];
    const overlay = document.getElementById('serviceDetailOverlay');
    const content = document.getElementById('serviceDetailContent');

    // Build the detail content HTML
    content.innerHTML = buildServiceDetailHTML(service, serviceKey);

    // Prevent body scroll
    document.body.classList.add('detail-open');

    // Animate the main content sliding right and fading
    gsap.to('main', {
        x: '30%',
        opacity: 0.2,
        filter: 'blur(10px)',
        duration: 0.6,
        ease: 'power3.out'
    });

    // Reset scroll position and show overlay
    overlay.scrollTop = 0;
    window.scrollTo(0, 0);
    overlay.classList.add('active');
    gsap.fromTo(overlay,
        { x: '100%', opacity: 0 },
        { x: '0%', opacity: 1, duration: 0.6, ease: 'power3.out' }
    );

    // Stagger animate the content items
    setTimeout(function() {
        const items = document.querySelectorAll('.service-detail-item');
        if (items.length > 0) {
            gsap.fromTo(items,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out' }
            );
        }
    }, 200);

    isDetailOpen = true;
}

// Close the service detail overlay
function closeServiceDetail() {
    const overlay = document.getElementById('serviceDetailOverlay');

    // Animate overlay out
    gsap.to(overlay, {
        x: '100%',
        opacity: 0,
        duration: 0.5,
        ease: 'power3.in',
        onComplete: function() {
            overlay.classList.remove('active');
        }
    });

    // Restore main content
    gsap.to('main', {
        x: '0%',
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.5,
        ease: 'power3.out'
    });

    // Restore body scroll
    document.body.classList.remove('detail-open');

    isDetailOpen = false;
}

// Build the HTML for the service detail view
function buildServiceDetailHTML(service, serviceKey) {
    let html = `
        <div class="service-detail-hero" style="background-image: url('${service.image}');">
            <div class="service-detail-hero-overlay"></div>
            <div class="service-detail-hero-content">
                <h1 class="service-detail-title">${service.title}</h1>
                <p class="service-detail-subtitle">${service.subtitle}</p>
            </div>
        </div>

        <div class="service-detail-body">
            <div class="service-detail-intro service-detail-item">
                <p>${service.intro}</p>
            </div>

            <div class="service-detail-capabilities">
                <h2 class="service-detail-section-title service-detail-item">Our Capabilities</h2>
                <div class="capabilities-grid">
    `;

    // Add capabilities
    service.capabilities.forEach(function(cap) {
        html += `
            <div class="capability-card service-detail-item">
                <div class="capability-icon">${getCapabilityIcon(cap.icon)}</div>
                <h3>${cap.title}</h3>
                <p>${cap.description}</p>
            </div>
        `;
    });

    html += `
                </div>
            </div>
    `;

    // Add additional services or benefits list if available
    if (service.additionalServices) {
        html += `
            <div class="service-detail-additional service-detail-item">
                <h2 class="service-detail-section-title">Additional Services</h2>
                <ul class="additional-list">
                    ${service.additionalServices.map(s => `<li>${s}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    if (service.software) {
        html += `
            <div class="service-detail-software service-detail-item">
                <h2 class="service-detail-section-title">Software & Tools</h2>
                <ul class="software-list">
                    ${service.software.map(s => `<li>${s}</li>`).join('')}
                </ul>
                ${service.approach ? `<p class="approach-text">${service.approach}</p>` : ''}
            </div>
        `;
    }

    if (service.benefits) {
        html += `
            <div class="service-detail-benefits service-detail-item">
                <h2 class="service-detail-section-title">Key Benefits</h2>
                <ul class="benefits-list">
                    ${service.benefits.map(b => `<li>${b}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    html += `
            <div class="service-detail-cta service-detail-item">
                <p>Ready to discuss your project?</p>
                <a href="#contact" class="cta-button" onclick="closeServiceDetail()">Get In Touch</a>
            </div>
        </div>
    `;

    return html;
}

// Get SVG icon for capability
function getCapabilityIcon(iconType) {
    const icons = {
        hvac: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>',
        power: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M16.01 7L16 3h-2v4h-4V3H8v4h-.01C7 6.99 6 7.99 6 8.99v5.49L9.5 18v3h5v-3l3.5-3.51v-5.5c0-1-1-2-1.99-1.99z"/></svg>',
        lighting: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 0 1 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/></svg>',
        plumbing: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>',
        industrial: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/></svg>',
        hygienic: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM3 21.5h8v-2H3v2zm0-4h8v-2H3v2z"/></svg>',
        fire: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/></svg>',
        energy: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z"/></svg>',
        coordination: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>',
        prefab: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/></svg>',
        schedule: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/></svg>',
        documentation: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>',
        walkthrough: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 10.9c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1c.61 0 1.1-.49 1.1-1.1s-.49-1.1-1.1-1.1zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.19 12.19L6 18l3.81-8.19L18 6l-3.81 8.19z"/></svg>',
        sharing: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>',
        planning: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>'
    };
    return icons[iconType] || icons.hvac;
}
