// ============================================
// CLOUDFLARE WORKER - Gemini API Proxy
// Proxy để bảo vệ API key khỏi client
// ============================================

export default {
    async fetch(request, env) {
        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
            });
        }

        // Verify origin (có thể thêm domain của bạn sau khi deploy)
        const origin = request.headers.get('Origin');
        const allowedOrigins = [
            'https://quan32thetruoc.pages.dev',
            'http://localhost:8000',
            'http://localhost:3000',
            'http://localhost:8080',
            'http://127.0.0.1:5500',
            'http://127.0.0.1:8000'
        ];

        // Allow all origins for development, restrict in production
        const corsOrigin = allowedOrigins.includes(origin) ? origin : '*';

        // Only allow POST requests
        if (request.method !== 'POST') {
            return new Response('Method not allowed', {
                status: 405,
                headers: {
                    'Access-Control-Allow-Origin': corsOrigin,
                },
            });
        }

        try {
            // Get message from request
            const body = await request.json();
            const { message, userId } = body;

            if (!message) {
                return new Response(JSON.stringify({ error: 'Message is required' }), {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': corsOrigin,
                    },
                });
            }

            // Get API key from environment
            const apiKey = env.GEMINI_API_KEY;
            if (!apiKey) {
                return new Response(JSON.stringify({ error: 'API key not configured' }), {
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': corsOrigin,
                    },
                });
            }

            // Call Gemini API
            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;
            
            const geminiResponse = await fetch(geminiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: message }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    }
                }),
            });

            if (!geminiResponse.ok) {
                const errorText = await geminiResponse.text();
                console.error('Gemini API error:', errorText);
                return new Response(JSON.stringify({ error: 'Failed to get response from Gemini' }), {
                    status: geminiResponse.status,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': corsOrigin,
                    },
                });
            }

            const data = await geminiResponse.json();

            // Return response
            return new Response(JSON.stringify(data), {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': corsOrigin,
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
            });

        } catch (error) {
            console.error('Worker error:', error);
            return new Response(JSON.stringify({ error: 'Internal server error' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': corsOrigin,
                },
            });
        }
    },
};

