// OpenAI API Proxy for CORS issues
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
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
    const requestBody = JSON.parse(event.body);
    
    // Get the API key from the request headers or environment variable
    let apiKey = null;
    
    // First try to get from Authorization header
    if (event.headers.authorization) {
      apiKey = event.headers.authorization.replace('Bearer ', '');
    }
    
    // If not in header, try lowercase version (Netlify might normalize headers)
    if (!apiKey && event.headers['authorization']) {
      apiKey = event.headers['authorization'].replace('Bearer ', '');
    }
    
    // If still not found, use environment variable
    if (!apiKey) {
      apiKey = process.env.OPENAI_API_KEY;
    }
    
    if (!apiKey) {
      console.error('No API key found in headers or environment variables');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'API key is required' }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
    }

    console.log('Forwarding request to OpenAI API');
    
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
      body: JSON.stringify(requestBody)
    });
    
    // Race the fetch against the timeout
    const response = await Promise.race([fetchPromise, timeoutPromise]);

    // Get the response data
    const data = await response.json();
    
    console.log(`OpenAI API response status: ${response.status}`);
    
    // Return the response with CORS headers
    return {
      statusCode: response.status,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Cache-Control': 'no-cache'
      }
    };
  } catch (error) {
    console.error('Proxy error:', error);
    
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
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Cache-Control': 'no-cache'
      }
    };
  }
};