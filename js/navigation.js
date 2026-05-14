/* ============================================
   JM2 ENGINEERING - NAVIGATION
   Mobile menu and scroll effects
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initActiveNavHighlight();
    initSmoothScroll();
});

// Mobile hamburger menu
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const navOverlay = document.querySelector('.nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (!menuToggle || !mobileNav) return;

    function openMenu() {
        menuToggle.classList.add('active');
        mobileNav.classList.add('active');
        if (navOverlay) navOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        menuToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        if (navOverlay) navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Toggle menu on button click
    menuToggle.addEventListener('click', function() {
        if (mobileNav.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close menu on overlay click
    if (navOverlay) {
        navOverlay.addEventListener('click', closeMenu);
    }

    // Close menu on link click
    mobileLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            closeMenu();
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            closeMenu();
        }
    });

    // Close menu on resize if screen becomes large
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992 && mobileNav.classList.contains('active')) {
            closeMenu();
        }
    });
}

// Highlight active nav item based on scroll position
function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navButtons = document.querySelectorAll('.nav-button, .mobile-nav-link');

    if (!sections.length || !navButtons.length) return;

    function updateActiveNav() {
        const scrollPosition = window.scrollY + 150;

        sections.forEach(function(section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navButtons.forEach(function(btn) {
                    btn.classList.remove('active');
                    const href = btn.getAttribute('href') || btn.dataset.section;
                    if (href === '#' + sectionId) {
                        btn.classList.add('active');
                    }
                });
            }
        });
    }

    // Initial check
    updateActiveNav();

    // Update on scroll (throttled)
    let scrollTimer;
    window.addEventListener('scroll', function() {
        if (scrollTimer) return;
        scrollTimer = setTimeout(function() {
            scrollTimer = null;
            updateActiveNav();
        }, 100);
    });
}

// Smooth scroll with header offset
function initSmoothScroll() {
    const header = document.querySelector('.header');

    // Nav buttons smooth scroll
    document.querySelectorAll('.nav-button[data-section], .mobile-nav-link[href^="#"]').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.dataset.section || this.getAttribute('href');
            const target = document.querySelector(targetId);

            if (target) {
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Logo click - scroll to top
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Footer links smooth scroll
    document.querySelectorAll('.footer-links a[href^="#"]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Hide header on scroll down, show on scroll up (optional enhancement)
function initHeaderHideOnScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const currentScrollY = window.scrollY;

                if (currentScrollY > lastScrollY && currentScrollY > 200) {
                    // Scrolling down
                    header.style.transform = 'translateY(-100%)';
                } else {
                    // Scrolling up
                    header.style.transform = 'translateY(0)';
                }

                lastScrollY = currentScrollY;
                ticking = false;
            });

            ticking = true;
        }
    });
}
