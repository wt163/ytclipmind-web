// YT ClipMind Website JavaScript
// Implements carousel functionality and interactive features

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeCarouselImages();
    // Initialize all carousels
    initializeCarousels();
    
    // Initialize footer interactions
    initializeFooterInteractions();
    
    // Initialize install button
    initializeInstallButton();

    initializePricingTabs();
    initializeFaqAccordion();
});

const PRO_PRICING = {
    monthly: {
        amount: '$6.99/Month',
        billing: 'Billed monthly'
    },
    quarterly: {
        amount: '$18.85/Quarter',
        billing: '$6.28/month (10% OFF)'
    },
    semiannual: {
        amount: '$35.65/6 Months',
        billing: '$5.94/month (15% OFF)'
    },
    annual: {
        amount: '$67.00/Year',
        billing: '$5.58/month (20% OFF)'
    },
    lifetime: {
        amount: '$99',
        billing: 'Pay once, Pro forever'
    }
};

function initializePricingTabs() {
    const options = document.querySelectorAll('.billing-option');
    const amountEl = document.getElementById('pricingAmount');
    const billingEl = document.getElementById('pricingBilling');

    if (!options.length || !amountEl || !billingEl) return;

    options.forEach(option => {
        option.addEventListener('click', () => {
            const plan = option.getAttribute('data-plan');
            const pricing = PRO_PRICING[plan];
            if (!pricing) return;

            options.forEach(btn => {
                const isActive = btn === option;
                btn.classList.toggle('is-active', isActive);
                btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });

            amountEl.textContent = pricing.amount;
            billingEl.textContent = pricing.billing;
        });
    });
}

function initializeFaqAccordion() {
    const questions = document.querySelectorAll('.faq-question');

    questions.forEach(question => {
        question.addEventListener('click', () => {
            const expanded = question.getAttribute('aria-expanded') === 'true';
            const answer = question.nextElementSibling;

            question.setAttribute('aria-expanded', expanded ? 'false' : 'true');
            if (answer && answer.classList.contains('faq-answer')) {
                answer.hidden = expanded;
            }
        });
    });
}

/**
 * Lazy-load carousel screenshots (WebP first, PNG fallback).
 * Only the first Free slide is eager; others load when needed or when idle.
 */
function initializeCarouselImages() {
    const carousels = document.querySelectorAll('[data-carousel]');

    carousels.forEach(carousel => {
        const screenshots = carousel.querySelectorAll('.screenshot');
        const isPro = carousel.getAttribute('data-carousel') === 'pro';

        screenshots.forEach((img, index) => {
            if (img.dataset.loaded === 'true' || img.getAttribute('src')) {
                img.dataset.loaded = 'true';
                return;
            }

            // Free carousel: load first slide immediately (also preloaded in HTML head)
            if (!isPro && index === 0) {
                loadCarouselScreenshot(img);
                return;
            }

            if (isPro && index === 0) {
                return;
            }
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                entry.target.querySelectorAll('.screenshot[data-lazy-src]').forEach(img => {
                    loadCarouselScreenshot(img);
                });

                observer.unobserve(entry.target);
            });
        }, { rootMargin: '200px 0px' });

        observer.observe(carousel);
    });

    scheduleCarouselPrefetch();
}

function loadCarouselScreenshot(img) {
    if (!img || img.dataset.loaded === 'true') {
        return Promise.resolve();
    }

    const png = img.dataset.lazySrc;
    const webp = img.dataset.lazyWebp;
    const eagerSrc = img.getAttribute('src');

    if (eagerSrc) {
        img.dataset.loaded = 'true';
        return Promise.resolve();
    }

    if (!png && !webp) {
        return Promise.resolve();
    }

    return new Promise((resolve) => {
        const finish = () => {
            img.dataset.loaded = 'true';
            resolve();
        };

        const tryPng = () => {
            if (!png) {
                finish();
                return;
            }
            img.onerror = () => finish();
            img.onload = finish;
            img.src = png;
        };

        img.onerror = tryPng;
        img.onload = finish;
        img.src = webp || png;
    });
}

