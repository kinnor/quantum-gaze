// Main JavaScript file for Quantum Gaze website
// Note: Translation system is handled by translations.js

// ---------------------------------------------------------------------------
// Regeneration safety net (added 2026-08-29).
// The page generator periodically rewrites translations.js, contact.html and
// edi-sandbox.js and has repeatedly dropped: the i18n runtime, the reCAPTCHA
// loader, and the terminal-stream line cap. main.js is never regenerated, so
// the fallbacks live here. Every fallback defers to the real implementation
// when it is present.
// ---------------------------------------------------------------------------
(function qgSafetyNet() {
    // 1) i18n runtime fallback — only defined if translations.js did not.
    function resolveKey(dict, keyPath) {
        if (!dict || typeof keyPath !== 'string') return undefined;
        return keyPath.split('.').reduce(function (acc, k) {
            return acc && Object.prototype.hasOwnProperty.call(acc, k) ? acc[k] : undefined;
        }, dict);
    }
    if (typeof window.getCurrentLanguage !== 'function') {
        window.getCurrentLanguage = function () {
            try { return localStorage.getItem('language') || 'en'; } catch (e) { return 'en'; }
        };
    }
    if (typeof window.updatePageContent !== 'function') {
        window.updatePageContent = function (lang) {
            var all = (typeof translations !== 'undefined') ? translations : null;
            if (!all || typeof document === 'undefined') return;
            var dict = all[lang] || all.en;
            document.querySelectorAll('[data-i18n]').forEach(function (el) {
                var key = el.getAttribute('data-i18n');
                var value = resolveKey(dict, key);
                if (typeof value !== 'string') value = resolveKey(all.en, key);
                if (typeof value !== 'string') return;
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = value;
                else el.textContent = value;
            });
            var sel = document.getElementById('languageSelector');
            if (sel) sel.value = lang;
        };
    }
    if (typeof window.setLanguage !== 'function') {
        window.setLanguage = function (lang) {
            try { localStorage.setItem('language', lang); } catch (e) { /* storage blocked */ }
            window.updatePageContent(lang);
        };
    }

    document.addEventListener('DOMContentLoaded', function () {
        // Apply translations + wire the selector if translations.js did not.
        if (!window.__qgI18nBound) {
            window.__qgI18nBound = true;
            window.updatePageContent(window.getCurrentLanguage());
            var sel = document.getElementById('languageSelector');
            if (sel) sel.addEventListener('change', function (e) { window.setLanguage(e.target.value); });
        }

        // 2) reCAPTCHA v3 loader fallback — only on pages with the contact form,
        //    only if no recaptcha script tag exists. Site key comes from js/config.js.
        if (document.getElementById('contactForm') &&
            !document.querySelector('script[src*="recaptcha/api.js"], script[src*="recaptcha/enterprise.js"]')) {
            var loadRecaptcha = function () {
                var key = window.RECAPTCHA_SITE_KEY;
                if (!key || key === 'YOUR_RECAPTCHA_SITE_KEY') return;
                var s = document.createElement('script');
                s.src = 'https://www.google.com/recaptcha/enterprise.js?render=' + encodeURIComponent(key);
                s.async = true;
                document.head.appendChild(s);
            };
            if (window.RECAPTCHA_SITE_KEY) {
                loadRecaptcha();
            } else if (!document.querySelector('script[src$="js/config.js"]')) {
                var c = document.createElement('script');
                c.src = 'js/config.js';
                c.onload = loadRecaptcha;
                document.head.appendChild(c);
            } else {
                loadRecaptcha();
            }
        }

        // 3) Terminal stream cap fallback — trim to 40 lines regardless of edi-sandbox.js.
        var term = document.getElementById('terminalStream');
        if (term && typeof MutationObserver === 'function') {
            new MutationObserver(function () {
                while (term.children.length > 40) term.removeChild(term.firstChild);
            }).observe(term, { childList: true });
        }
    });
})();

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
                message: document.getElementById('message').value,
                language: currentLang,
                recaptchaToken: null
            };

            // Get reCAPTCHA token if available
            if (typeof grecaptcha !== 'undefined') {
                try {
                    // reCAPTCHA Enterprise exposes grecaptcha.enterprise; classic v3 uses grecaptcha directly.
                    const rc = (grecaptcha.enterprise && typeof grecaptcha.enterprise.execute === 'function') ? grecaptcha.enterprise : grecaptcha;
                    await new Promise(function (resolve) { rc.ready(resolve); });
                    formData.recaptchaToken = await rc.execute(
                        window.RECAPTCHA_SITE_KEY || 'YOUR_RECAPTCHA_SITE_KEY',
                        { action: 'contact_form' }
                    );
                } catch (recaptchaError) {
                    console.warn('reCAPTCHA not available:', recaptchaError);
                }
            }

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
