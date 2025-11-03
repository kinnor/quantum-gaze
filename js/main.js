// Main JavaScript file for Quantum Gaze website
// Note: Translation system is handled by translations.js

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    const currentLang = getCurrentLanguage();

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const messageDiv = document.getElementById('formMessage');
            const submitButton = contactForm.querySelector('button[type="submit"]');

            // Disable submit button and show loading state
            submitButton.disabled = true;
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = currentLang === 'fr' ? 'Envoi en cours...' :
                                       currentLang === 'de' ? 'Wird gesendet...' :
                                       'Sending...';

            // Get form data
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            try {
                // Send form data to Cloudflare Pages Function
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    // Success message
                    let successMessage = 'Message sent! We will get back to you soon.';
                    if (currentLang === 'fr') {
                        successMessage = 'Message envoyé! Nous vous répondrons bientôt.';
                    } else if (currentLang === 'de') {
                        successMessage = 'Nachricht gesendet! Wir werden uns bald bei Ihnen melden.';
                    }
                    messageDiv.textContent = successMessage;
                    messageDiv.className = 'form-message success';
                    messageDiv.style.display = 'block';

                    // Reset form
                    contactForm.reset();

                    // Hide message after 5 seconds
                    setTimeout(() => {
                        messageDiv.style.display = 'none';
                    }, 5000);
                } else {
                    // Error message
                    let errorMessage = result.error || 'Failed to send message. Please try again.';
                    if (currentLang === 'fr') {
                        errorMessage = result.error || 'Échec de l\'envoi du message. Veuillez réessayer.';
                    } else if (currentLang === 'de') {
                        errorMessage = result.error || 'Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut.';
                    }
                    messageDiv.textContent = errorMessage;
                    messageDiv.className = 'form-message error';
                    messageDiv.style.display = 'block';
                }
            } catch (error) {
                console.error('Contact form error:', error);

                // Network error message
                let errorMessage = 'Network error. Please check your connection and try again.';
                if (currentLang === 'fr') {
                    errorMessage = 'Erreur réseau. Veuillez vérifier votre connexion et réessayer.';
                } else if (currentLang === 'de') {
                    errorMessage = 'Netzwerkfehler. Bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut.';
                }
                messageDiv.textContent = errorMessage;
                messageDiv.className = 'form-message error';
                messageDiv.style.display = 'block';
            } finally {
                // Re-enable submit button
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
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
