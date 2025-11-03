# Quantum Gaze Website

Official website for Quantum Gaze Software Inc. - AI-powered document processing and intelligence solutions.

## Features

- 🌐 Bilingual support (English/French)
- 📱 Fully responsive design
- ⚡ Optimized for Cloudflare Pages
- 🎨 Modern UI/UX with custom design
- 📧 Contact form with validation

## Quick Start

### Local Development

```bash
# Using npx serve
npm start

# Using live-server for auto-reload
npm run dev
```

Open your browser to the URL shown in the terminal (usually http://localhost:3000 or http://localhost:8080).

## Deployment to Cloudflare Pages

### Method 1: GitHub Integration (Recommended)

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**
3. Select your GitHub repository: `kinnor/quantum-gaze`
4. Configure build settings:
   - **Project name**: quantum-gaze
   - **Production branch**: main
   - **Build command**: (leave empty)
   - **Build output directory**: `/` (root directory)
5. Click **Save and Deploy**

### Method 2: Direct Upload

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
wrangler pages deploy . --project-name=quantum-gaze
```

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
│   ├── main.js            # Main JavaScript
│   └── i18n.js            # Internationalization
├── _headers               # Cloudflare custom headers
├── _redirects             # Cloudflare redirects (optional)
├── wrangler.toml          # Cloudflare configuration
└── package.json           # Project metadata
```

## Technologies Used

- HTML5
- CSS3 (Grid, Flexbox, Custom Properties)
- Vanilla JavaScript (ES6+)
- Google Fonts (Libre Baskerville, Nunito)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

© 2024 Quantum Gaze Software Inc. All rights reserved.

## Contact

- **Website**: https://quantum-gaze.ca
- **Email**: service@quantum-gaze.com
- **Phone**: +1 438 738 3887

## Social Media

- [Twitter](https://twitter.com/quantum_gaze)
- [Instagram](https://www.instagram.com/quantumgaze_software/)
- [LinkedIn](https://www.linkedin.com/company/101811434)
- [YouTube](https://www.youtube.com/channel/UCE2lqRd39XoVJvauXcvHttg)