function scheduleCarouselPrefetch() {
    const run = () => {
        const freeCarousel = document.querySelector('[data-carousel="free"]');
        if (freeCarousel) {
            freeCarousel.querySelectorAll('.screenshot[data-lazy-src]').forEach(img => {
                loadCarouselScreenshot(img);
            });
        }
    };

    if ('requestIdleCallback' in window) {
        requestIdleCallback(run, { timeout: 2500 });
    } else {
        setTimeout(run, 1500);
    }
}

/**
 * Initialize all carousel functionality
 * Supports both Free (3 images) and Pro (4 images) carousels
 */
function initializeCarousels() {
    const carousels = document.querySelectorAll('[data-carousel]');
    
    carousels.forEach(carousel => {
        const carouselType = carousel.getAttribute('data-carousel');
        const screenshots = carousel.querySelectorAll('.screenshot');
        const dots = carousel.querySelectorAll('.dot');
        
        if (screenshots.length === 0) return;
        
        // Create carousel controller
        const controller = new CarouselController(screenshots, dots, carouselType);
        controller.start();
    });
}

/**
 * Reusable Carousel Controller Class
 * Handles auto-play, dot navigation, and image transitions
 */
class CarouselController {
    constructor(screenshots, dots, type) {
        this.screenshots = screenshots;
        this.dots = dots;
        this.type = type; // 'free' or 'pro'
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 4000; // 4 seconds
        
        this.init();
    }
    
    init() {
        // Set initial state
        this.showSlide(0);
        
        // Add dot click listeners
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });
    }
    
    start() {
        this.startAutoPlay();
    }
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    restartAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
    
    showSlide(index) {
        // Hide all screenshots
        this.screenshots.forEach((screenshot, i) => {
            const isActive = i === index;
            screenshot.classList.toggle('active', isActive);
            screenshot.style.opacity = '';
            screenshot.style.visibility = '';
        });
        
        // Update dots
        this.dots.forEach((dot, i) => {
            const isActive = i === index;
            dot.classList.toggle('active', isActive);
            if (dot.hasAttribute('role') && dot.getAttribute('role') === 'tab') {
                dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
            }
        });
        
        this.currentIndex = index;
    }
    
    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.screenshots.length;
        const target = this.screenshots[nextIndex];
        if (target) {
            loadCarouselScreenshot(target);
        }
        this.showSlide(nextIndex);
    }
    
    goToSlide(index) {
        const target = this.screenshots[index];
        if (target) {
            loadCarouselScreenshot(target);
        }
        this.showSlide(index);
        this.restartAutoPlay(); // Reset timer when user interacts
    }
}

/**
 * Initialize footer link interactions
 * Handles hover effects and link behavior
 */
function initializeFooterInteractions() {
    const footerLinks = document.querySelectorAll('.footer-link');
    
    footerLinks.forEach(link => {
        // Add hover effects (handled by CSS transitions)
        
        // Handle link targets
        const href = link.getAttribute('href');
        
        if (href && (href.startsWith('https://ytclipmind.com/') || href.endsWith('.html') || href.includes('-policy') || href.includes('-service'))) {
            // Legal page links - open in new tab
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        } else if (href && href.startsWith('mailto:')) {
            // Email links - open in same window (default mailto behavior)
            link.setAttribute('target', '_self');
        }
    });
}

/**
 * Initialize install button functionality
 */
function initializeInstallButton() {
    const installButton = document.getElementById('installButton');
    
    if (installButton) {
        installButton.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'translateY(-2px) scale(0.98)';
            
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Here you would typically redirect to Chrome Web Store
            // For now, we'll just log the action
            console.log('Install button clicked - would redirect to Chrome Web Store');
        });
    }
}

/**
 * Utility Functions
 */

// Smooth scroll to element (if needed for navigation)
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/**
 * Mobile touch support for carousels
 */
