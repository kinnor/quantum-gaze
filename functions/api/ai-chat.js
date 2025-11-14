/**
 * AI Chat API - Cloudflare Pages Function
 * Handles Llama AI via Cloudflare Workers AI
 */

export async function onRequestPost(context) {
    const { request, env } = context;

    // CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle OPTIONS request
    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        // Parse request body
        const { message, conversationHistory = [] } = await request.json();

        if (!message || message.trim().length === 0) {
            return new Response(JSON.stringify({
                error: 'Message is required'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders
                }
            });
        }

        // Check if Cloudflare AI is available
        if (!env.AI) {
            console.error('Cloudflare AI not available - using fallback');
            return new Response(JSON.stringify({
                reply: "Hello! I'm the Quantum Gaze AI Assistant powered by Llama AI. I can help you learn about our EDI solutions, AI services, and answer questions about our company.\n\nNote: The AI service is initializing. Please contact us directly at service@quantum-gaze.com or call +1-438-738-3887 for immediate assistance.",
                suggestions: [
                    'What services does Quantum Gaze offer?',
                    'Tell me about AI-powered EDI',
                    'How can I get started?'
                ]
            }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders
                }
            });
        }

        // Prepare system message with company context
        const systemMessage = {
            role: 'system',
            content: `You are an AI assistant for Quantum Gaze Software Inc., a leading software development company with 24+ years of proven expertise.

FOUNDER'S PROVEN TRACK RECORD:
- 24+ years hands-on software development experience
- 19+ major projects successfully delivered
- Fortune 500 clients: BMW, Byk Gulden GmbH, and multi-billion dollar freight forwarding and customs brokerage companies
- Long-term client partnerships with proven track record
- International experience: Canada, Germany, Italy, Bulgaria
- Leadership roles: IT Manager, Senior Project Manager, Team Lead
- Master's Degree in Computer Science & Technology
- Certifications: X12 EDI Certified, Microsoft, Oracle, IBM, MuleSoft platforms
- Languages: Fluent in English, French, and German

TECHNICAL MASTERY:
- MuleSoft, C#/.NET, MS SQL Server - Extensive expertise
- X12 EDI: Certified professional
- Java, Python, Oracle PL/SQL, C++
- BizTalk Server, Azure Logic Apps, IBM Sterling B2B
- EDI Standards: X12, EDIFACT, TRADACOMS
- Cloud: Azure, AWS, Kubernetes, Docker

PROVEN SUCCESS STORIES:
1. Automated Booking Confirmation System - 85% faster processing, 95% error reduction (Freight Forwarding)
2. Customs Brokerage API Integration - 70% delay reduction, 100% compliance (Global Customs)
3. BMW Enterprise Integration - Long-term partnership, Fortune 500 delivery (Automotive)
4. Container Management & Tracking - 30% transit time reduction (Logistics)
5. Purchase Order Automation - 60% efficiency improvement (Procurement)
6. Retail Supply Chain Platform - E-commerce integration with payment processing
7. Plus 13 more projects across insurance, pharmaceutical, financial services, and more

Company Information:
- Location: Quebec, Canada (serving global markets)
- Founded: 2023 (founder's experience: 24+ years)
- Contact: +1-438-738-3887, service@quantum-gaze.com
- Website: https://quantum-gaze.ca
- Portfolio: https://quantum-gaze.ca/portfolio.html

Core Services:
1. AI-Powered EDI Translation - Neural networks for X12, EDIFACT, TRADACOMS standards
2. Agentic System Implementation - Autonomous AI agents for workflow management
3. MuleSoft Integration - Extensive expertise, enterprise-grade solutions
4. Python API Integration - Enterprise SDKs and RESTful APIs
5. n8n & Logic Apps - Visual workflow automation, no-code/low-code solutions
6. Legacy System Modernization - Transform old systems to modern platforms
7. Database Engineering - SQL Server, Oracle PL/SQL expertise
8. Multilingual Development - Software in English/French/German

Technology Stack:
- EDI Standards: X12 (Certified), EDIFACT, TRADACOMS, AS2, SFTP
- Programming: Python, Java, .NET, Node.js, C++
- Integration: MuleSoft, Azure Logic Apps, n8n, BizTalk, IBM Sterling, SAP PI/PO
- Databases: MS SQL Server, Oracle PL/SQL, MySQL, NoSQL
- Infrastructure: Kubernetes, Docker, Azure, AWS
- Modern & Legacy: Seamless bridging of old and new systems

Industries Served (7+):
- Retail & E-Commerce (Amazon, Walmart integration)
- Logistics & Transportation (shipment tracking, CargoWise, Oracle TMS, SAP TM, Blue Yonder, Manhattan WMS, international freight)
- Healthcare & Pharma (HIPAA-compliant, claims processing, Byk Gulden)
- Manufacturing & Distribution (supply chain, JIT inventory)
- Automotive & Aerospace (BMW, OEM integration, AIAG standards)
- Financial Services (ISO 20022, SWIFT, ACH)
- Insurance (ICIS system, comprehensive management platforms)

Key Differentiators:
- 24+ years proven track record
- 19+ successfully delivered major projects
- Long-term partnerships with Fortune 500 companies
- Fortune 500 experience (BMW) and multi-billion dollar logistics companies
- 99.9% uptime guarantee
- Enterprise-grade reliability
- Infinite scalability (100 to 10M transactions/day)
- SOC 2 Type II, HIPAA, PCI DSS certified
- 60% average cost reduction
- 85% faster processing
- 24/7/365 managed services available

Communication Style:
- Highlight specific project successes and quantifiable results when relevant
- Reference Fortune 500 clients and long-term partnerships to establish credibility
- Use concrete examples from our 19+ project portfolio
- Be helpful, professional, and concise
- Use bullet points for clarity when listing features
- If pricing or specific technical details not available, suggest: "Contact our team at service@quantum-gaze.com or +1-438-738-3887 for detailed information"
- Direct users to portfolio page for more project examples: quantum-gaze.ca/portfolio.html
- Be enthusiastic about our proven track record and real-world results

Important:
- Emphasize 24+ years of real experience, not just 2023 founding date
- Reference Fortune 500 clients (BMW, Byk Gulden) and multi-billion dollar freight forwarding/customs brokerage companies
- Mention quantifiable results (85% faster, 70% delay reduction, 60% cost savings)
- If asked about competitors, focus on our unique strengths without disparaging others
- For technical questions, provide helpful overview but suggest technical consultation
- Always end with a call-to-action (contact, demo request, view portfolio)
- Keep responses under 200 words unless detailed explanation is needed`
        };

        // Build conversation messages
        const messages = [systemMessage];

        // Add conversation history (last 10 messages)
        const recentHistory = conversationHistory.slice(-10);
        messages.push(...recentHistory);

        // Add current user message
        messages.push({
            role: 'user',
            content: message
        });

        // Call Cloudflare Workers AI with Llama model
        const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
            messages: messages,
            temperature: 0.7,
            max_tokens: 500
        });

        const aiReply = aiResponse.response || aiResponse.result?.response || "I apologize, but I'm having trouble generating a response. Please try again.";

        // Generate smart suggestions based on conversation
        const suggestions = generateSuggestions(message, aiReply);

        return new Response(JSON.stringify({
            reply: aiReply,
            suggestions: suggestions,
            timestamp: new Date().toISOString()
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders
            }
        });

    } catch (error) {
        console.error('Chat API error:', error);

        return new Response(JSON.stringify({
            reply: "I apologize, but I'm experiencing technical difficulties. Please contact us directly:\n\n📧 Email: service@quantum-gaze.com\n📞 Phone: +1-438-738-3887\n\nOur team will be happy to help!",
            error: error.message,
            timestamp: new Date().toISOString()
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders
            }
        });
    }
}

/**
 * Generate contextual suggestions for follow-up questions
 */
function generateSuggestions(userMessage, aiReply) {
    const lowerMessage = userMessage.toLowerCase();
    const lowerReply = aiReply.toLowerCase();

    // Service-related suggestions
    if (lowerMessage.includes('service') || lowerMessage.includes('what do you do')) {
        return [
            'Tell me about AI-powered EDI',
            'What industries do you serve?',
            'How do I get started?'
        ];
    }

    // EDI-related suggestions
    if (lowerMessage.includes('edi') || lowerReply.includes('edi')) {
        return [
            'What EDI standards do you support?',
            'How does AI improve EDI?',
            'Request a demo'
        ];
    }

    // Pricing-related suggestions
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
        return [
            'What services do you offer?',
            'Tell me about ROI benefits',
            'Schedule a consultation'
        ];
    }

    // Technical questions
    if (lowerMessage.includes('how') || lowerMessage.includes('technical')) {
        return [
            'What technologies do you use?',
            'Integration capabilities?',
            'Request technical documentation'
        ];
    }

    // Default suggestions
    return [
        'Learn about our services',
        'Which industries do you serve?',
        'How can I contact your team?'
    ];
}
