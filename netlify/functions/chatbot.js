const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  console.log('Chatbot function called with method:', event.httpMethod);
  
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    console.log('Method not allowed:', event.httpMethod);
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
      headers: {
        'Allow': 'POST',
        'Content-Type': 'application/json'
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
        headers: { 'Content-Type': 'application/json' }
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
        headers: { 'Content-Type': 'application/json' }
      };
    }

    // Configure model and parameters
    const model = process.env.MODEL || 'gpt-3.5-turbo';
    const max_tokens = process.env.MAX_TOKENS ? parseInt(process.env.MAX_TOKENS) : 150;
    const temperature = process.env.TEMPERATURE ? parseFloat(process.env.TEMPERATURE) : 0.7;

    console.log(`Calling OpenAI API with model: ${model}, max_tokens: ${max_tokens}, temperature: ${temperature}`);
    
    // Call OpenAI API
    console.log('Sending request to OpenAI API');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
        headers: { 'Content-Type': 'application/json' }
      };
    }

    console.log('OpenAI API response successful');
    
    // Return successful response
    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    };
  } catch (error) {
    console.error('Serverless function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal Server Error', 
        message: error.message 
      }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
};