function addTouchSupport() {
    const carousels = document.querySelectorAll('.carousel-container');
    
    carousels.forEach(carousel => {
        let startX = 0;
        let endX = 0;
        
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            handleSwipe(carousel);
        }, { passive: true });
        
        function handleSwipe(carouselElement) {
            const threshold = 50; // Minimum swipe distance
            const diff = startX - endX;
            
            if (Math.abs(diff) > threshold) {
                const carouselType = carouselElement.getAttribute('data-carousel');
                const screenshots = carouselElement.querySelectorAll('.screenshot');
                
                if (diff > 0) {
                    // Swipe left - next slide
                    // Find current active slide and go to next
                    const currentActive = carouselElement.querySelector('.screenshot.active');
                    const currentIndex = Array.from(screenshots).indexOf(currentActive);
                    const nextIndex = (currentIndex + 1) % screenshots.length;
                    
                    // Simulate dot click to trigger existing logic
                    const dots = carouselElement.querySelectorAll('.dot');
                    if (dots[nextIndex]) {
                        dots[nextIndex].click();
                    }
                } else {
                    // Swipe right - previous slide
                    const currentActive = carouselElement.querySelector('.screenshot.active');
                    const currentIndex = Array.from(screenshots).indexOf(currentActive);
                    const prevIndex = currentIndex === 0 ? screenshots.length - 1 : currentIndex - 1;
                    
                    const dots = carouselElement.querySelectorAll('.dot');
                    if (dots[prevIndex]) {
                        dots[prevIndex].click();
                    }
                }
            }
        }
    });
}

// Initialize touch support
document.addEventListener('DOMContentLoaded', addTouchSupport);

/**
 * Keyboard navigation support
 */
function addKeyboardSupport() {
    document.addEventListener('keydown', (e) => {
        // Only handle arrow keys when focus is on carousel area
        const focusedElement = document.activeElement;
        const carousel = focusedElement.closest('.carousel-container');
        
        if (!carousel) return;
        
        const screenshots = carousel.querySelectorAll('.screenshot');
        const dots = carousel.querySelectorAll('.dot');
        const currentActive = carousel.querySelector('.screenshot.active');
        const currentIndex = Array.from(screenshots).indexOf(currentActive);
        
        let targetIndex = currentIndex;
        
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                targetIndex = currentIndex === 0 ? screenshots.length - 1 : currentIndex - 1;
                break;
            case 'ArrowRight':
                e.preventDefault();
                targetIndex = (currentIndex + 1) % screenshots.length;
                break;
            default:
                return;
        }
        
        if (dots[targetIndex]) {
            dots[targetIndex].click();
            dots[targetIndex].focus();
        }
    });
}

// Initialize keyboard support
document.addEventListener('DOMContentLoaded', addKeyboardSupport);

// Make carousels focusable for keyboard navigation
document.addEventListener('DOMContentLoaded', function() {
    const carouselDots = document.querySelectorAll('.dot');
    carouselDots.forEach(dot => {
        dot.setAttribute('tabindex', '0');
        dot.setAttribute('role', 'button');
        dot.setAttribute('aria-label', `Go to slide ${parseInt(dot.getAttribute('data-index'), 10) + 1}`);
    });
});

/**
 * Performance optimization: Pause carousels when not visible
 */
function setupVisibilityOptimization() {
    if ('IntersectionObserver' in window) {
        const carousels = document.querySelectorAll('.carousel-container');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const carousel = entry.target;
                const carouselType = carousel.getAttribute('data-carousel');
                
                // This is a simple approach - in a more complex app you'd store controller references
                if (entry.isIntersecting) {
                    // Carousel is visible - make sure auto-play is running
                    // The controllers are already managing this
                } else {
                    // Carousel is not visible - could pause auto-play to save resources
                    // For simplicity, we'll let them continue running
                }
            });
        });
        
        carousels.forEach(carousel => {
            observer.observe(carousel);
        });
    }
}

// Initialize visibility optimization
document.addEventListener('DOMContentLoaded', setupVisibilityOptimization);

/**
 * Analytics tracking (placeholder)
 */
function trackCarouselInteraction(carouselType, slideIndex, interactionType) {
    // Placeholder for analytics tracking
    console.log(`Carousel interaction: ${carouselType}, slide: ${slideIndex}, type: ${interactionType}`);
    
    // Example of what you might implement:
    // gtag('event', 'carousel_interaction', {
    //     carousel_type: carouselType,
    //     slide_index: slideIndex,
    //     interaction_type: interactionType
    // });
}

// Add analytics to dot clicks
document.addEventListener('DOMContentLoaded', function() {
    const dots = document.querySelectorAll('.dot');
    
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const carousel = this.closest('.carousel-container');
            const carouselType = carousel.getAttribute('data-carousel');
            const slideIndex = parseInt(this.getAttribute('data-index'));
            
            trackCarouselInteraction(carouselType, slideIndex, 'dot_click');
        });
    });
});