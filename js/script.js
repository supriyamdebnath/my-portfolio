// ========== LOADING SCREEN ==========
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading');
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        startParticles();
    }, 2500);
});

// ========== SCROLL PROGRESS BAR ==========
window.addEventListener('scroll', () => {
    const scrollProgress = document.querySelector('.scroll-progress');
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / scrollHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
});

// ========== PARTICLE SYSTEM ==========
let particles = [];
const canvas = document.getElementById('particleCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;

function resizeCanvas() {
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
}

class Particle {
    constructor() {
        this.x = Math.random() * (canvas ? canvas.width : 0);
        this.y = Math.random() * (canvas ? canvas.height : 0);
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.25;
        this.color = ['#00d4ff', '#ff006e', '#a020f0'][Math.floor(Math.random() * 3)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity -= 0.002;

        if (this.x > (canvas ? canvas.width : 0)) this.x = 0;
        if (this.x < 0) this.x = canvas ? canvas.width : 0;
        if (this.y > (canvas ? canvas.height : 0)) this.y = 0;
        if (this.y < 0) this.y = canvas ? canvas.height : 0;
    }

    draw() {
        if (ctx) {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
}

function startParticles() {
    if (!canvas) return;

    resizeCanvas();
    particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
    animateParticles();
}

function animateParticles() {
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    if (Math.random() < 0.3) {
        particles.push(new Particle());
    }

    particles = particles.filter(p => p.opacity > 0);
    requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', resizeCanvas);

// ========== CURSOR GLOW EFFECT ==========
const cursorGlow = document.querySelector('.cursor-glow');

document.addEventListener('mousemove', (e) => {
    if (cursorGlow) {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
        cursorGlow.classList.add('active');
    }
});

document.addEventListener('mouseleave', () => {
    if (cursorGlow) {
        cursorGlow.classList.remove('active');
    }
});

// ========== NAVBAR INTERACTIONS ==========
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Smooth scroll and nav highlight
window.addEventListener('scroll', () => {
    // Navbar blur effect
    if (window.scrollY > 50) {
        navbar?.classList.add('scrolled');
    } else {
        navbar?.classList.remove('scrolled');
    }

    // Update active nav link
    const sections = document.querySelectorAll('section');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Hamburger menu toggle
hamburger?.addEventListener('click', () => {
    navMenu?.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close menu when link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu?.classList.remove('active');
        hamburger?.classList.remove('active');
    });
});

// ========== TYPING TEXT ANIMATION ==========
const typedText = document.getElementById('typedText');
const textToType = 'SUPRIYAM DEBNATH';
let typeIndex = 0;

function typeText() {
    if (typeIndex < textToType.length) {
        typedText.textContent += textToType[typeIndex];
        typeIndex++;
        setTimeout(typeText, 60);
    }
}

window.addEventListener('load', () => {
    setTimeout(typeText, 1500);
});

// ========== SMOOTH SCROLL NAVIGATION ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// ========== INTERSECTION OBSERVER FOR ANIMATIONS ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe animated elements
setTimeout(() => {
    document.querySelectorAll('.project-card, .skill-card, .about-card, .timeline-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
}, 2500);

// ========== CONTACT FORM HANDLING ==========
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name')?.value || '';
        const email = document.getElementById('email')?.value || '';
        const message = document.getElementById('message')?.value || '';

        // Validation
        if (!name || !email || !message) {
            showFormMessage('Please fill in all fields!', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormMessage('Please enter a valid email address!', 'error');
            return;
        }

        // Simulate form submission
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>SENDING...</span>';

        setTimeout(() => {
            showFormMessage('Message sent successfully! Thanks for reaching out! 🚀', 'success');
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            // Log form data
            console.log('Contact Form Submission:', { name, email, message });
        }, 1500);
    });
}

function showFormMessage(message, type) {
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = `form-message show ${type}`;

        setTimeout(() => {
            formMessage.classList.remove('show');
        }, 4000);
    }
}

// ========== BUTTON RIPPLE EFFECT ==========
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.position = 'absolute';
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'radial-gradient(circle, rgba(255,255,255,0.6), transparent)';
        ripple.style.pointerEvents = 'none';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.opacity = '0';

        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation to stylesheet
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========== KONAMI CODE EASTER EGG ==========
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    const key = e.key;

    if (key === konamiCode[konamiIndex]) {
        konamiIndex++;

        if (konamiIndex === konamiCode.length) {
            triggerEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function triggerEasterEgg() {
    const easterEgg = document.getElementById('easterEgg');

    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const clone = easterEgg.cloneNode(true);
            clone.classList.add('active');
            clone.style.left = Math.random() * 100 + '%';
            clone.style.top = Math.random() * 100 + '%';
            document.body.appendChild(clone);

            setTimeout(() => clone.remove(), 2000);
        }, i * 100);
    }

    // Console easter egg message
    console.log('%c🎮 EASTER EGG ACTIVATED! 🎮', 'color: #ff006e; font-size: 20px; font-weight: bold;');
    console.log('%cYou found the secret Konami code! 🎵', 'color: #00d4ff; font-size: 14px;');
}

// ========== PARALLAX SCROLL EFFECT ==========
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;

    document.querySelectorAll('.hero').forEach(section => {
        section.style.backgroundPosition = `center ${scrolled * 0.5}px`;
    });
});

