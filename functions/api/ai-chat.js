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
            content: `You are an AI assistant for Quantum Gaze Software Inc., a leading software development company.

Company Information:
- Specialization: AI-Powered EDI Integration, Agentic Systems, Legacy Modernization
- Location: Quebec, Canada (serving global markets)
- Founded: 2023
- Experience: 35+ years in software engineering
- Contact: +1-438-738-3887, service@quantum-gaze.com
- Website: https://quantum-gaze.ca

Core Services:
1. AI-Powered EDI Translation - Neural networks for X12, EDIFACT, TRADACOMS standards
2. Agentic System Implementation - Autonomous AI agents for workflow management
3. Python API Integration - Enterprise SDKs and RESTful APIs
4. n8n Workflow Automation - No-code visual workflow builder
5. Legacy System Modernization - Transform old systems to modern platforms
6. Multilingual Solutions - Software in EN/FR/DE with documentation

Technology Stack:
- EDI Standards: X12, EDIFACT, TRADACOMS, AS2, SFTP
- Programming: Python, Java, .NET, Node.js
- Workflow Automation: n8n, Logic Apps, MuleSoft
- Enterprise Integration: IBM Sterling, SAP PI/PO
- Infrastructure: Kubernetes, Docker, Azure, AWS
- Modern & Legacy: Seamless integration of old and new systems

Industries Served:
- Retail & E-Commerce (Amazon, Walmart integration)
- Logistics & Transportation (shipment tracking, TMS/WMS)
- Healthcare & Pharma (HIPAA-compliant, claims processing)
- Manufacturing & Distribution (supply chain, JIT inventory)
- Automotive & Aerospace (OEM integration, AIAG standards)
- Financial Services (ISO 20022, SWIFT, ACH)

Key Differentiators:
- 99.9% uptime guarantee
- Enterprise-grade reliability
- Infinite scalability (100 to 10M transactions/day)
- SOC 2 Type II, HIPAA, PCI DSS certified
- 60% cost reduction, 85% faster processing
- 24/7/365 managed services available

Communication Style:
- Be helpful, professional, and concise
- Use bullet points for clarity when listing features
- Always provide value - don't just repeat website content
- If pricing or specific technical details not available, suggest: "Contact our team at service@quantum-gaze.com or +1-438-738-3887 for detailed information"
- Guide users toward contact form or phone call for custom quotes
- Be enthusiastic about our AI/ML capabilities and modern tech stack

Important:
- If asked about competitors, focus on our unique strengths without disparaging others
- For technical questions, provide helpful overview but suggest technical consultation
- Always end with a call-to-action when appropriate (contact, demo request, etc.)
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
