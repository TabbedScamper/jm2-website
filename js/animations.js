/* ============================================
   JM2 ENGINEERING - ANIMATIONS
   GSAP + ScrollTrigger setup
   ============================================ */

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize all animations when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initHeaderAnimation();
    initHeroAnimations();
    initServiceAnimations();
    initProjectAnimations();
    initTeamAnimations();
    initContactAnimations();
    initParallaxEffects();
    initTextReveals();
});

// Header shrink on scroll
function initHeaderAnimation() {
    const header = document.querySelector('.header');
    if (!header) return;

    ScrollTrigger.create({
        trigger: 'body',
        start: 'top top',
        end: '+=100',
        onUpdate: function(self) {
            if (self.progress > 0.5) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });
}

// Hero section animations
function initHeroAnimations() {
    const heroLogo = document.querySelector('.hero-logo');
    const heroTagline = document.querySelector('.hero-tagline');
    const heroDescription = document.querySelector('.hero-description');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    // Initial reveal timeline
    const heroTimeline = gsap.timeline({ delay: 0.5 });

    if (heroLogo) {
        heroTimeline.to(heroLogo, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: 'power3.out'
        });
    }

    if (heroTagline) {
        heroTimeline.to(heroTagline, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out'
        }, '-=1');
    }

    if (heroDescription) {
        heroTimeline.to(heroDescription, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out'
        }, '-=1');
    }

    if (scrollIndicator) {
        heroTimeline.to(scrollIndicator, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out'
        }, '-=0.2');
    }

    // Dramatic scroll animation for hero logo - scales out/in on scroll
    if (heroLogo) {
        gsap.fromTo(heroLogo,
            {
                y: 0,
                opacity: 1,
                scale: 1
            },
            {
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: '50% top',
                    scrub: 0.3
                },
                y: -100,
                opacity: 0,
                scale: 0.3,
                ease: 'none'
            }
        );
    }

    // Animate tagline out on scroll too
    if (heroTagline) {
        gsap.fromTo(heroTagline,
            {
                y: 0,
                opacity: 1,
                scale: 1
            },
            {
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: '40% top',
                    scrub: 0.3
                },
                y: -50,
                opacity: 0,
                scale: 0.8,
                ease: 'none'
            }
        );
    }

    // Animate description out on scroll too
    if (heroDescription) {
        gsap.fromTo(heroDescription,
            {
                y: 0,
                opacity: 1,
                scale: 1
            },
            {
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: '40% top',
                    scrub: 0.3
                },
                y: -50,
                opacity: 0,
                scale: 0.8,
                ease: 'none'
            }
        );
    }
}

// Service panel animations
function initServiceAnimations() {
    const servicePanels = document.querySelectorAll('.service-panel');

    servicePanels.forEach(function(panel, index) {
        const skew = panel.querySelector('.service-skew');
        const bg = panel.querySelector('.service-panel-bg');
        const isLeft = panel.classList.contains('left');

        // Panel slide in animation with skew
        if (skew) {
            // Set initial state - panels start off-screen
            // Left panels have blue on left, so slide from left (-200)
            // Right panels have blue on right, so slide from right (+200)
            gsap.set(skew, {
                opacity: 0,
                x: isLeft ? -200 : 200
            });

            gsap.to(skew, {
                scrollTrigger: {
                    trigger: panel,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                opacity: 1,
                x: 0,
                duration: 1,
                ease: 'power3.out',
                delay: index * 0.15
            });
        }

        // Background reveal
        if (bg) {
            gsap.to(bg, {
                scrollTrigger: {
                    trigger: panel,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                opacity: 1,
                scale: 1,
                duration: 1.2,
                ease: 'power2.out'
            });
        }
    });
}

// Project card stagger animations
function initProjectAnimations() {
    const projectCards = document.querySelectorAll('.project-card');
    if (!projectCards.length) return;

    gsap.to(projectCards, {
        scrollTrigger: {
            trigger: '.projects-grid',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: {
            each: 0.1,
            from: 'start'
        },
        ease: 'power3.out'
    });
}

// Team carousel animations
function initTeamAnimations() {
    const teamCarousel = document.querySelector('.team-carousel');
    const aboutHeader = document.querySelector('.about-header');
    const aboutIntro = document.querySelector('.about-intro');

    if (aboutHeader) {
        gsap.from(aboutHeader, {
            scrollTrigger: {
                trigger: '.about',
                start: 'top 70%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: 'power3.out'
        });
    }

    if (aboutIntro) {
        gsap.from(aboutIntro, {
            scrollTrigger: {
                trigger: '.about',
                start: 'top 60%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            delay: 0.2,
            ease: 'power3.out'
        });
    }

    // Animate the whole carousel container, not individual members
    // Custom carousel controls member positioning, so we just fade in the container
    if (teamCarousel) {
        gsap.to(teamCarousel, {
            scrollTrigger: {
                trigger: '.team-carousel',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out'
        });
    }
}

// Contact section animations
function initContactAnimations() {
    const contactInfo = document.querySelector('.contact-info');
    const contactForm = document.querySelector('.contact-form-wrapper');
    const contactHeader = document.querySelector('.contact-header');

    if (contactHeader) {
        gsap.from(contactHeader, {
            scrollTrigger: {
                trigger: '.contact',
                start: 'top 70%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: 'power3.out'
        });
    }

    if (contactInfo) {
        gsap.to(contactInfo, {
            scrollTrigger: {
                trigger: '.contact-grid',
                start: 'top 70%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
    }

    if (contactForm) {
        gsap.to(contactForm, {
            scrollTrigger: {
                trigger: '.contact-grid',
                start: 'top 70%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            x: 0,
            duration: 0.8,
            delay: 0.2,
            ease: 'power3.out'
        });
    }
}

// Parallax background effects
function initParallaxEffects() {
    // Service panel backgrounds
    const serviceBgs = document.querySelectorAll('.service-panel-bg');

    serviceBgs.forEach(function(bg) {
        gsap.to(bg, {
            scrollTrigger: {
                trigger: bg.closest('.service-panel'),
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            },
            y: -50,
            ease: 'none'
        });
    });

    // Hero gradient animation
    const heroGradient = document.querySelector('.hero-gradient');
    if (heroGradient) {
        gsap.to(heroGradient, {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            },
            scale: 1.2,
            opacity: 0.3
        });
    }
}

// Text reveal animations (word by word / letter by letter)
function initTextReveals() {
    const revealTexts = document.querySelectorAll('.text-reveal');

    revealTexts.forEach(function(text) {
        gsap.to(text.querySelector('.text-reveal-inner'), {
            scrollTrigger: {
                trigger: text,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
    });

    // Staggered word animations
    const staggerTexts = document.querySelectorAll('.stagger-words');

    staggerTexts.forEach(function(element) {
        // Split text into words
        const text = element.textContent;
        const words = text.split(' ');
        element.innerHTML = '';

        words.forEach(function(word, index) {
            const span = document.createElement('span');
            span.classList.add('word');
            span.textContent = word + (index < words.length - 1 ? '\u00A0' : '');
            element.appendChild(span);
        });

        const wordSpans = element.querySelectorAll('.word');

        gsap.from(wordSpans, {
            scrollTrigger: {
                trigger: element,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 20,
            duration: 0.5,
            stagger: 0.05,
            ease: 'power3.out'
        });
    });
}

// Refresh ScrollTrigger on window resize
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        ScrollTrigger.refresh();
    }, 250);
});

// Refresh on load (for images)
window.addEventListener('load', function() {
    ScrollTrigger.refresh();
});
