// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger menu
    const bars = navToggle.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        if (navMenu.classList.contains('active')) {
            if (index === 0) bar.style.transform = 'rotate(45deg) translate(5px, 5px)';
            if (index === 1) bar.style.opacity = '0';
            if (index === 2) bar.style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            bar.style.transform = 'none';
            bar.style.opacity = '1';
        }
    });
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const bars = navToggle.querySelectorAll('.bar');
        bars.forEach(bar => {
            bar.style.transform = 'none';
            bar.style.opacity = '1';
        });
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar Background on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        navbar.style.borderBottom = '1px solid rgba(56, 189, 248, 0.3)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.85)';
        navbar.style.boxShadow = 'none';
        navbar.style.borderBottom = '1px solid rgba(56, 189, 248, 0.2)';
    }
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .feature-item, .stat-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Counter Animation for Stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (element.textContent.includes('%') ? '%' : element.textContent.includes('/') ? '/7' : '+');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (element.textContent.includes('%') ? '%' : element.textContent.includes('/') ? '/7' : '+');
        }
    }, 16);
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                if (text.includes('50')) {
                    stat.textContent = '0+';
                    animateCounter(stat, 50);
                } else if (text.includes('95')) {
                    stat.textContent = '0%';
                    animateCounter(stat, 95);
                } else if (text.includes('24')) {
                    stat.textContent = '0/7';
                    stat.textContent = '24/7';
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const aboutStats = document.querySelector('.about-stats');
    if (aboutStats) {
        statsObserver.observe(aboutStats);
    }
});

// Contact Form Handling
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const company = formData.get('company');
    const message = formData.get('message');
    
    // Simple validation
    if (!name || !email || !message) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Simulate form submission
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
        this.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
});

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    });
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.ai-animation');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add enhanced loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    // Create a loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.classList.add('loading-overlay');
    loadingOverlay.innerHTML = `
        <div class="loading-logo">
            <img src="assets/images/firstwave-logo.png" alt="FirstWave Solutions" class="pulse-logo">
            <div class="loading-progress"></div>
        </div>
    `;
    document.body.appendChild(loadingOverlay);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #0f172a;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .loading-logo {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
        }
        .pulse-logo {
            width: 100px;
            height: auto;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
            100% { transform: scale(1); opacity: 1; }
        }
        .loading-progress {
            width: 150px;
            height: 3px;
            background: rgba(56, 189, 248, 0.2);
            border-radius: 3px;
            overflow: hidden;
            position: relative;
        }
        .loading-progress::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 30%;
            background: linear-gradient(90deg, #38bdf8, #818cf8);
            animation: progress 1.5s ease-in-out infinite;
            border-radius: 3px;
        }
        @keyframes progress {
            0% { left: -30%; }
            100% { left: 100%; }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        loadingOverlay.style.opacity = '0';
        loadingOverlay.style.transform = 'translateY(-20px)';
        document.body.style.opacity = '1';
        setTimeout(() => {
            loadingOverlay.remove();
            style.remove();
        }, 500);
    }, 1500);
});

// Handle contact form submission with Formspree
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Client-side validation before sending to Formspree
            const name = contactForm.querySelector('#name').value.trim();
            const email = contactForm.querySelector('#email').value.trim();
            const message = contactForm.querySelector('#message').value.trim();
            
            // Validate form
            let isValid = true;
            let errorMessage = '';
            
            if (!name) {
                isValid = false;
                errorMessage = 'Please enter your name.';
                e.preventDefault();
            } else if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
                e.preventDefault();
            } else if (!message) {
                isValid = false;
                errorMessage = 'Please enter a message.';
                e.preventDefault();
            }
            
            // If validation fails, show error
            if (!isValid) {
                showFormMessage(errorMessage, 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // Let Formspree handle the actual submission
            // We'll add an event listener for the form submission response
            const formAction = contactForm.getAttribute('action');
            
            // Only handle custom feedback if using Formspree
            if (formAction && formAction.includes('formspree')) {
                // Use fetch API to submit the form data
                e.preventDefault();
                
                fetch(formAction, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Network response was not ok.');
                })
                .then(data => {
                    // Reset form
                    contactForm.reset();
                    
                    // Show success message
                    showFormMessage('Your message has been sent successfully! We will get back to you soon.', 'success');
                    
                    // Reset button
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                })
                .catch(error => {
                    console.error('Error:', error);
                    showFormMessage('There was an error sending your message. Please try again.', 'error');
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                });
            }
        });
    }
    
    // Function to show form messages
    function showFormMessage(message, type) {
        // Remove any existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message element
        const messageElement = document.createElement('div');
        messageElement.classList.add('form-message', `form-message-${type}`);
        messageElement.textContent = message;
        
        // Add to DOM after the form
        const contactForm = document.getElementById('contactForm');
        contactForm.parentNode.insertBefore(messageElement, contactForm.nextSibling);
        
        // Auto-remove after 5 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                messageElement.classList.add('form-message-fade-out');
                setTimeout(() => messageElement.remove(), 500);
            }, 5000);
        }
    }
});

