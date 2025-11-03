/**
 * AI Chatbot powered by OpenAI
 * Next-level interactive experience
 */

class AIChat {
    constructor() {
        this.messages = [];
        this.isOpen = false;
        this.isTyping = false;

        // Company context for AI
        this.companyContext = `You are an AI assistant for Quantum Gaze Software Inc., a leading software development company specializing in:

1. AI-Powered EDI Integration - Intelligent parsing and transformation of EDI standards (X12, EDIFACT, TRADACOMS)
2. Agentic System Architecture - Autonomous AI agents that monitor, optimize, and self-heal workflows
3. Legacy System Modernization - Transforming legacy systems into modern, scalable applications
4. Multilingual Solutions - Software development in English, French, and German
5. Python API Integration - Enterprise-grade SDKs and RESTful APIs
6. n8n Workflow Automation - Visual workflow builder for no-code customization

Key Facts:
- Location: Quebec, Canada
- Founded: 2023
- Experience: 35+ years in software engineering
- Contact: +1-438-738-3887, service@quantum-gaze.com
- Website: https://quantum-gaze.ca

Industries Served:
- Retail & E-Commerce
- Logistics & Transportation
- Healthcare & Pharma
- Manufacturing & Distribution
- Automotive & Aerospace
- Financial Services

Our Mission: Empower global enterprises with intelligent EDI integration platforms that combine traditional electronic data interchange with cutting-edge AI, agentic systems, and modern automation.

Please provide helpful, accurate information about our services. Be professional, friendly, and concise. If asked about pricing or specific technical details not in this context, suggest contacting our team directly.`;

        this.init();
    }

    init() {
        this.createChatWidget();
        this.attachEventListeners();
        this.showWelcomeMessage();
    }

    createChatWidget() {
        const widget = document.createElement('div');
        widget.className = 'ai-chat-widget';
        widget.innerHTML = `
            <!-- Chat Toggle Button -->
            <button class="ai-chat-toggle" aria-label="Open AI Chat">
                <span class="ai-chat-icon">🤖</span>
                <span class="ai-chat-badge" style="display: none;">1</span>
            </button>

            <!-- Chat Window -->
            <div class="ai-chat-window">
                <!-- Header -->
                <div class="ai-chat-header">
                    <div class="ai-chat-header-info">
                        <div class="ai-chat-avatar">🤖</div>
                        <div class="ai-chat-title">
                            <h3>Quantum AI Assistant</h3>
                            <div class="ai-chat-status">
                                <span class="ai-status-dot"></span>
                                <span>Online - Powered by GPT-4</span>
                            </div>
                        </div>
                    </div>
                    <button class="ai-chat-close" aria-label="Close chat">×</button>
                </div>

                <!-- Messages -->
                <div class="ai-chat-messages" id="aiChatMessages">
                    <!-- Messages will be inserted here -->
                </div>

                <!-- Input Area -->
                <div class="ai-chat-input-area">
                    <textarea
                        class="ai-chat-input"
                        id="aiChatInput"
                        placeholder="Ask me anything about our services..."
                        rows="1"
                    ></textarea>
                    <button class="ai-chat-send" id="aiChatSend" aria-label="Send message">
                        ➤
                    </button>
                </div>

                <!-- Powered By -->
                <div class="ai-powered-by">
                    Powered by <a href="https://openai.com" target="_blank">OpenAI GPT-4</a>
                </div>
            </div>
        `;

        document.body.appendChild(widget);

        // Store references
        this.widget = widget;
        this.toggleBtn = widget.querySelector('.ai-chat-toggle');
        this.chatWindow = widget.querySelector('.ai-chat-window');
        this.messagesContainer = widget.querySelector('#aiChatMessages');
        this.input = widget.querySelector('#aiChatInput');
        this.sendBtn = widget.querySelector('#aiChatSend');
        this.closeBtn = widget.querySelector('.ai-chat-close');
        this.badge = widget.querySelector('.ai-chat-badge');
    }