// ========== MOUSE FOLLOW LIGHT ==========
const container = document.body;
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX / window.innerWidth;
    mouseY = e.clientY / window.innerHeight;

    container.style.setProperty('--mouse-x', mouseX);
    container.style.setProperty('--mouse-y', mouseY);
});

// ========== RANDOM PARTICLE BURST ON CLICK ==========
document.addEventListener('click', (e) => {
    if (e.target.closest('.btn') || e.target.closest('a')) {
        createParticleBurst(e.clientX, e.clientY);
    }
});

function createParticleBurst(x, y) {
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '6px';
        particle.style.height = '6px';
        particle.style.background = ['#00d4ff', '#ff006e', '#a020f0'][Math.floor(Math.random() * 3)];
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        particle.style.boxShadow = `0 0 10px ${particle.style.background}`;

        const angle = (Math.PI * 2 * i) / 10;
        const velocity = 2 + Math.random() * 2;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;

        document.body.appendChild(particle);

        let life = 50;
        const animate = () => {
            x += vx;
            y += vy;
            life -= 1;

            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.opacity = life / 50;

            if (life > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };

        animate();
    }
}

// ========== PERFORMANCE OPTIMIZATIONS ==========
// Throttle scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) return;

    scrollTimeout = setTimeout(() => {
        scrollTimeout = null;
    }, 100);
}, { passive: true });

// ========== INITIALIZATION MESSAGES ==========
console.log('%c🚀 SUPRIYAM DEBNATH - PORTFOLIO', 'color: #00d4ff; font-size: 18px; font-weight: bold; text-shadow: 0 0 10px #00d4ff;');
console.log('%c🤖 AI Developer | Frontend Developer | CSE Student', 'color: #ff006e; font-size: 12px;');
console.log('%c💜 Check out the code and discover hidden features!', 'color: #a020f0; font-size: 12px;');
console.log('%c🎮 Try the Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A', 'color: #00ff88; font-size: 11px;');

// ========== DYNAMIC TITLE ON TAB CHANGE ==========
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.title = 'Come back... 👀 | Supriyam Debnath';
    } else {
        document.title = 'Supriyam Debnath - AI & Frontend Developer Portfolio';
    }
});

// ========== SMOOTH ANIMATIONS ON PAGE LOAD ==========
window.addEventListener('load', () => {
    document.querySelectorAll('.section-title, .section-header').forEach((element, index) => {
        element.style.animation = `slideInDown 0.8s ease ${index * 0.2}s both`;
    });
});

// ========== ACTIVE NAV LINK INITIALIZATION ==========
window.addEventListener('load', () => {
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    if (navLinks.length > 0) {
        navLinks[0].classList.add('active');
    }
});

// ========== CUSTOM ANIMATION FRAMES ==========
const slideInDown = `
    @keyframes slideInDown {
        from {
            opacity: 0;
            transform: translateY(-30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

if (!document.querySelector('style[data-animation="slideInDown"]')) {
    const animStyle = document.createElement('style');
    animStyle.setAttribute('data-animation', 'slideInDown');
    animStyle.textContent = slideInDown;
    document.head.appendChild(animStyle);
}

// ========== ERROR HANDLING ==========
window.addEventListener('error', (event) => {
    console.error('Portfolio Error:', event.error);
});

// ========== LAST UPDATE MESSAGE ==========
const year = new Date().getFullYear();
console.log(`%c© ${year} Supriyam Debnath | All Rights Reserved`, 'color: #b0b5cc; font-size: 11px;');
