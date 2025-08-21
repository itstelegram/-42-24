// Initialize Telegram WebApp
if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    
    // Expand to full height
    tg.expand();
    
    // Request fullscreen if available (Bot API 8.0+)
    if (tg.requestFullscreen) {
        tg.requestFullscreen();
    }
    
    // Set header color to match design
    if (tg.setHeaderColor) {
        tg.setHeaderColor('#5F8AE5');
    }
    
    // Listen for fullscreen events
    if (tg.onEvent) {
        tg.onEvent('fullscreenChanged', function() {
            console.log('Fullscreen state:', tg.isFullscreen);
        });
        
        tg.onEvent('fullscreenFailed', function() {
            console.log('Failed to enter fullscreen mode');
        });
    }
}

// Plan selection functionality
let selectedPlan = null;

const plans = {
    1: {
        name: 'Подписка на 1 месяц (пакет с клубом)',
        price: '3 490 ₽',
        originalPrice: '5 500 ₽',
        features: [
            'Сообщество Руслана Масгутова на 30 дней',
            'Клуб функциональных тренировок с Сергеем Пелко на 30 дней'
        ]
    },
    2: {
        name: 'Подписка на 1 месяц (базовый пакет)',
        price: '990 ₽',
        originalPrice: '1 500 ₽',
        features: [
            'Сообщество Руслана Масгутова на 30 дней'
        ]
    },
    3: {
        name: 'Подписка на 3 месяца',
        price: '2 970 ₽',
        originalPrice: '4 500 ₽',
        features: [
            'Сообщество Руслана Масгутова на 90 дней'
        ]
    }
};

// Modal functions
function openModal() {
    const overlay = document.getElementById('modalOverlay');
    const subscriptionModal = document.getElementById('subscriptionModal');
    const successModal = document.getElementById('successModal');
    
    overlay.classList.add('active');
    subscriptionModal.style.display = 'block';
    successModal.style.display = 'none';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset forms
    const checkboxes = document.querySelectorAll('#checkoutForm input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);
}

function showSuccessModal() {
    const subscriptionModal = document.getElementById('subscriptionModal');
    const successModal = document.getElementById('successModal');
    
    subscriptionModal.style.display = 'none';
    successModal.style.display = 'block';
}

// Select plan function
function selectPlan(planId) {
    selectedPlan = planId;
    const plan = plans[planId];
    
    // Update selected plan info
    const selectedPlanInfo = document.getElementById('selectedPlanInfo');
    const isMobile = window.innerWidth < 768;
    
    selectedPlanInfo.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; gap: 1rem;">
            <h4 style="margin: 0; color: var(--text-primary); font-size: ${isMobile ? '1rem' : '1.125rem'}; line-height: 1.3; flex: 1;">${plan.name}</h4>
            <div style="text-align: right; white-space: nowrap;">
                <span style="text-decoration: line-through; color: var(--text-muted); font-size: 0.75rem;">${plan.originalPrice}</span>
                <span style="display: block; font-size: ${isMobile ? '1.25rem' : '1.5rem'}; font-weight: 700; color: var(--primary-blue); margin-top: 2px;">${plan.price}</span>
            </div>
        </div>
        <ul style="list-style: none; padding: 0; margin: 0;">
            ${plan.features.map(feature => `
                <li style="display: flex; align-items: flex-start; gap: 0.5rem; margin-bottom: ${isMobile ? '0.5rem' : '0.625rem'}; color: var(--text-secondary); font-size: ${isMobile ? '0.8125rem' : '0.875rem'};">
                    <span style="color: var(--primary-blue); font-size: 1rem; flex-shrink: 0; margin-top: -2px;">✓</span>
                    <span style="line-height: 1.4;">${feature}</span>
                </li>
            `).join('')}
        </ul>
    `;
    
    // Open modal
    openModal();
}

// Form submission
document.addEventListener('DOMContentLoaded', function() {
    const checkoutForm = document.getElementById('checkoutForm');
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Check if all checkboxes are checked
            const checkboxes = checkoutForm.querySelectorAll('input[type="checkbox"]');
            const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
            
            if (!allChecked) {
                alert('Пожалуйста, примите все условия для продолжения');
                return;
            }
            
            if (!selectedPlan) {
                alert('Пожалуйста, выберите тариф');
                return;
            }
            
            // Simulate payment processing
            const plan = plans[selectedPlan];
            
            // Show loading state
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Обработка...</span>';
            submitBtn.disabled = true;
            
            // Simulate payment delay
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Show success modal
                showSuccessModal();
            }, 1500);
        });
    }
    
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all elements with fade-in class
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => {
        observer.observe(el);
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add parallax effect to hero section
    let ticking = false;
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');
        const heroHeight = hero ? hero.offsetHeight : 0;
        
        // Only apply parallax if we're still within hero section
        if (hero && heroContent && scrolled < heroHeight) {
            // Use transform3d for better performance
            const parallaxOffset = scrolled * 0.4;
            hero.style.transform = `translate3d(0, ${parallaxOffset}px, 0)`;
            
            // Fade out hero content on scroll
            const opacity = Math.max(0, 1 - scrolled / 500);
            heroContent.style.opacity = opacity;
            heroContent.style.transform = `translate3d(0, ${scrolled * 0.2}px, 0)`;
        } else if (hero && scrolled >= heroHeight) {
            // Reset transform when scrolled past hero
            hero.style.transform = 'none';
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
    
    // Add hover effect to price cards
    const priceCards = document.querySelectorAll('.price-card');
    priceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('popular')) {
                this.style.transform = 'translateY(0)';
            } else {
                this.style.transform = 'scale(1.05)';
            }
        });
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            // Add ripple styles if not already present
            if (!document.querySelector('style[data-ripple]')) {
                const style = document.createElement('style');
                style.setAttribute('data-ripple', 'true');
                style.textContent = `
                    .ripple {
                        position: absolute;
                        border-radius: 50%;
                        background: rgba(255, 255, 255, 0.6);
                        transform: scale(0);
                        animation: ripple-animation 0.6s ease-out;
                        pointer-events: none;
                    }
                    @keyframes ripple-animation {
                        to {
                            transform: scale(4);
                            opacity: 0;
                        }
                    }
                    .btn {
                        position: relative;
                        overflow: hidden;
                    }
                `;
                document.head.appendChild(style);
            }
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add loading animation when page loads
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
    
    // Close modal on overlay click
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    // Close modal on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});

// Add console easter egg
console.log('%c🚀 Добро пожаловать в закрытое сообщество Руслана Масгутова!', 
    'color: #4f46e5; font-size: 16px; font-weight: bold; padding: 10px;');
console.log('%c💡 Начните свою трансформацию уже сегодня', 
    'color: #10b981; font-size: 14px; padding: 5px;');