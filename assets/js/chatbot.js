// Chatbot implementation for CST Homepage
console.log("Chatbot module loaded");

class Chatbot {
    constructor() {
        console.log("Chatbot constructor called");
        this.container = null;
        this.messages = [];
        this.isOpen = false;
        this.isWaitingForResponse = false;
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
            if (message && !this.isWaitingForResponse) {
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

    // Add a loading indicator
    addLoadingIndicator() {
        const messagesContainer = this.container.querySelector('.chatbot-messages');
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message message-bot message-loading';
        loadingDiv.innerHTML = `
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        messagesContainer.appendChild(loadingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return loadingDiv;
    }

    // Remove the loading indicator
    removeLoadingIndicator() {
        const messagesContainer = this.container.querySelector('.chatbot-messages');
        const loadingIndicator = messagesContainer.querySelector('.message-loading');
        if (loadingIndicator) {
            messagesContainer.removeChild(loadingIndicator);
        }
    }

    // Get static response based on user query
    getStaticResponse(userMessageLower) {
        if (userMessageLower.includes('学科') || userMessageLower.includes('専攻') || userMessageLower.includes('コース')) {
            return '日本大学理工学部には、以下の学科があります：\n\n' +
                '1. 土木工学科\n' +
                '2. 交通システム工学科\n' +
                '3. 建築学科\n' +
                '4. 海洋建築工学科\n' +
                '5. まちづくり工学科\n' +
                '6. 機械工学科\n' +
                '7. 精密機械工学科\n' +
                '8. 航空宇宙工学科\n' +
                '9. 電気工学科\n' +
                '10. 電子工学科\n' +
                '11. 応用情報工学科\n' +
                '12. 物質応用化学科\n' +
                '13. 物理学科\n' +
                '14. 数学科\n\n' +
                'それぞれの学科では、専門的な知識や技術を学び、将来の社会で活躍できる技術者や研究者を育成しています。';
        } else if (userMessageLower.includes('キャンパス') || userMessageLower.includes('場所') || userMessageLower.includes('住所')) {
            return '日本大学理工学部は、以下の2つのキャンパスがあります：\n\n' +
                '1. 駿河台キャンパス\n' +
                '〒101-8308 東京都千代田区神田駿河台1-8-14\n' +
                'JR中央線・総武線「御茶ノ水」駅下車 徒歩3分\n\n' +
                '2. 船橋キャンパス\n' +
                '〒274-8501 千葉県船橋市習志野台7-24-1\n' +
                'JR総武線「津田沼」駅下車 徒歩20分またはバス5分';
        } else if (userMessageLower.includes('入試') || userMessageLower.includes('受験') || userMessageLower.includes('入学')) {
            return '日本大学理工学部の入試情報については、以下の種類があります：\n\n' +
                '1. 一般選抜\n' +
                '2. 学校推薦型選抜\n' +
                '3. 総合型選抜\n' +
                '4. 外国人留学生入試\n' +
                '5. 編入学試験\n\n' +
                '詳細な日程や試験科目については、公式ウェブサイトの入試情報ページをご確認ください。';
        } else if (userMessageLower.includes('奨学金') || userMessageLower.includes('費用') || userMessageLower.includes('学費')) {
            return '日本大学理工学部では、様々な奨学金制度を用意しています：\n\n' +
                '1. 日本大学独自の奨学金\n' +
                '2. 日本学生支援機構奨学金\n' +
                '3. 地方公共団体奨学金\n' +
                '4. 民間団体奨学金\n\n' +
                '学費については、学科や入学年度によって異なりますので、公式ウェブサイトの学費・奨学金ページをご確認ください。';
        } else {
            return null; // No static response available
        }
    }

    async handleUserMessage(message) {
        // Add user message to chat
        this.addMessage('user', message);
        
        // Prevent multiple submissions
        this.isWaitingForResponse = true;
        
        // Show loading indicator
        const loadingIndicator = this.addLoadingIndicator();
        
        const userMessageLower = message.toLowerCase();
        console.log('User message:', message);
        
        try {
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
                content: 'このチャットアシスタントは、日本大学理工学部のホームページに掲載されている情報に基づいて質問に回答します。ホームページに記載された内容（入学案内、学部詳細、カリキュラム、キャンパスライフ等）を参照します。'
            });

            console.log('Attempting API call to Netlify function');
            let botResponse;
            
            try {
                // Call the Netlify function
                console.log('Calling /.netlify/functions/chatbot');
                const response = await fetch('/.netlify/functions/chatbot', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        messages: conversationHistory
                    })
                });

                console.log('Response status:', response.status);
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('API Error:', errorText);
                    throw new Error(`API request failed with status ${response.status}: ${errorText}`);
                }

                const data = await response.json();
                console.log('API response received successfully');
                botResponse = data.choices[0].message.content;
            } catch (apiError) {
                console.error('API call failed:', apiError);
                
                // Fallback to static responses if API call fails
                const staticResponse = this.getStaticResponse(userMessageLower);
                
                if (staticResponse) {
                    console.log('Using static response as fallback');
                    botResponse = staticResponse;
                } else {
                    console.log('No static response available, using generic error message');
                    botResponse = 'すみません、現在APIサーバーに接続できません。しばらく経ってからもう一度お試しください。';
                }
            }
            
            // Remove loading indicator and add bot response
            this.removeLoadingIndicator();
            this.addMessage('bot', botResponse);
            
        } catch (error) {
            console.error('Main error handler:', error);
            
            // Remove loading indicator
            this.removeLoadingIndicator();
            
            // Determine appropriate error message
            let errorMessage;
            
            if (error.message.includes('API key')) {
                errorMessage = '申し訳ありませんが、APIキーに問題があるようです。管理者にお問い合わせください。';
                console.error('API key error detected');
            } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                errorMessage = 'ネットワークエラーが発生しました。インターネット接続を確認してください。';
                console.error('Network error detected');
            } else if (error.message.includes('CORS')) {
                errorMessage = 'CORSエラーが発生しました。サーバー設定に問題があります。管理者にお問い合わせください。';
                console.error('CORS error detected');
            } else {
                errorMessage = 'すみません、エラーが発生しました。しばらく経ってからもう一度お試しください。';
                console.error('Unknown error type');
            }
            
            // Try to get a static response as fallback
            const staticResponse = this.getStaticResponse(userMessageLower);
            
            if (staticResponse) {
                console.log('Using static response in main error handler');
                this.addMessage('bot', staticResponse);
            } else {
                console.log('No static response available, using error message');
                // Add fallback response with departments info
                const fallbackInfo = '日本大学理工学部には、土木工学科、交通システム工学科、建築学科、海洋建築工学科、まちづくり工学科、機械工学科、精密機械工学科、航空宇宙工学科、電気工学科、電子工学科、応用情報工学科、物質応用化学科、物理学科、数学科の14学科があります。';
                
                this.addMessage('bot', `${errorMessage}\n\n${fallbackInfo}`);
            }
        } finally {
            this.isWaitingForResponse = false;
        }
    }
}

// Initialize chatbot when DOM is ready
if (document.readyState === "loading") {
    document.addEventListener('DOMContentLoaded', () => { new Chatbot(); });
} else {
    new Chatbot();
}