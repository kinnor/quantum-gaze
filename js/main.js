// Main JavaScript file for Quantum Gaze website

// Language translations
const translations = {
    en: {
        nav: {
            home: 'Home',
            services: 'Services',
            solutions: 'Solutions',
            industries: 'Industries',
            about: 'About',
            contact: 'Contact Us'
        }
    },
    fr: {
        nav: {
            home: 'Accueil',
            services: 'Services',
            solutions: 'Solutions',
            industries: 'Industries',
            about: 'À propos',
            contact: 'Nous joindre'
        }
    }
};

// Get current language from localStorage or default to 'en'
function getCurrentLanguage() {
    return localStorage.getItem('language') || 'en';
}

// Set language and reload page
function setLanguage(lang) {
    localStorage.setItem('language', lang);
    location.reload();
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function() {
    const currentLang = getCurrentLanguage();

    // Update language selector if exists
    const langSelector = document.getElementById('languageSelector');
    if (langSelector) {
        langSelector.value = currentLang;
        langSelector.addEventListener('change', function(e) {
            setLanguage(e.target.value);
        });
    }

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                const messageDiv = document.getElementById('formMessage');
                messageDiv.textContent = currentLang === 'fr'
                    ? 'Message envoyé! Nous vous répondrons bientôt.'
                    : 'Message sent! We will get back to you soon.';
                messageDiv.className = 'form-message success';

                // Reset form
                contactForm.reset();

                // Hide message after 5 seconds
                setTimeout(() => {
                    messageDiv.style.display = 'none';
                }, 5000);
            }, 500);
        });
    }

    // Smooth scrolling for anchor links
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
});
