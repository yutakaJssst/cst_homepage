import CONFIG from './config.js';
console.log("Chatbot module loaded");

class Chatbot {
    constructor() {
        console.log("Chatbot constructor called");
        this.container = null;
        this.messages = [];
        this.isOpen = false;
        this.init();
        console.log("Chatbot instance created");
    }

    init() {
        // Create chatbot HTML structure
        this.createChatbotHTML();
        
        // Add event listeners
        this.addEventListeners();
        
        // Initial greeting
        this.addMessage('bot', 'こんにちは！日本大学理工学部についての質問にお答えします。どのようなことでお困りですか？');
    }

    createChatbotHTML() {
        // Create toggle button
        const toggle = document.createElement('div');
        toggle.className = 'chatbot-toggle';
        toggle.innerHTML = '<i class="fas fa-comments"></i>';
        document.body.appendChild(toggle);
        console.log("Chatbot toggle appended");

        // Create chatbot container
        const container = document.createElement('div');
        container.className = 'chatbot-container';
        container.innerHTML = `
            <div class="chatbot-header">
                <div class="chatbot-title">CST チャットアシスタント</div>
                <div class="chatbot-close"><i class="fas fa-times"></i></div>
            </div>
            <div class="chatbot-messages"></div>
            <div class="chatbot-input">
                <form>
                    <input type="text" placeholder="質問を入力してください..." required>
                    <button type="submit"><i class="fas fa-paper-plane"></i></button>
                </form>
            </div>
        `;
        document.body.appendChild(container);
        console.log("Chatbot container appended");
        this.container = container;
    }

    addEventListeners() {
        // Toggle chatbot
        const toggle = document.querySelector('.chatbot-toggle');
        toggle.addEventListener('click', () => {
            console.log("Chatbot toggle clicked");
            this.toggleChatbot();
        });
        
        // Close chatbot
        const close = this.container.querySelector('.chatbot-close');
        close.addEventListener('click', () => {
            console.log("Chatbot close clicked");
            this.toggleChatbot();
        });

        // Submit form
        const form = this.container.querySelector('form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = form.querySelector('input');
            const message = input.value.trim();
            if (message) {
                this.handleUserMessage(message);
                input.value = '';
            }
        });
    }

    toggleChatbot() {
        this.isOpen = !this.isOpen;
        this.container.style.display = this.isOpen ? 'block' : 'none';
        const toggle = document.querySelector('.chatbot-toggle');
        toggle.style.display = this.isOpen ? 'none' : 'flex';
    }

    addMessage(type, content) {
        const messagesContainer = this.container.querySelector('.chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.innerHTML = `<div class="message-content">${content}</div>`;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        this.messages.push({ type, content });
    }

    async handleUserMessage(message) {
        // Add user message to chat
        this.addMessage('user', message);

        try {
            // Show loading indicator
            const loadingMessage = 'お返事を考えています...';
            this.addMessage('bot', loadingMessage);

            // Prepare conversation history
            const conversationHistory = this.messages
                .slice(-5) // Get last 5 messages for context
                .map(msg => ({
                    role: msg.type === 'user' ? 'user' : 'assistant',
                    content: msg.content
                }));

            // Add system message for context
            conversationHistory.unshift({
                role: 'system',
                content: 'このチャットアシスタントは、CSTホームページに掲載されている情報に基づいて質問に回答します。ホームページに記載された内容（入学案内、学部詳細、カリキュラム、キャンパスライフ等）を参照します。'
            });

            let botResponse;
            
            try {
                // Call ChatGPT API
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${CONFIG.OPENAI_API_KEY}`
                    },
                    body: JSON.stringify({
                        model: CONFIG.MODEL,
                        messages: conversationHistory,
                        max_tokens: CONFIG.MAX_TOKENS,
                        temperature: CONFIG.TEMPERATURE
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('API Error:', errorData);
                    throw new Error(errorData.error?.message || 'API request failed');
                }

                const data = await response.json();
                botResponse = data.choices[0].message.content;
            } catch (error) {
                console.error('Error details:', error);
                
                // Provide a more helpful response based on the error
                if (error.message.includes('API key')) {
                    botResponse = '申し訳ありませんが、APIキーに問題があるようです。管理者にお問い合わせください。';
                } else if (error.message.includes('CORS')) {
                    botResponse = 'CORSエラーが発生しました。サーバー側の設定を確認してください。';
                } else {
                    botResponse = `すみません、エラーが発生しました：${error.message}`;
                }
            }

            // Remove loading message
            const messagesContainer = this.container.querySelector('.chatbot-messages');
            messagesContainer.removeChild(messagesContainer.lastChild);

            // Add bot response
            this.addMessage('bot', botResponse);

        } catch (error) {
            console.error('Error:', error);
            // Remove loading message
            const messagesContainer = this.container.querySelector('.chatbot-messages');
            messagesContainer.removeChild(messagesContainer.lastChild);
            // Add error message
            this.addMessage('bot', 'すみません、エラーが発生しました。しばらく経ってからもう一度お試しください。');
        }
    }
}

if(document.readyState === "loading"){
    document.addEventListener('DOMContentLoaded', () => { new Chatbot(); });
} else {
    new Chatbot();
}