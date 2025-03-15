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
    
    // Forward the request to OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

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
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal Server Error', 
        message: error.message 
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    };
  }
};