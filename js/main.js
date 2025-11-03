// Main JavaScript file for Quantum Gaze website
// Note: Translation system is handled by translations.js

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    const currentLang = getCurrentLanguage();

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
                let successMessage = 'Message sent! We will get back to you soon.';
                if (currentLang === 'fr') {
                    successMessage = 'Message envoyé! Nous vous répondrons bientôt.';
                } else if (currentLang === 'de') {
                    successMessage = 'Nachricht gesendet! Wir werden uns bald bei Ihnen melden.';
                }
                messageDiv.textContent = successMessage;
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
