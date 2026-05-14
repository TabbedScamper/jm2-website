/* ============================================
   JM2 ENGINEERING - MAIN JS
   Initialization and utilities
   ============================================ */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', async function() {
    // Initialize basic modules first
    initParticles();
    initScrollIndicator();
    initContactForm();

    // Load dynamic content from JSON files
    await loadProjects();
    await loadTeamMembers();

    // Initialize features that depend on dynamic content
    initProjectFilters();
    initTeamCarousel();

    // Re-initialize GSAP animations for dynamically loaded content
    if (typeof initProjectAnimations === 'function') {
        initProjectAnimations();
    }

    // Remove loading screen after everything is ready
    setTimeout(function() {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 500);
});

/* ============================================
   DYNAMIC CONTENT LOADERS
   Load projects and team from JSON files
   ============================================ */

// Load and render projects from JSON
async function loadProjects() {
    const grid = document.querySelector('.projects-grid');
    if (!grid) return;

    try {
        const response = await fetch('data/projects.json');
        const data = await response.json();

        // Clear existing content
        grid.innerHTML = '';

        // Category labels for display
        const categoryLabels = {
            'engineering': 'Engineering',
            'bim': 'BIM',
            'scanning': '3D Scanning'
        };

        // Render each project
        data.projects.forEach(function(project) {
            const article = document.createElement('article');
            article.className = 'project-card';
            article.dataset.category = project.category;

            article.innerHTML = `
                <img src="${project.image}" alt="${project.title}" class="project-card-image">
                <div class="project-card-overlay">
                    <span class="project-card-tag">${categoryLabels[project.category] || project.category}</span>
                    <h3 class="project-card-title">${project.title}</h3>
                    <span class="project-card-date">${project.location}</span>
                </div>
            `;

            grid.appendChild(article);
        });

        // Re-trigger GSAP animations if available
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Load and render team members from JSON (skips if HTML already has members)
async function loadTeamMembers() {
    const carousel = document.querySelector('.team-carousel');
    if (!carousel) return;

    // Check if team members already exist in HTML (fallback for browsers that block fetch)
    const existingMembers = carousel.querySelectorAll('.team-member');
    if (existingMembers.length > 0) {
        // Team members already in HTML, just refresh ScrollTrigger
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
        return;
    }

    // Only fetch if no members exist in HTML
    try {
        const response = await fetch('data/team.json');
        const data = await response.json();

        // Render each team member
        data.members.forEach(function(member) {
            const div = document.createElement('div');
            div.className = 'team-member';

            div.innerHTML = `
                <img src="${member.image}" alt="${member.name}" class="team-member-image">
                <h3 class="team-member-name">${member.name}</h3>
                <p class="team-member-title">${member.title}</p>
                <p class="team-member-bio">${member.bio}</p>
            `;

            carousel.appendChild(div);
        });

        // Re-trigger GSAP animations if available
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    } catch (error) {
        console.error('Error loading team members:', error);
    }
}

// Initialize floating particles in hero
function initParticles() {
    const particleContainer = document.querySelector('.hero-particles');
    if (!particleContainer) return;

    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Random position
        particle.style.left = Math.random() * 100 + '%';

        // Random size (larger particles)
        const size = Math.random() * 10 + 5;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        // Random animation duration and delay
        particle.style.animationDuration = (Math.random() * 10 + 8) + 's';
        particle.style.animationDelay = (Math.random() * 10) + 's';

        // Random opacity
        particle.style.opacity = Math.random() * 0.5 + 0.2;

        particleContainer.appendChild(particle);
    }
}

// Scroll indicator click handler
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (!scrollIndicator) return;

    scrollIndicator.addEventListener('click', function() {
        const servicesSection = document.getElementById('services');
        if (servicesSection) {
            servicesSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Initialize custom fade carousel
function initTeamCarousel() {
    var carousel = document.querySelector('.team-carousel');
    if (!carousel) return;

    var members = carousel.querySelectorAll('.team-member');
    var totalMembers = members.length;
    var currentIndex = 0;
    var autoPlayInterval;
    var isHovered = false;

    // Create navigation buttons
    var prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-btn carousel-btn-prev';
    prevBtn.innerHTML = '<svg viewBox="0 0 100 100"><path d="M 10,50 L 60,100 L 70,90 L 30,50  L 70,10 L 60,0 Z" class="arrow"></path></svg>';
    prevBtn.setAttribute('aria-label', 'Previous');

    var nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-btn carousel-btn-next';
    nextBtn.innerHTML = '<svg viewBox="0 0 100 100"><path d="M 10,50 L 60,100 L 70,90 L 30,50  L 70,10 L 60,0 Z" class="arrow" transform="translate(100, 100) rotate(180)"></path></svg>';
    nextBtn.setAttribute('aria-label', 'Next');

    carousel.appendChild(prevBtn);
    carousel.appendChild(nextBtn);

    // Create dots
    var dotsContainer = document.createElement('div');
    dotsContainer.className = 'carousel-dots';
    for (var i = 0; i < totalMembers; i++) {
        var dot = document.createElement('button');
        dot.className = 'carousel-dot';
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        dot.dataset.index = i;
        dotsContainer.appendChild(dot);
    }
    carousel.appendChild(dotsContainer);

    // Position cards in a fixed 5-slot layout
    function getSlotPosition(distance, isLeft) {
        // 5 visible slots: -2, -1, 0, 1, 2
        var positions = {
            0: { x: 0, scale: 1.2, opacity: 1, zIndex: 5 },
            1: { x: isLeft ? -320 : 320, scale: 1, opacity: 0.8, zIndex: 4 },
            2: { x: isLeft ? -580 : 580, scale: 1, opacity: 0.5, zIndex: 3 },
            3: { x: 0, scale: 1, opacity: 0, zIndex: 1 }
        };
        return positions[Math.min(distance, 3)];
    }

    function updateCarousel() {
        members.forEach(function(member, i) {
            // Calculate distance with wrap
            var distance = Math.abs(i - currentIndex);
            var wrapDistance = totalMembers - distance;
            var actualDistance = Math.min(distance, wrapDistance);

            // Determine if card is to the left or right of center
            var diff = i - currentIndex;
            // Handle wrap around
            if (diff > totalMembers / 2) diff -= totalMembers;
            if (diff < -totalMembers / 2) diff += totalMembers;
            var isLeft = diff < 0;

            // Get position for this slot
            var pos = getSlotPosition(actualDistance, isLeft);

            // Apply styles
            member.style.transform = 'translateX(' + pos.x + 'px) scale(' + pos.scale + ')';
            member.style.opacity = pos.opacity;
            member.style.zIndex = pos.zIndex;

            // Update classes for styling
            member.classList.remove('distance-0', 'distance-1', 'distance-2', 'distance-3');
            member.classList.add('distance-' + Math.min(actualDistance, 3));
        });

        // Update dots
        var dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach(function(dot, i) {
            dot.classList.toggle('is-selected', i === currentIndex);
        });
    }

    function goTo(index) {
        currentIndex = ((index % totalMembers) + totalMembers) % totalMembers;
        updateCarousel();
    }

    function next() {
        goTo(currentIndex + 1);
    }

    function prev() {
        goTo(currentIndex - 1);
    }

    // Event listeners
    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    dotsContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('carousel-dot')) {
            goTo(parseInt(e.target.dataset.index));
        }
    });

    // Click on cards to bring them to center
    members.forEach(function(member, i) {
        member.style.cursor = 'pointer';
        member.addEventListener('click', function() {
            if (i !== currentIndex) {
                goTo(i);
            }
        });
    });

    // Auto play
    function startAutoPlay() {
        autoPlayInterval = setInterval(function() {
            if (!isHovered) next();
        }, 6000);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    carousel.addEventListener('mouseenter', function() {
        isHovered = true;
    });

    carousel.addEventListener('mouseleave', function() {
        isHovered = false;
    });

    // Initialize
    updateCarousel();
    startAutoPlay();
}

// Project filter functionality
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filterButtons.length || !projectCards.length) return;

    filterButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;

            // Update active button
            filterButtons.forEach(function(b) { b.classList.remove('active'); });
            this.classList.add('active');

            // Filter projects
            projectCards.forEach(function(card) {
                const category = card.dataset.category;

                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(function() {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(function() {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Contact form handling
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        const submitBtn = form.querySelector('.submit-btn');
        const feedback = form.querySelector('.form-feedback');

        // Add loading state
        if (submitBtn) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        }

        // Clear previous feedback
        if (feedback) {
            feedback.classList.remove('success', 'error');
            feedback.style.display = 'none';
        }

        // For Formspree, let the form submit naturally
        // But we'll handle the response with fetch for better UX

        // If using Formspree with AJAX:
        if (form.dataset.ajax === 'true') {
            e.preventDefault();

            const formData = new FormData(form);

            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(function(response) {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok');
            })
            .then(function() {
                // Success
                if (feedback) {
                    feedback.textContent = 'Thank you! Your message has been sent.';
                    feedback.classList.add('success');
                    feedback.style.display = 'block';
                }
                form.reset();
            })
            .catch(function() {
                // Error
                if (feedback) {
                    feedback.textContent = 'Oops! Something went wrong. Please try again.';
                    feedback.classList.add('error');
                    feedback.style.display = 'block';
                }
            })
            .finally(function() {
                if (submitBtn) {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                }
            });
        }
    });
}

// Ripple effect for buttons
document.addEventListener('click', function(e) {
    const button = e.target.closest('.nav-button, .submit-btn, .filter-btn');
    if (!button) return;

    const ripple = document.createElement('span');
    ripple.classList.add('ripple');

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

    button.appendChild(ripple);

    setTimeout(function() {
        ripple.remove();
    }, 600);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});