// Create and animate advanced AI visual with fireflies effect
document.addEventListener('DOMContentLoaded', () => {
    const heroVisual = document.querySelector('.ai-animation');
    if (!heroVisual) return;
    
    // Clear existing content
    heroVisual.innerHTML = '';
    
    // Create canvas for particle animation
    const canvas = document.createElement('canvas');
    canvas.classList.add('particle-canvas');
    heroVisual.appendChild(canvas);
    
    // Add FirstWave logo in the center
    const logoContainer = document.createElement('div');
    logoContainer.classList.add('logo-container');
    logoContainer.innerHTML = `<img src="assets/images/firstwave-logo.png" alt="FirstWave Solutions" class="hero-logo">`;
    heroVisual.appendChild(logoContainer);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .ai-animation {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .particle-canvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
        }
        .logo-container {
            position: relative;
            z-index: 2;
            animation: float 6s ease-in-out infinite;
        }
        .hero-logo {
            width: 220px;
            height: auto;
            filter: drop-shadow(0 0 30px rgba(56, 189, 248, 0.6));
        }
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }
        @keyframes pulse {
            0%, 100% { opacity: 0.2; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize particle system
    const ctx = canvas.getContext('2d');
    let particles = [];
    let fireflies = [];
    let animationFrame;
    
    function initCanvas() {
        canvas.width = heroVisual.offsetWidth;
        canvas.height = heroVisual.offsetHeight;
        
        // Create network particles (more of them)
        particles = [];
        const particleCount = Math.floor(canvas.width * canvas.height / 5000); // Doubled the density
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2 + 0.5,
                color: `rgba(${Math.floor(Math.random() * 100 + 156)}, ${Math.floor(Math.random() * 100 + 156)}, 248, ${Math.random() * 0.5 + 0.3})`,
                speedX: (Math.random() * 2 - 1) * 0.5,
                speedY: (Math.random() * 2 - 1) * 0.5,
                connections: []
            });
        }
        
        // Create fireflies
        fireflies = [];
        const fireflyCount = Math.floor(canvas.width * canvas.height / 15000);
        
        for (let i = 0; i < fireflyCount; i++) {
            const hue = Math.random() > 0.7 ? 190 : 220; // Mostly blue with some purple
            fireflies.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 3 + 2,
                color: `hsla(${hue}, 100%, 70%, 1)`,
                speedX: (Math.random() * 2 - 1) * 0.8,
                speedY: (Math.random() * 2 - 1) * 0.8,
                pulseSpeed: Math.random() * 0.01 + 0.005,
                pulsePhase: Math.random() * Math.PI * 2,
                glowSize: Math.random() * 15 + 10
            });
        }
    }
    
    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw connection lines first (behind particles)
        particles.forEach(particle => {
            particles.forEach(otherParticle => {
                if (particle === otherParticle) return;
                
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) { // Increased connection distance
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = `rgba(56, 189, 248, ${(1 - distance / 120) * 0.2})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
        });
        
        // Update and draw network particles
        particles.forEach(particle => {
            // Move particle
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
        });
        
        // Update and draw fireflies
        fireflies.forEach(firefly => {
            // Move firefly
            firefly.x += firefly.speedX;
            firefly.y += firefly.speedY;
            
            // Bounce off edges with slight randomization
            if (firefly.x < 0 || firefly.x > canvas.width) {
                firefly.speedX *= -1;
                firefly.speedX += (Math.random() * 0.2 - 0.1);
            }
            if (firefly.y < 0 || firefly.y > canvas.height) {
                firefly.speedY *= -1;
                firefly.speedY += (Math.random() * 0.2 - 0.1);
            }
            
            // Keep speed in reasonable range
            firefly.speedX = Math.max(-1, Math.min(1, firefly.speedX));
            firefly.speedY = Math.max(-1, Math.min(1, firefly.speedY));
            
            // Update pulse phase
            firefly.pulsePhase += firefly.pulseSpeed;
            
            // Calculate current pulse value (0 to 1)
            const pulseValue = (Math.sin(firefly.pulsePhase) + 1) / 2;
            
            // Draw glow
            const gradient = ctx.createRadialGradient(
                firefly.x, firefly.y, 0,
                firefly.x, firefly.y, firefly.glowSize * pulseValue
            );
            gradient.addColorStop(0, firefly.color.replace('1)', `${0.7 * pulseValue})`));
            gradient.addColorStop(1, firefly.color.replace('1)', '0)'));
            
            ctx.beginPath();
            ctx.arc(firefly.x, firefly.y, firefly.glowSize * pulseValue, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Draw firefly center
            ctx.beginPath();
            ctx.arc(firefly.x, firefly.y, firefly.radius * (0.5 + pulseValue * 0.5), 0, Math.PI * 2);
            ctx.fillStyle = firefly.color;
            ctx.fill();
        });
        
        animationFrame = requestAnimationFrame(drawParticles);
    }
    
    // Initialize and start animation
    initCanvas();
    drawParticles();
    
    // Handle resize
    window.addEventListener('resize', () => {
        cancelAnimationFrame(animationFrame);
        initCanvas();
        drawParticles();
    });
    
    // Interactive effects on mouse move
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Affect particles
        particles.forEach(particle => {
            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) {
                const angle = Math.atan2(dy, dx);
                const force = (120 - distance) / 500;
                particle.speedX -= Math.cos(angle) * force;
                particle.speedY -= Math.sin(angle) * force;
            }
        });
        
        // Attract fireflies to cursor
        fireflies.forEach(firefly => {
            const dx = mouseX - firefly.x;
            const dy = mouseY - firefly.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 200) {
                const angle = Math.atan2(dy, dx);
                const force = (200 - distance) / 8000;
                firefly.speedX += Math.cos(angle) * force;
                firefly.speedY += Math.sin(angle) * force;
            }
        });
    });
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu
        navMenu.classList.remove('active');
        const bars = navToggle.querySelectorAll('.bar');
        bars.forEach(bar => {
            bar.style.transform = 'none';
            bar.style.opacity = '1';
        });
        
        // Close notifications
        const notification = document.querySelector('.notification');
        if (notification) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }
});

