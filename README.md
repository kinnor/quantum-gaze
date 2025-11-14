# Quantum Gaze Website

Official website for Quantum Gaze Software Inc. - AI-powered document processing and intelligence solutions.

## Features

- 🌐 Bilingual support (English/French)
- 📱 Fully responsive design
- ⚡ Optimized for Cloudflare Pages
- 🎨 Modern UI/UX with custom design
- 📧 Contact form with validation
- 🦙 **AI-Powered Chatbot** - Interactive Llama AI assistant powered by Cloudflare Workers AI

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

## 🦙 AI Chatbot Feature

The website includes an interactive AI chatbot powered by **Meta's Llama 3.1** model running on **Cloudflare Workers AI**.

### Features
- Real-time conversational AI using Llama 3.1 8B Instruct model
- Context-aware responses about Quantum Gaze services
- Smart conversation history tracking
- Suggested follow-up questions
- Beautiful UI with Llama-themed design (warm orange/amber colors)
- Mobile-responsive chat interface

### Configuration

The chatbot works automatically when deployed to Cloudflare Pages with Workers AI enabled. No API keys required!

**To enable the chatbot on Cloudflare Pages:**

1. Deploy to Cloudflare Pages (see deployment instructions above)
2. In Cloudflare Dashboard, go to **Workers & Pages** > Select your project
3. Go to **Settings** > **Functions** > **Workers AI Binding**
4. Add a binding named `AI` (this is automatically available for Cloudflare Pages)
5. The chatbot will automatically work once deployed!

**Local Development:**

The chatbot will show a fallback message during local development since Cloudflare Workers AI is only available in production. To test locally with full functionality, use Wrangler:

```bash
# Install Wrangler
npm install -g wrangler

# Run with Workers AI in dev mode
wrangler pages dev .
```

### Technical Details
- **Model**: `@cf/meta/llama-3.1-8b-instruct`
- **Backend**: Cloudflare Pages Functions (`functions/api/ai-chat.js`)
- **Frontend**: Pure JavaScript (`js/ai-chatbot.js`)
- **Styling**: Custom CSS with Llama theme (`css/ai-chatbot.css`)

### Customization

The chatbot can be customized by editing:
- **Company context**: Edit the system message in `functions/api/ai-chat.js`
- **UI/UX**: Modify `css/ai-chatbot.css` for styling
- **Behavior**: Update `js/ai-chatbot.js` for frontend logic

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
│   ├── style.css          # Main stylesheet
│   └── ai-chatbot.css     # Chatbot styling (Llama theme)
├── js/
│   ├── main.js            # Main JavaScript
│   ├── i18n.js            # Internationalization
│   └── ai-chatbot.js      # Chatbot frontend logic
├── functions/
│   └── api/
│       └── ai-chat.js     # Cloudflare Function for Llama AI
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
- **Cloudflare Workers AI** - Llama 3.1 8B Instruct model
- **Cloudflare Pages Functions** - Serverless API endpoints

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
