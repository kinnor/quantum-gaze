# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Quantum Gaze Software Inc. website - A bilingual (English/French) static website showcasing AI-powered document processing and intelligence solutions. The site is optimized for deployment on Cloudflare Pages.

## Technology Stack

- **Frontend**: Pure HTML5, CSS3, JavaScript (no framework)
- **Fonts**: Google Fonts (Libre Baskerville for headings, Nunito for body)
- **Deployment**: Cloudflare Pages
- **Version Control**: Git

## Project Structure

```
.
├── index.html              # Homepage
├── about.html              # About page
├── services.html           # Services page
├── solutions.html          # Solutions page
├── industries.html         # Industries page
├── contact.html            # Contact page
├── css/
│   └── style.css          # Main stylesheet
├── js/
│   ├── main.js            # Main JavaScript functionality
│   └── i18n.js            # Internationalization helper
├── images/                 # Image assets (to be added)
├── _headers               # Cloudflare custom headers
├── _redirects             # Cloudflare redirects
├── wrangler.toml          # Cloudflare configuration
├── package.json           # Project metadata
└── .gitignore            # Git ignore rules
```

## Development Commands

### Local Development

```bash
# Start a local server (using npx serve)
npm start

# Start with live reload (using npx live-server)
npm run dev
```

### Testing

Open the site in a browser and test:
- All page navigation
- Language switcher (EN/FR)
- Contact form submission
- Responsive design (mobile, tablet, desktop)
- All interactive elements

## Key Features

### Bilingual Support

The site supports English and French:
- Language switcher in navigation (top-right)
- Language preference stored in localStorage
- i18n system in `js/i18n.js` and `js/main.js`
- To add translations: Update the `translations` object in `js/main.js`

### Responsive Design

- Mobile-first approach
- Breakpoints: 480px, 768px, 992px, 1200px
- Flexible grid system using CSS Grid and Flexbox
- All pages are fully responsive

### Cloudflare Deployment

The site is configured for Cloudflare Pages:

1. **Headers** (`_headers`): Custom HTTP headers for security and caching
   - Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
   - Cache-Control for static assets

2. **Redirects** (`_redirects`): URL redirects and 404 handling

3. **Wrangler** (`wrangler.toml`): Cloudflare Workers/Pages configuration

## Design System

### Color Palette

```css
--primary-color: #147dbf    /* Blue - main brand color */
--secondary-color: #10b8ce  /* Cyan - accent color */
--text-dark: #212121        /* Dark gray - body text */
--text-light: #666          /* Light gray - secondary text */
--bg-light: #f8f9fa         /* Light background */
--white: #ffffff            /* White */
```

### Typography

- **Headings**: Libre Baskerville, 700 weight, serif
- **Body**: Nunito, 300 weight, sans-serif
- Font sizes are responsive using rem units

### Components

- **Navbar**: Sticky navigation with language switcher
- **Hero Section**: Gradient background with call-to-action
- **Feature Cards**: Hover effects with box shadows
- **Contact Form**: Validated form with success/error messaging
- **Footer**: Multi-column layout with social links

## Content Structure

### Pages

1. **Home** (`index.html`)
   - Hero section with tagline
   - Brief introduction to services
   - Call-to-action button

2. **About** (`about.html`)
   - Company mission
   - Expertise areas (5 key features)
   - Why choose us (4 benefits)

3. **Services** (`services.html`)
   - Data extraction
   - Document classification
   - Contextual understanding
   - Workflow integration
   - Adaptive learning
   - Custom solutions

4. **Solutions** (`solutions.html`)
   - Data extraction solution
   - Document categorization solution
   - Key benefits for each

5. **Industries** (`industries.html`)
   - Retail commerce
   - Freight transportation
   - Customs brokerage
   - Accounting & finance
   - Supply chain
   - Other industries

6. **Contact** (`contact.html`)
   - Contact information (phone, email)
   - Business hours
   - Contact form
   - Company description

## Coding Standards

### HTML
- Use semantic HTML5 elements
- Include meta tags for SEO
- Ensure accessibility (alt text, ARIA labels when needed)
- Maintain consistent indentation (4 spaces)

### CSS
- Follow BEM-like naming conventions where appropriate
- Use CSS custom properties (variables) for theming
- Mobile-first media queries
- Comment major sections

### JavaScript
- Use modern ES6+ syntax
- Add comments for complex logic
- Handle errors gracefully
- Ensure cross-browser compatibility

## Adding New Pages

1. Create new HTML file in root directory
2. Copy structure from existing page (e.g., `index.html`)
3. Update page title, meta description, and active nav link
4. Add content following existing patterns
5. Test responsive design
6. Add translations if using bilingual features

## Modifying Styles

- All styles in `css/style.css`
- Use CSS variables for colors and fonts
- Test changes across all pages
- Verify responsive breakpoints

## Contact Form Integration

Currently, the contact form uses a simulated submission (setTimeout). To integrate with a real backend:

1. Update `js/main.js` contact form handler
2. Replace setTimeout with actual API call (fetch/axios)
3. Handle success/error responses
4. Consider adding reCAPTCHA or similar spam protection

## Deployment to Cloudflare Pages

### Via GitHub Integration

1. Log in to Cloudflare Dashboard
2. Go to Pages > Create a project
3. Connect to GitHub repository: `kinnor/quantum-gaze`
4. Configure build:
   - Build command: (leave empty)
   - Build output directory: `/`
   - Root directory: `/`
5. Deploy

### Via Wrangler CLI

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
wrangler pages publish . --project-name=quantum-gaze
```

## SEO Considerations

- All pages have unique titles and meta descriptions
- Semantic HTML structure for better crawling
- Fast load times (static HTML, optimized CSS)
- Mobile-friendly (responsive design)
- Consider adding:
  - sitemap.xml
  - robots.txt
  - Open Graph meta tags
  - Schema.org structured data

## Future Enhancements

Potential improvements to consider:
- Add image assets and optimize them
- Implement full i18n with separate language files
- Add animations (AOS, GSAP)
- Create a blog section
- Add case studies/testimonials
- Integrate analytics (Google Analytics, Cloudflare Web Analytics)
- Add search functionality
- Implement dark mode toggle
- Add more interactive elements

## Contact Information

- **Company**: Quantum Gaze Software Inc.
- **Phone**: +1 438 738 3887
- **Email**: service@quantum-gaze.com
- **Website**: https://quantum-gaze.ca
- **Repository**: https://github.com/kinnor/quantum-gaze

## Social Media

- Twitter: https://twitter.com/quantum_gaze
- Instagram: https://www.instagram.com/quantumgaze_software/
- LinkedIn: https://www.linkedin.com/company/101811434
- YouTube: https://www.youtube.com/channel/UCE2lqRd39XoVJvauXcvHttg
