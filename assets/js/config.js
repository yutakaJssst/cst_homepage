// ChatGPT API Configuration
const CONFIG = {
    OPENAI_API_KEY: process.env.API_KEY || 'YOUR_API', // Will be replaced during build
    MODEL: 'gpt-3.5-turbo',
    MAX_TOKENS: 150,
    TEMPERATURE: 0.7
};

export default CONFIG;