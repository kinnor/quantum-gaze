/**
 * AI Chat API - Cloudflare Pages Function
 * Handles OpenAI API calls for the chatbot
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

        // Get OpenAI API key from environment
        const openaiApiKey = env.OPENAI_API_KEY;

        if (!openaiApiKey) {
            console.error('OpenAI API key not configured');
            return new Response(JSON.stringify({
                reply: "I apologize, but the AI service is not configured yet. Please contact us directly at service@quantum-gaze.com or call +1-438-738-3887.",
                error: 'API key not configured'
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
            content: `You are an AI assistant for Quantum Gaze Software Inc., an enterprise software engineering company led directly by its principal architect, with 24+ years of enterprise architecture leadership.

FOUNDER'S BACKGROUND:
- 24+ years of enterprise architecture leadership
- 19+ mission-critical enterprise platforms delivered, including work with BMW and Tier-1 logistics providers
- Certified X12 EDI and Azure Integration Services (AIS) specialist
- International experience: Canada, Germany, Italy, Bulgaria
- Leadership roles: IT Manager, Senior Project Manager, Team Lead
- Master's Degree in Computer Science & Technology
- Languages: Fluent in English, French, and German

TECHNICAL EXPERTISE:
- MuleSoft, C#/.NET, MS SQL Server
- X12 EDI: Certified professional
- Java, Python, Oracle PL/SQL, C++
- BizTalk Server, Azure Logic Apps, Azure Integration Services (AIS), IBM Sterling B2B
- EDI Standards: X12, EDIFACT, TRADACOMS
- Cloud: Azure, AWS, Kubernetes, Docker

DELIVERED PLATFORMS (representative examples, no metrics implied beyond what is stated here):
1. Automated Booking Confirmation System (Freight Forwarding)
2. Customs Brokerage API Integration (Global Customs)
3. BMW Enterprise Integration (Automotive)
4. Container Management & Tracking (Logistics)
5. Purchase Order Automation (Procurement)
6. Retail Supply Chain Platform - E-commerce integration with payment processing
7. Additional projects across insurance, pharmaceutical, and financial services

Company Information:
- Location: Montreal, Quebec, Canada (serving global markets)
- Registration: NEQ 1179525945
- Founded: 2023 (founder's experience: 24+ years)
- Contact: +1-438-738-3887, service@quantum-gaze.com
- Website: https://quantum-gaze.ca
- Portfolio: https://quantum-gaze.ca/portfolio.html

Core Services:
1. AI-Assisted EDI Translation - Automated parsing and transformation for X12, EDIFACT, TRADACOMS standards
2. AI-Assisted Workflow Automation - Workflow management support
3. MuleSoft Integration - Enterprise-grade integration solutions
4. Python API Integration - Enterprise SDKs and RESTful APIs
5. n8n & Azure Logic Apps - Visual workflow automation, no-code/low-code solutions
6. Legacy System Modernization - Transform old systems to modern platforms
7. Database Engineering - SQL Server, Oracle PL/SQL expertise
8. Multilingual Development - Software in English/French/German

Technology Stack:
- EDI Standards: X12 (Certified), EDIFACT, TRADACOMS, AS2, SFTP
- Programming: Python, Java, .NET, Node.js, C++
- Integration: MuleSoft, Azure Logic Apps, Azure Integration Services (AIS), n8n, BizTalk, IBM Sterling, SAP PI/PO
- Databases: MS SQL Server, Oracle PL/SQL, MySQL, NoSQL
- Infrastructure: Kubernetes, Docker, Azure, AWS
- Modern & Legacy: Bridging old and new systems

Industries Served:
- Retail & E-Commerce (Amazon, Walmart integration)
- Logistics & Transportation (shipment tracking, CargoWise, Oracle TMS, SAP TM, Blue Yonder, Manhattan WMS, international freight)
- Healthcare & Pharma (claims processing)
- Manufacturing & Distribution (supply chain, JIT inventory)
- Automotive & Aerospace (BMW, OEM integration, AIAG standards)
- Financial Services (ISO 20022, SWIFT, ACH)
- Insurance (ICIS system, management platforms)

Key Differentiators:
- 24+ years of enterprise architecture leadership
- 19+ mission-critical enterprise platforms delivered (BMW, Tier-1 logistics)
- Certified X12 EDI & Azure Integration Services (AIS) specialists
- Direct principal-led delivery (zero agency layers)
- Montreal HQ, NEQ 1179525945, Bill 96 French-standard compliant

Communication Style:
- Highlight our direct delivery model and enterprise architecture background when relevant
- Reference the specific delivered platforms named in this context (BMW, Tier-1 logistics) to establish credibility
- Be helpful, professional, and concise
- Use bullet points for clarity when listing features
- If pricing or specific technical details not available, suggest: "Contact our team at service@quantum-gaze.com or +1-438-738-3887 for detailed information"
- Direct users to portfolio page for more project examples: quantum-gaze.ca/portfolio.html
- Never quote statistics, percentages, certifications, uptime figures, or client names that do not appear in this context

Important:
- Emphasize 24+ years of real experience, not just 2023 founding date
- Reference only the verified engagements named in this context (BMW, Tier-1 logistics); do not invent additional client names
- Do not state or imply uptime guarantees, compliance certifications, or performance percentages unless they appear in this context
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

        // Call OpenAI API
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiApiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo', // Use gpt-3.5-turbo (faster, cheaper, works with all API keys)
                                        // Switch to 'gpt-4' once you have access ($1+ API usage)
                messages: messages,
                temperature: 0.7,
                max_tokens: 500,
                presence_penalty: 0.6,
                frequency_penalty: 0.3
            })
        });

        if (!openaiResponse.ok) {
            const errorData = await openaiResponse.json();
            console.error('OpenAI API error:', errorData);
            throw new Error(`OpenAI API error: ${openaiResponse.status}`);
        }

        const data = await openaiResponse.json();
        const aiReply = data.choices[0].message.content;

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
