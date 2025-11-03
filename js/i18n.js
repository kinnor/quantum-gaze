// Internationalization helper
const i18n = {
    currentLang: localStorage.getItem('language') || 'en',

    translations: {
        en: {
            // Navigation
            'nav.home': 'Home',
            'nav.services': 'Services',
            'nav.solutions': 'Solutions',
            'nav.industries': 'Industries',
            'nav.about': 'About',
            'nav.contact': 'Contact Us',

            // Footer
            'footer.contact': 'Contact',
            'footer.phone': 'Phone',
            'footer.email': 'Email',
            'footer.follow': 'Follow Us',
            'footer.copyright': '© 2024 Quantum Gaze Software Inc. All rights reserved.',

            // Home page
            'home.hero.title': 'Entering the world of Quantum Gaze',
            'home.hero.subtitle': 'Empowering Progress, Elevating Businesses: Unleashing the Power of Data Automation',
            'home.hero.cta': 'Learn more about what we do',

            // Contact
            'contact.title': 'Contact us for seamless solutions and exceptional support',
            'contact.getintouch': 'Get in Touch',
            'contact.firstname': 'First Name',
            'contact.lastname': 'Last Name',
            'contact.email': 'Email',
            'contact.message': 'Message',
            'contact.send': 'Send Message',
            'contact.hours': 'Business Hours'
        },
        fr: {
            // Navigation
            'nav.home': 'Accueil',
            'nav.services': 'Services',
            'nav.solutions': 'Solutions',
            'nav.industries': 'Industries',
            'nav.about': 'À propos',
            'nav.contact': 'Nous joindre',

            // Footer
            'footer.contact': 'Contact',
            'footer.phone': 'Téléphone',
            'footer.email': 'Courriel',
            'footer.follow': 'Suivez-nous',
            'footer.copyright': '© 2024 Logiciel Quantum Gaze Inc. Tous droits réservés.',

            // Home page
            'home.hero.title': 'Entrez dans le monde de Quantum Gaze',
            'home.hero.subtitle': 'Propulser le progrès, élever les entreprises : libérer la puissance de l\'automatisation des données',
            'home.hero.cta': 'En savoir plus sur ce que nous faisons',

            // Contact
            'contact.title': 'Contactez-nous pour des solutions transparentes et un support exceptionnel',
            'contact.getintouch': 'Entrez en contact',
            'contact.firstname': 'Prénom',
            'contact.lastname': 'Nom',
            'contact.email': 'Courriel',
            'contact.message': 'Message',
            'contact.send': 'Envoyer le message',
            'contact.hours': 'Heures d\'ouverture'
        }
    },

    t(key) {
        return this.translations[this.currentLang][key] || key;
    },

    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('language', lang);
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = i18n;
}
