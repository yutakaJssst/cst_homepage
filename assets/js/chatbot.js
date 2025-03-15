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
        const hostname = window.location.hostname;
        const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
        const isGitHubPages = hostname.includes('github.io');
        const isNetlify = hostname.includes('netlify.app');
        const userMessageLower = message.toLowerCase();

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
                console.log('Attempting to call OpenAI API with key:', CONFIG.OPENAI_API_KEY ? 'Key exists' : 'No key found');
                
                // Always use static responses for GitHub Pages or Netlify (if needed)
                // For GitHub Pages, always use static responses
                // For Netlify, only use static responses if there's a CORS error
                if (isGitHubPages) {
                    console.log('Running on GitHub Pages, using static response');
                    
                    // Different responses based on the question
                    if (userMessageLower.includes('学科') || userMessageLower.includes('専攻') || userMessageLower.includes('コース')) {
                        botResponse = '日本大学理工学部には、以下の学科があります：\n\n' +
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
                        botResponse = '日本大学理工学部は、以下の2つのキャンパスがあります：\n\n' +
                            '1. 駿河台キャンパス\n' +
                            '〒101-8308 東京都千代田区神田駿河台1-8-14\n' +
                            'JR中央線・総武線「御茶ノ水」駅下車 徒歩3分\n\n' +
                            '2. 船橋キャンパス\n' +
                            '〒274-8501 千葉県船橋市習志野台7-24-1\n' +
                            'JR総武線「津田沼」駅下車 徒歩20分またはバス5分';
                    } else {
                        botResponse = 'こんにちは！日本大学理工学部についてのご質問にお答えします。\n\n' +
                            '学科、キャンパス、入試情報などについてお気軽にお尋ねください。\n\n' +
                            '※注意: GitHub Pages環境では、APIキーの制限により事前に用意された回答のみ表示されます。完全な機能を利用するには、Netlifyでのデプロイをご検討ください。';
                    }
                    
                    // Skip the API call and return the static response directly
                    // Remove loading message
                    const messagesContainer = this.container.querySelector('.chatbot-messages');
                    messagesContainer.removeChild(messagesContainer.lastChild);
                    
                    // Add bot response
                    this.addMessage('bot', botResponse);
                    
                    // Return early to avoid API call
                    return;
                }
                
                // Check if API key is valid for non-GitHub Pages environments
                if (!CONFIG.OPENAI_API_KEY || CONFIG.OPENAI_API_KEY === 'API_KEY') {
                    console.warn('Invalid API key. Using fallback response.');
                    botResponse = '申し訳ありませんが、APIキーが設定されていないため、質問にお答えできません。管理者にお問い合わせください。';
                    throw new Error('Invalid API key');
                }
                
                // For specific questions in non-GitHub Pages environments
                if (userMessageLower.includes('学科') || userMessageLower.includes('専攻') || userMessageLower.includes('コース')) {
                    console.log('Using static response for department question');
                    botResponse = '日本大学理工学部には、以下の学科があります：\n\n' +
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
                        'それぞれの学科では、専門的な知識や技術を学び、将来の社会で活躍できる技術者や研究者を育成しています。\n\n' +
                        '※注意: GitHub Pages環境ではAPIキーの制限により、事前に用意された回答のみ表示されます。完全な機能を利用するには、Netlifyでのデプロイをご検討ください。';
                    throw new Error('Using static response');
                }
                
                // Always use static responses for Netlify until we fix the API issues
                if (isNetlify && userMessageLower.includes('学科')) {
                    console.log('Running on Netlify, using static response for department question');
                    botResponse = '日本大学理工学部には、以下の学科があります：\n\n' +
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
                    
                    // Skip the API call and return the static response directly
                    // Remove loading message
                    const messagesContainer = this.container.querySelector('.chatbot-messages');
                    messagesContainer.removeChild(messagesContainer.lastChild);
                    
                    // Add bot response
                    this.addMessage('bot', botResponse);
                    
                    // Return early to avoid API call
                    return;
                }
                let apiUrl;
                if (isLocalhost) {
                    apiUrl = 'https://api.openai.com/v1/chat/completions';
                } else if (isGitHubPages) {
                    apiUrl = 'https://yutatest.netlify.app/.netlify/functions/openai-proxy';
                } else {
                    apiUrl = window.location.origin + '/.netlify/functions/openai-proxy';
                }
                console.log('Using API URL:', apiUrl);
                
                // Call ChatGPT API (directly or via proxy)
                const response = await fetch(apiUrl, {
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

                console.log('API Response status:', response.status);
                const contentType = response.headers.get('content-type');
                let parsedData;
                if (contentType && contentType.includes('application/json')) {
                    parsedData = await response.json();
                } else {
                    const errorText = await response.text();
                    throw new Error(`Expected JSON but received: ${errorText}`);
                }
                
                if (!response.ok) {
                    console.error('API Error details:', parsedData);
                    throw new Error(parsedData.error?.message || `API request failed with status ${response.status}`);
                }
                
                console.log('API Response received successfully');
                botResponse = parsedData.choices[0].message.content;
            } catch (error) {
                console.error('Error type:', error.name);
                console.error('Error message:', error.message);
                console.error('Full error:', error);
                
                // Provide a more helpful response based on the error
                if (error.message.includes('API key')) {
                    botResponse = '申し訳ありませんが、APIキーに問題があるようです。管理者にお問い合わせください。';
                } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                    botResponse = 'ネットワークエラーが発生しました。CORSポリシーによりAPIへのアクセスがブロックされている可能性があります。';
                } else if (error.message.includes('CORS') || error.message.includes('Unexpected token')) {
                    // If on Netlify, provide a more specific error message
                    if (window.location.hostname.includes('netlify.app')) {
                        botResponse = 'CORSエラーが発生しました。Netlify環境では、APIへのアクセスに問題が発生しています。以下の学科情報をご参考ください：\n\n' +
                            '日本大学理工学部には、以下の学科があります：\n\n' +
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
                    } else {
                        botResponse = 'CORSエラーが発生しました。GitHub Pages環境では、APIへの直接アクセスができないため、事前に用意された回答のみ表示されます。';
                    }
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