    attachEventListeners() {
        // Toggle chat
        this.toggleBtn.addEventListener('click', () => this.toggleChat());
        this.closeBtn.addEventListener('click', () => this.closeChat());

        // Send message
        this.sendBtn.addEventListener('click', () => this.sendMessage());

        // Enter to send (Shift+Enter for new line)
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        this.input.addEventListener('input', () => {
            this.input.style.height = 'auto';
            this.input.style.height = Math.min(this.input.scrollHeight, 120) + 'px';
        });

        // Click outside to close
        document.addEventListener('click', (e) => {
            if (this.isOpen &&
                !this.widget.contains(e.target) &&
                !e.target.closest('.ai-chat-widget')) {
                // Don't close automatically
            }
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        this.chatWindow.classList.toggle('active');
        this.toggleBtn.classList.toggle('active');

        if (this.isOpen) {
            this.input.focus();
            this.hideBadge();
        }
    }

    closeChat() {
        this.isOpen = false;
        this.chatWindow.classList.remove('active');
        this.toggleBtn.classList.remove('active');
    }

    showWelcomeMessage() {
        const welcomeHTML = `
            <div class="ai-welcome-message">
                <div class="ai-welcome-icon">👋</div>
                <h4>Hi! I'm your AI Assistant</h4>
                <p>I can help you learn about our EDI solutions, AI services, and answer any questions about Quantum Gaze.</p>
                <div class="ai-suggestions">
                    <button class="ai-suggestion-btn" data-prompt="What services does Quantum Gaze offer?">
                        What services do you offer?
                    </button>
                    <button class="ai-suggestion-btn" data-prompt="Tell me about AI-powered EDI integration">
                        AI-powered EDI
                    </button>
                    <button class="ai-suggestion-btn" data-prompt="How can I get started with Quantum Gaze?">
                        Get started
                    </button>
                    <button class="ai-suggestion-btn" data-prompt="What industries do you serve?">
                        Industries served
                    </button>
                </div>
            </div>
        `;

        this.messagesContainer.innerHTML = welcomeHTML;

        // Attach suggestion button listeners
        this.attachSuggestionListeners();
    }

    attachSuggestionListeners() {
        const suggestionBtns = this.messagesContainer.querySelectorAll('.ai-suggestion-btn');
        suggestionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const prompt = btn.getAttribute('data-prompt');
                this.input.value = prompt;
                this.sendMessage();
            });
        });
    }

    async sendMessage() {
        const message = this.input.value.trim();
        if (!message || this.isTyping) return;

        // Add user message
        this.addMessage(message, 'user');
        this.input.value = '';
        this.input.style.height = 'auto';

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Call OpenAI API via Cloudflare Function
            const response = await fetch('/api/ai-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    conversationHistory: this.messages.slice(-10) // Last 10 messages for context
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();

            // Hide typing indicator
            this.hideTypingIndicator();

            // Add AI response
            if (data.reply) {
                this.addMessage(data.reply, 'bot');

                // Add suggestions if provided
                if (data.suggestions && data.suggestions.length > 0) {
                    this.addSuggestions(data.suggestions);
                }
            } else {
                throw new Error('No reply from AI');
            }

        } catch (error) {
            console.error('Chat error:', error);
            this.hideTypingIndicator();
            this.addMessage(
                "I apologize, but I'm having trouble connecting right now. Please try again or contact us directly at service@quantum-gaze.com or +1-438-738-3887.",
                'bot',
                true
            );
        }
    }

    addMessage(text, sender = 'bot', isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${sender}`;

        const time = new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
        });

        messageDiv.innerHTML = `
            <div class="ai-message-avatar">${sender === 'user' ? '👤' : '🤖'}</div>
            <div class="ai-message-content">
                <div class="ai-message-bubble ${isError ? 'ai-error-message' : ''}">
                    ${this.formatMessage(text)}
                </div>
                <div class="ai-message-time">${time}</div>
            </div>
        `;

        // Remove welcome message if present
        const welcomeMsg = this.messagesContainer.querySelector('.ai-welcome-message');
        if (welcomeMsg) {
            welcomeMsg.remove();
        }

        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();

        // Store in conversation history
        this.messages.push({
            role: sender === 'user' ? 'user' : 'assistant',
            content: text,
            timestamp: new Date().toISOString()
        });
    }

    formatMessage(text) {
        // Basic markdown formatting
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
            .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
            .replace(/\n/g, '<br>') // Line breaks
            .replace(/`(.*?)`/g, '<code>$1</code>'); // Inline code
    }

    addSuggestions(suggestions) {
        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.className = 'ai-suggestions';

        suggestions.forEach(suggestion => {
            const btn = document.createElement('button');
            btn.className = 'ai-suggestion-btn';
            btn.textContent = suggestion;
            btn.setAttribute('data-prompt', suggestion);
            btn.addEventListener('click', () => {
                this.input.value = suggestion;
                this.sendMessage();
            });
            suggestionsDiv.appendChild(btn);
        });

        // Add to last bot message
        const lastMessage = this.messagesContainer.querySelector('.ai-message.bot:last-child .ai-message-content');
        if (lastMessage) {
            lastMessage.appendChild(suggestionsDiv);
        }
    }

    showTypingIndicator() {
        this.isTyping = true;
        this.sendBtn.disabled = true;

        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-message bot ai-typing-message';
        typingDiv.innerHTML = `
            <div class="ai-message-avatar">🤖</div>
            <div class="ai-message-content">
                <div class="ai-typing-indicator">
                    <span class="ai-typing-dot"></span>
                    <span class="ai-typing-dot"></span>
                    <span class="ai-typing-dot"></span>
                </div>
            </div>
        `;

        this.messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.isTyping = false;
        this.sendBtn.disabled = false;

        const typingIndicator = this.messagesContainer.querySelector('.ai-typing-message');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    showBadge(count = 1) {
        this.badge.textContent = count;
        this.badge.style.display = 'flex';
    }

    hideBadge() {
        this.badge.style.display = 'none';
    }

    // Public method to trigger chat from external buttons
    openWithMessage(message) {
        if (!this.isOpen) {
            this.toggleChat();
        }
        this.input.value = message;
        this.sendMessage();
    }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit before showing to avoid overwhelming on page load
    setTimeout(() => {
        window.aiChat = new AIChat();

        // Show notification badge after 5 seconds if not opened
        setTimeout(() => {
            if (!window.aiChat.isOpen) {
                window.aiChat.showBadge();
            }
        }, 5000);
    }, 2000);
});

// Global helper function for triggering chat from anywhere
function openAIChat(message = '') {
    if (window.aiChat) {
        if (message) {
            window.aiChat.openWithMessage(message);
        } else {
            window.aiChat.toggleChat();
        }
    }
}
