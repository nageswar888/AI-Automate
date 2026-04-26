/**
 * AIAutomate - Main JavaScript File
 * Professional SaaS Template Interactions
 * Version: 2.0.0
 */

(function() {
    'use strict';

    // ========================================
    // CONFIGURATION
    // ========================================
    const CONFIG = {
        animations: {
            duration: 800,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            once: true,
            offset: 100
        },
        scroll: {
            navbarOffset: 100,
            smoothScroll: true
        }
    };

    // ========================================
    // UTILITY FUNCTIONS
    // ========================================
    const Utils = {
        // Debounce function for performance
        debounce: (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // Throttle function for scroll events
        throttle: (func, limit) => {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        // Check if element is in viewport
        isInViewport: (element, offset = 0) => {
            const rect = element.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight - offset) &&
                rect.bottom >= offset
            );
        },

        // Add class with animation frame
        addClass: (element, className, delay = 0) => {
            setTimeout(() => {
                requestAnimationFrame(() => {
                    element.classList.add(className);
                });
            }, delay);
        }
    };

    // ========================================
    // NAVBAR MODULE
    // ========================================
    const Navbar = {
        init() {
            this.navbar = document.querySelector('.navbar');
            this.toggler = document.querySelector('.navbar-toggler');
            if (!this.navbar) return;

            this.bindEvents();
            this.handleScroll();
        },

        bindEvents() {
            // Handle navbar scroll effect
            window.addEventListener('scroll', Utils.throttle(() => {
                this.handleScroll();
            }, 100));

            // Handle toggler click for custom icon change
            if (this.toggler) {
                this.toggler.addEventListener('click', () => {
                    setTimeout(() => {
                        this.updateTogglerIcon();
                    }, 50);
                });
            }

            // Close navbar on link click (mobile)
            document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                        const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                        bsCollapse.hide();
                    }
                });
            });
        },

        handleScroll() {
            const scrolled = window.scrollY > CONFIG.scroll.navbarOffset;
            this.navbar.classList.toggle('navbar-scrolled', scrolled);
        },

        updateTogglerIcon() {
            // The CSS handles the icon change via aria-expanded attribute
            const isExpanded = this.toggler.getAttribute('aria-expanded') === 'true';
            this.toggler.setAttribute('aria-expanded', !isExpanded);
        }
    };

    // ========================================
    // SCROLL ANIMATIONS MODULE
    // ========================================
    const ScrollAnimations = {
        init() {
            this.elements = document.querySelectorAll('[data-animate]');
            if (!this.elements.length) return;

            this.observer = new IntersectionObserver(
                (entries) => this.handleIntersection(entries),
                {
                    root: null,
                    rootMargin: '0px 0px -50px 0px',
                    threshold: 0.1
                }
            );

            this.elements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = `opacity ${CONFIG.animations.duration}ms ${CONFIG.animations.easing}, transform ${CONFIG.animations.duration}ms ${CONFIG.animations.easing}`;
                this.observer.observe(el);
            });
        },

        handleIntersection(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    this.observer.unobserve(entry.target);
                }
            });
        }
    };

    // ========================================
    // COUNTER ANIMATION MODULE
    // ========================================
    const CounterAnimation = {
        init() {
            this.counters = document.querySelectorAll('[data-counter]');
            if (!this.counters.length) return;

            this.observer = new IntersectionObserver(
                (entries) => this.handleIntersection(entries),
                { threshold: 0.5 }
            );

            this.counters.forEach(counter => {
                this.observer.observe(counter);
            });
        },

        handleIntersection(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        },

        animateCounter(element) {
            const target = parseInt(element.getAttribute('data-counter'), 10);
            const suffix = element.getAttribute('data-suffix') || '';
            const prefix = element.getAttribute('data-prefix') || '';
            const duration = parseInt(element.getAttribute('data-duration'), 10) || 2000;

            let current = 0;
            const increment = target / (duration / 16);
            const step = () => {
                current += increment;
                if (current < target) {
                    element.textContent = prefix + Math.floor(current) + suffix;
                    requestAnimationFrame(step);
                } else {
                    element.textContent = prefix + target + suffix;
                }
            };
            step();
        }
    };

    // ========================================
    // SMOOTH SCROLL MODULE
    // ========================================
    const SmoothScroll = {
        init() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    const targetId = anchor.getAttribute('href');
                    if (targetId === '#') return;

                    const target = document.querySelector(targetId);
                    if (target) {
                        e.preventDefault();
                        this.scrollTo(target);
                    }
                });
            });
        },

        scrollTo(element, offset = 100) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    // ========================================
    // FORM VALIDATION MODULE
    // ========================================
    const FormValidation = {
        init() {
            document.querySelectorAll('form').forEach(form => {
                form.addEventListener('submit', (e) => this.handleSubmit(e, form));
            });
        },

        handleSubmit(e, form) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
                this.showValidationErrors(form);
            } else {
                // Form is valid - show success message
                const btn = form.querySelector('[type="submit"]');
                if (btn) {
                    const originalText = btn.textContent;
                    btn.textContent = 'Sending...';
                    btn.disabled = true;

                    // Simulate form submission
                    setTimeout(() => {
                        this.showSuccessMessage(form);
                        btn.textContent = originalText;
                        btn.disabled = false;
                    }, 1500);
                }
            }
            form.classList.add('was-validated');
        },

        showValidationErrors(form) {
            form.querySelectorAll(':invalid').forEach(field => {
                field.classList.add('is-invalid');
                field.addEventListener('input', () => {
                    field.classList.remove('is-invalid');
                }, { once: true });
            });
        },

        showSuccessMessage(form) {
            const successMsg = document.createElement('div');
            successMsg.className = 'alert alert-success mt-3';
            successMsg.textContent = 'Thank you! Your message has been sent successfully.';
            successMsg.style.cssText = `
                background: rgba(34, 197, 94, 0.1);
                border: 1px solid rgba(34, 197, 94, 0.3);
                color: #22c55e;
                padding: 1rem;
                border-radius: 0.5rem;
                animation: slideUp 0.3s ease;
            `;
            form.appendChild(successMsg);
            form.reset();

            setTimeout(() => {
                successMsg.remove();
            }, 5000);
        }
    };

    // ========================================
    // TYPING ANIMATION MODULE
    // ========================================
    const TypeAnimation = {
        init() {
            this.elements = document.querySelectorAll('[data-type]');
            this.elements.forEach(el => this.typeText(el));
        },

        typeText(element) {
            const text = element.getAttribute('data-type');
            const speed = parseInt(element.getAttribute('data-type-speed'), 10) || 100;
            let i = 0;

            element.textContent = '';
            const type = () => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                }
            };
            type();
        }
    };

    // ========================================
    // PARALLAX EFFECT MODULE
    // ========================================
    const ParallaxEffect = {
        init() {
            this.elements = document.querySelectorAll('[data-parallax]');
            if (!this.elements.length) return;

            window.addEventListener('scroll', Utils.throttle(() => {
                this.updateParallax();
            }, 16));
        },

        updateParallax() {
            const scrolled = window.pageYOffset;
            this.elements.forEach(el => {
                const speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;
                const yPos = -(scrolled * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
        }
    };

    // ========================================
    // PRICING TOGGLE MODULE
    // ========================================
    const PricingToggle = {
        init() {
            this.tabs = document.querySelectorAll('.pricing-tab');
            if (!this.tabs.length) return;

            this.tabs.forEach(tab => {
                tab.addEventListener('click', () => this.switchTab(tab));
            });
        },

        switchTab(activeTab) {
            this.tabs.forEach(tab => tab.classList.remove('active'));
            activeTab.classList.add('active');

            // Animate price change
            const isYearly = activeTab.textContent.toLowerCase().includes('year');
            document.querySelectorAll('[data-monthly]').forEach(price => {
                const monthly = price.getAttribute('data-monthly');
                const yearly = price.getAttribute('data-yearly');
                const newPrice = isYearly ? yearly : monthly;

                price.style.opacity = '0';
                setTimeout(() => {
                    price.textContent = newPrice;
                    price.style.opacity = '1';
                }, 200);
            });
        }
    };

    // ========================================
    // LAZY LOADING MODULE
    // ========================================
    const LazyLoader = {
        init() {
            const images = document.querySelectorAll('img[data-src]');
            if (!images.length) return;

            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.getAttribute('data-src');
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    };

    // ========================================
    // BACK TO TOP MODULE
    // ========================================
    const BackToTop = {
        init() {
            this.button = document.createElement('button');
            this.button.className = 'back-to-top';
            this.button.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 15l-6-6-6 6"/>
                </svg>
            `;
            this.button.setAttribute('aria-label', 'Back to top');
            document.body.appendChild(this.button);

            this.addStyles();
            this.bindEvents();
        },

        addStyles() {
            const styles = document.createElement('style');
            styles.textContent = `
                .back-to-top {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    width: 50px;
                    height: 50px;
                    background: var(--primary-gradient);
                    border: none;
                    border-radius: 50%;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(20px);
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
                    z-index: 999;
                }
                .back-to-top.visible {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                }
                .back-to-top:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.6);
                }
            `;
            document.head.appendChild(styles);
        },

        bindEvents() {
            window.addEventListener('scroll', Utils.throttle(() => {
                const scrolled = window.pageYOffset > 500;
                this.button.classList.toggle('visible', scrolled);
            }, 100));

            this.button.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    };

    // ========================================
    // CURSOR EFFECT MODULE (Desktop Only)
    // ========================================
    const CursorEffect = {
        init() {
            // Only on non-touch devices
            if (window.matchMedia('(pointer: coarse)').matches) return;

            this.cursor = document.createElement('div');
            this.cursor.className = 'custom-cursor';
            document.body.appendChild(this.cursor);

            this.addStyles();
            this.bindEvents();
        },

        addStyles() {
            const styles = document.createElement('style');
            styles.textContent = `
                .custom-cursor {
                    width: 20px;
                    height: 20px;
                    border: 2px solid var(--primary-color);
                    border-radius: 50%;
                    position: fixed;
                    pointer-events: none;
                    z-index: 9999;
                    transition: transform 0.1s ease, opacity 0.3s ease;
                    opacity: 0;
                }
                .custom-cursor.active {
                    opacity: 1;
                }
                .custom-cursor.hovering {
                    transform: scale(1.5);
                    background: rgba(99, 102, 241, 0.1);
                }
            `;
            document.head.appendChild(styles);
        },

        bindEvents() {
            document.addEventListener('mousemove', (e) => {
                requestAnimationFrame(() => {
                    this.cursor.style.left = e.clientX - 10 + 'px';
                    this.cursor.style.top = e.clientY - 10 + 'px';
                    this.cursor.classList.add('active');
                });
            });

            document.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('active');
            });

            // Add hover effect on interactive elements
            document.querySelectorAll('a, button, .card-hover').forEach(el => {
                el.addEventListener('mouseenter', () => {
                    this.cursor.classList.add('hovering');
                });
                el.addEventListener('mouseleave', () => {
                    this.cursor.classList.remove('hovering');
                });
            });
        }
    };

    // ========================================
    // NOTIFICATION SYSTEM
    // ========================================
    const Notifications = {
        show(message, type = 'info', duration = 3000) {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%) translateY(100px);
                background: var(--bg-card);
                color: var(--text-primary);
                padding: 1rem 1.5rem;
                border-radius: 0.75rem;
                border: 1px solid var(--border-color);
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                font-weight: 500;
                opacity: 0;
                transition: all 0.3s ease;
            `;

            // Type-specific styles
            if (type === 'success') {
                notification.style.borderColor = 'rgba(34, 197, 94, 0.3)';
                notification.style.background = 'rgba(34, 197, 94, 0.1)';
                notification.style.color = '#22c55e';
            } else if (type === 'error') {
                notification.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                notification.style.background = 'rgba(239, 68, 68, 0.1)';
                notification.style.color = '#ef4444';
            }

            document.body.appendChild(notification);

            // Animate in
            requestAnimationFrame(() => {
                notification.style.opacity = '1';
                notification.style.transform = 'translateX(-50%) translateY(0)';
            });

            // Remove after duration
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(-50%) translateY(100px)';
                setTimeout(() => notification.remove(), 300);
            }, duration);
        }
    };

    // ========================================
    // PERFORMANCE MONITORING
    // ========================================
    const PerformanceMonitor = {
        init() {
            // Report Web Vitals
            if ('web-vitals' in window) {
                // Already loaded via CDN
            }
        }
    };

    // ========================================
    // INITIALIZATION
    // ========================================
    function init() {
        // Initialize all modules
        Navbar.init();
        ScrollAnimations.init();
        CounterAnimation.init();
        SmoothScroll.init();
        FormValidation.init();
        TypeAnimation.init();
        ParallaxEffect.init();
        PricingToggle.init();
        LazyLoader.init();
        BackToTop.init();

        // Add loaded class to body
        document.body.classList.add('js-loaded');

        console.log('🚀 AIAutomate initialized successfully!');
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose API for external use
    window.AIAutomate = {
        utils: Utils,
        notifications: Notifications,
        scrollTo: SmoothScroll.scrollTo,
        version: '2.0.0'
    };

})();
