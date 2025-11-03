/**
 * SEO Enhancement Script for Quantum Gaze
 * Adds structured data (Schema.org JSON-LD) to pages dynamically
 */

// Page-specific SEO data
const SEO_DATA = {
    organization: {
        "@context": "https://schema.org",
        "@type": "SoftwareCompany",
        "name": "Quantum Gaze Software Inc.",
        "alternateName": "Quantum Gaze",
        "url": "https://quantum-gaze.ca",
        "logo": "https://quantum-gaze.ca/images/QGS-Logo.png",
        "description": "Quebec-based software development company specializing in AI solutions, legacy system modernization, and multilingual software development.",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "CA",
            "addressRegion": "QC",
            "addressLocality": "Quebec"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+1-438-738-3887",
            "contactType": "customer service",
            "email": "service@quantum-gaze.com",
            "availableLanguage": ["English", "French", "German"]
        },
        "sameAs": [
            "https://www.linkedin.com/company/101811434",
            "https://twitter.com/quantum_gaze",
            "https://www.instagram.com/quantumgaze_software/",
            "https://www.youtube.com/channel/UCE2lqRd39XoVJvauXcvHttg"
        ],
        "foundingDate": "2023",
        "numberOfEmployees": {
            "@type": "QuantitativeValue",
            "value": "1-10"
        },
        "slogan": "AI Solutions & Legacy Modernization"
    },

    website: {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Quantum Gaze Software Inc.",
        "url": "https://quantum-gaze.ca",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://quantum-gaze.ca/?s={search_term_string}",
            "query-input": "required name=search_term_string"
        },
        "inLanguage": ["en", "fr", "de"]
    },

    breadcrumb: function(items) {
        return {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": items.map((item, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": item.name,
                "item": item.url
            }))
        };
    },

    service: function(name, description) {
        return {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": name,
            "provider": {
                "@type": "Organization",
                "name": "Quantum Gaze Software Inc."
            },
            "description": description,
            "areaServed": {
                "@type": "Country",
                "name": ["Canada", "United States", "Germany"]
            }
        };
    }
};

// Add structured data to page
function addStructuredData(data) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
}

// Initialize SEO on page load
document.addEventListener('DOMContentLoaded', function() {
    // Add organization schema to all pages
    addStructuredData(SEO_DATA.organization);

    // Add website schema to homepage
    if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
        addStructuredData(SEO_DATA.website);
    }

    // Add page-specific breadcrumbs
    const pageName = document.querySelector('h1')?.textContent || document.title;
    const breadcrumbs = [
        { name: 'Home', url: 'https://quantum-gaze.ca/' },
        { name: pageName, url: window.location.href }
    ];
    addStructuredData(SEO_DATA.breadcrumb(breadcrumbs));
});
