// YT ClipMind Website JavaScript
// Implements carousel functionality and interactive features

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all carousels
    initializeCarousels();
    
    // Initialize footer interactions
    initializeFooterInteractions();
    
    // Initialize install button
    initializeInstallButton();
});

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
            dot.classList.toggle('active', i === index);
        });
        
        this.currentIndex = index;
    }
    
    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.screenshots.length;
        this.showSlide(nextIndex);
    }
    
    goToSlide(index) {
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