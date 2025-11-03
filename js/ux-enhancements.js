/**
 * UX Enhancement Script
 * Improves user experience with sticky nav, search, FAQ, etc.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Sticky Navigation on Scroll
    initStickyNav();

    // Back to Top Button
    initBackToTop();

    // FAQ Accordion
    initFAQ();

    // Search Functionality
    initSearch();

    // Smooth Scroll for Anchor Links
    initSmoothScroll();

    // Highlight Active Navigation Section
    initActiveNav();
});

// Sticky Navigation
function initStickyNav() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// Back to Top Button
function initBackToTop() {
    // Create back to top button if it doesn't exist
    let backToTop = document.querySelector('.back-to-top');

    if (!backToTop) {
        backToTop = document.createElement('div');
        backToTop.className = 'back-to-top';
        backToTop.innerHTML = '↑';
        backToTop.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(backToTop);
    }

    // Show/hide on scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    // Scroll to top on click
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// FAQ Accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Search Functionality
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');

    if (!searchInput) return;

    // Searchable content (page titles and descriptions)
    const searchableContent = [
        {
            title: 'Home',
            url: 'index.html',
            keywords: 'AI solutions legacy modernization software development quantum gaze',
            snippet: 'Quebec-based software development with 35+ years experience'
        },
        {
            title: 'About Us',
            url: 'about.html',
            keywords: 'company history team expertise experience background',
            snippet: 'Learn about our company, team, and 35+ years of software engineering'
        },
        {
            title: 'Services - Custom AI Development',
            url: 'services.html',
            keywords: 'AI development machine learning NLP custom software',
            snippet: 'Custom AI solutions, machine learning, and intelligent automation'
        },
        {
            title: 'Services - Legacy Modernization',
            url: 'services.html',
            keywords: 'legacy systems modernization migration upgrade',
            snippet: 'Transform legacy systems into modern, scalable applications'
        },
        {
            title: 'Services - Multilingual Solutions',
            url: 'services.html',
            keywords: 'multilingual English French German translation localization',
            snippet: 'Multilingual software development in EN/FR/DE'
        },
        {
            title: 'Solutions',
            url: 'solutions.html',
            keywords: 'products platforms tools solutions software',
            snippet: 'Our software solutions and platforms for enterprise clients'
        },
        {
            title: 'Industries - Government',
            url: 'industries.html',
            keywords: 'government public sector federal provincial municipal',
            snippet: 'Solutions for government and public sector organizations'
        },
        {
            title: 'Industries - Healthcare',
            url: 'industries.html',
            keywords: 'healthcare medical hospitals pharma',
            snippet: 'Healthcare and pharmaceutical software solutions'
        },
        {
            title: 'Contact Us',
            url: 'contact.html',
            keywords: 'contact phone email support inquiry demo',
            snippet: 'Get in touch: +1-438-738-3887 or service@quantum-gaze.com'
        }
    ];

    // Search on input
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        if (query.length < 2) {
            searchResults.classList.remove('visible');
            return;
        }

        // Filter results
        const results = searchableContent.filter(item =>
            item.title.toLowerCase().includes(query) ||
            item.keywords.toLowerCase().includes(query) ||
            item.snippet.toLowerCase().includes(query)
        );

        // Display results
        if (results.length > 0) {
            displaySearchResults(results);
        } else {
            displayNoResults();
        }
    });

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            searchResults.classList.remove('visible');
        }
    });
}

function displaySearchResults(results) {
    const searchResults = document.querySelector('.search-results');

    searchResults.innerHTML = results.map(result => `
        <a href="${result.url}" class="search-result-item">
            <div class="search-result-title">${result.title}</div>
            <div class="search-result-snippet">${result.snippet}</div>
        </a>
    `).join('');

    searchResults.classList.add('visible');
}

function displayNoResults() {
    const searchResults = document.querySelector('.search-results');

    searchResults.innerHTML = `
        <div class="search-result-item">
            <div class="search-result-title">No results found</div>
            <div class="search-result-snippet">Try different keywords or visit our <a href="contact.html">contact page</a></div>
        </div>
    `;

    searchResults.classList.add('visible');
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const offset = 80; // Account for sticky nav
                const targetPosition = target.offsetTop - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Highlight Active Navigation
function initActiveNav() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active-section');
        }
    });
}

// Lazy Load Images (Performance)
function initLazyLoad() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Quick Access Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.focus();
        }
    }

    // ESC to close search
    if (e.key === 'Escape') {
        const searchResults = document.querySelector('.search-results');
        if (searchResults) {
            searchResults.classList.remove('visible');
        }
    }
});
