/**
 * MOVEO Landing Page - Animations & Interactions
 * Archivo que maneja todas las animaciones y efectos visuales de la página
 */

document.addEventListener('DOMContentLoaded', function() {

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elementos que se animarán al hacer scroll
    const animatedElements = document.querySelectorAll(`
        .intro-moveo-content,
        .service-card,
        .zigzag-item,
        .impact__card,
        .testimonial-card,
        .faq__item
    `);

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // =============================================================================
    // NAVBAR SCROLL EFFECTS
    // =============================================================================
    
    const navbar = document.getElementById('top-navbar');
    let lastScrollY = window.scrollY;
    
    function handleNavbarScroll() {
        const currentScrollY = window.scrollY;
        
        // Agregar clase 'scrolled' cuando se hace scroll
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Auto-hide navbar en scroll hacia abajo (opcional)
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', throttle(handleNavbarScroll, 16));

    // =============================================================================
    // MOBILE MENU HAMBURGER
    // =============================================================================
    
    const hamburger = document.querySelector('.navbar__hamburger');
    const navLinksContainer = document.querySelector('.navbar__navlinks');
    
    if (hamburger && navLinksContainer) {
        hamburger.addEventListener('click', function() {
            navLinksContainer.classList.toggle('mobile-open');
            this.classList.toggle('active');
        });
        
        // Cerrar menú al hacer click en un link
        const mobileLinks = navLinksContainer.querySelectorAll('.navbar__link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('mobile-open');
                hamburger.classList.remove('active');
            });
        });
        
        // Cerrar menú al hacer click fuera
        document.addEventListener('click', function(e) {
            if (!navbar.contains(e.target)) {
                navLinksContainer.classList.remove('mobile-open');
                hamburger.classList.remove('active');
            }
        });
    }

    // =============================================================================
    // SMOOTH SCROLLING FOR NAVIGATION LINKS
    // =============================================================================
    
    const navLinks = document.querySelectorAll('.navbar__link, .footer__links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Compensar altura del navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // =============================================================================
    // PARALLAX EFFECTS
    // =============================================================================
    
    const heroImg = document.querySelector('.hero__img');
    
    function handleParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (heroImg) {
            heroImg.style.transform = `translate3d(0, ${rate}px, 0)`;
        }
    }

    window.addEventListener('scroll', throttle(handleParallax, 16));

    // =============================================================================
    // COUNTER ANIMATION FOR IMPACT SECTION
    // =============================================================================
    
    const impactNumbers = document.querySelectorAll('.impact__number');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;
        
        impactNumbers.forEach(number => {
            const target = parseInt(number.textContent.replace(/[^\d]/g, ''));
            const increment = target / 60; // Animación de 1 segundo a 60fps
            let current = 0;
            const prefix = number.textContent.match(/^[^\d]*/)[0];
            const suffix = number.textContent.match(/[^\d]*$/)[0];
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                number.textContent = prefix + Math.floor(current) + suffix;
            }, 16);
        });
        
        countersAnimated = true;
    }

    // Observer para los contadores
    const impactSection = document.querySelector('.impact');
    if (impactSection) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                }
            });
        }, { threshold: 0.5 });

        counterObserver.observe(impactSection);
    }

    // =============================================================================
    // HOVER EFFECTS FOR CARDS
    // =============================================================================
    
    const cards = document.querySelectorAll(`
        .service-card,
        .impact__card,
        .testimonial-card
    `);

    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // =============================================================================
    // LOADING ANIMATIONS
    // =============================================================================
    
    // Animación inicial para el hero
    const heroContent = document.querySelector('.hero__content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }

    // =============================================================================
    // BUTTON RIPPLE EFFECT
    // =============================================================================
    
    const buttons = document.querySelectorAll(`
        .btn,
        .hero__cta,
        .service-card__btn,
        .testimonial-card__btn,
        .faq__tab
    `);

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // =============================================================================
    // TESTIMONIALS CAROUSEL AUTO-SCROLL
    // =============================================================================
    
    const testimonialsGrid = document.querySelector('.testimonials__grid');
    let isScrolling = false;

    if (testimonialsGrid) {
        // Auto-scroll horizontal suave para testimonios en móvil
        function autoScrollTestimonials() {
            if (window.innerWidth <= 768 && !isScrolling) {
                const scrollWidth = testimonialsGrid.scrollWidth;
                const clientWidth = testimonialsGrid.clientWidth;
                const currentScroll = testimonialsGrid.scrollLeft;
                
                if (currentScroll >= scrollWidth - clientWidth) {
                    testimonialsGrid.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    testimonialsGrid.scrollBy({ left: 320, behavior: 'smooth' });
                }
            }
        }

        // Auto-scroll cada 5 segundos en móvil
        if (window.innerWidth <= 768) {
            setInterval(autoScrollTestimonials, 5000);
        }

        // Pausar auto-scroll cuando el usuario interactúa
        testimonialsGrid.addEventListener('touchstart', () => {
            isScrolling = true;
            setTimeout(() => { isScrolling = false; }, 10000);
        });
    }

    // =============================================================================
    // UTILITY FUNCTIONS
    // =============================================================================
    
    // Función throttle para optimizar performance
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // =============================================================================
    // CSS ANIMATIONS KEYFRAMES INJECTION
    // =============================================================================
    
    // Inyectar keyframes para animaciones adicionales
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .slide-in-left {
            animation: slideInLeft 0.6s ease-out;
        }
        
        .slide-in-right {
            animation: slideInRight 0.6s ease-out;
        }
        
        .hero__content {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s ease-out;
        }
    `;
    document.head.appendChild(style);

    // =============================================================================
    // PERFORMANCE OPTIMIZATIONS
    // =============================================================================
    
    // Lazy loading para imágenes
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        if (img.dataset.src) {
            imageObserver.observe(img);
        }
    });

    // =============================================================================
    // CONSOLE LOG PARA DEBUGGING
    // =============================================================================
    
    console.log('🚗 MOVEO Animations loaded successfully!');
    console.log('✨ All interactive elements are ready');
});