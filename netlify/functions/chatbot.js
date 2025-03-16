const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  console.log('Chatbot function called with method:', event.httpMethod);
  
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204, // No content
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Max-Age': '86400' // 24 hours
      }
    };
  }
  
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    console.log('Method not allowed:', event.httpMethod);
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
      headers: {
        'Allow': 'POST, OPTIONS',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  }

  try {
    // Parse the request body
    console.log('Parsing request body');
    const body = JSON.parse(event.body);
    const messages = body.messages;
    
    // Validate messages
    if (!messages || !Array.isArray(messages)) {
      console.error('Invalid request: messages is not an array');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid request: messages must be an array' }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
    }

    console.log('Request contains', messages.length, 'messages');
    
    // Get API key from environment variable
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error('Missing OpenAI API key in environment variables');
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Server configuration error',
          message: 'API key is not configured'
        }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
    }

    // Configure model and parameters
    const model = process.env.MODEL || 'gpt-3.5-turbo';
    const max_tokens = process.env.MAX_TOKENS ? parseInt(process.env.MAX_TOKENS) : 150;
    const temperature = process.env.TEMPERATURE ? parseFloat(process.env.TEMPERATURE) : 0.7;

    console.log(`Calling OpenAI API with model: ${model}, max_tokens: ${max_tokens}, temperature: ${temperature}`);
    
    // Call OpenAI API with timeout
    console.log('Sending request to OpenAI API');
    
    // Create a promise that rejects in 10 seconds
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out')), 10000);
    });
    
    // Create the fetch promise
    const fetchPromise = fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        max_tokens: max_tokens,
        temperature: temperature
      })
    });
    
    // Race the fetch against the timeout
    const response = await Promise.race([fetchPromise, timeoutPromise]);

    console.log('OpenAI API response status:', response.status);
    
    // Handle API response
    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenAI API error:', data);
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: 'Error from OpenAI API',
          message: data.error?.message || 'Unknown error'
        }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
    }

    console.log('OpenAI API response successful');
    
    // Return successful response
    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache'
      }
    };
  } catch (error) {
    console.error('Serverless function error:', error);
    
    // Create a fallback response with static content
    const fallbackResponse = {
      id: 'fallback-response',
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: 'fallback-model',
      choices: [
        {
          message: {
            role: 'assistant',
            content: '申し訳ありませんが、現在APIサーバーに接続できません。日本大学理工学部には、土木工学科、交通システム工学科、建築学科、海洋建築工学科、まちづくり工学科、機械工学科、精密機械工学科、航空宇宙工学科、電気工学科、電子工学科、応用情報工学科、物質応用化学科、物理学科、数学科の14学科があります。詳細については、各学科のページをご覧ください。'
          },
          finish_reason: 'stop',
          index: 0
        }
      ],
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0
      }
    };
    
    return {
      statusCode: 200, // Return 200 even though there was an error
      body: JSON.stringify(fallbackResponse),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache'
      }
    };
  }
};