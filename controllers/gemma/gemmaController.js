const gemma = require('../../gemma');
const { GoogleGenAI } = require('@google/genai');
const axios = require('axios');
const { decisionPrompt, extractPrompt, finalPrompt } = require('./prompts.js'); // Import prompts

class GemmaController {
    constructor() {
        this.ai = new GoogleGenAI({ apiKey: gemma });
    }

    // Check if Wikipedia should be used
    shouldUseWikipedia = async (message) => {
        try {
            const response = await this.ai.models.generateContent({
                model: 'gemma-3-27b-it',
                contents: decisionPrompt(message), // Use the prompt function
            });

            const decision = response.text.trim().toUpperCase();
            return decision.includes('YES');
        } catch (error) {
            console.error('Error in shouldUseWikipedia:', error);
            return false;
        }
    }

    // Search Wikipedia API
    searchWikipedia = async (query) => {
        try {
            // Search for articles
            const searchResponse = await axios.get('https://en.wikipedia.org/w/api.php', {
                params: {
                    action: 'query',
                    format: 'json',
                    list: 'search',
                    srsearch: query,
                    srlimit: 1,
                    origin: '*'
                }
            });

            const searchResults = searchResponse.data.query.search;
            if (searchResults.length === 0) {
                return null;
            }

            // Get summary of first result
            const title = searchResults[0].title;
            const summaryResponse = await axios.get('https://en.wikipedia.org/w/api.php', {
                params: {
                    action: 'query',
                    format: 'json',
                    prop: 'extracts',
                    exintro: true,
                    explaintext: true,
                    titles: title,
                    origin: '*'
                }
            });

            const pages = summaryResponse.data.query.pages;
            const pageId = Object.keys(pages)[0];
            const extract = pages[pageId].extract;

            return {
                title,
                summary: extract,
                url: `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`
            };
        } catch (error) {
            console.error('Wikipedia API error:', error);
            return null;
        }
    }

    // Extract search query from message
    extractSearchQuery = async (message) => {
        try {
            const response = await this.ai.models.generateContent({
                model: 'gemma-3-27b-it',
                contents: extractPrompt(message), // Use the prompt function
            });

            return response.text.trim();
        } catch (error) {
            console.error('Error extracting query:', error);
            return message;
        }
    }

    setChat = async (req, res) => {
        try {
            const { message } = req.body;
            const files = req.files || [];

            if (!message && files.length === 0) {
                return res.status(400).json({ error: 'Message or images are required' });
            }

            let prompt = `Please keep the answer short and concise.\n${message}`;
            let useWikipedia = false;
            let wikipediaData = null;

            // Check if Wikipedia should be used (only if message exists and no images)
            if (message && files.length === 0) {
                useWikipedia = await this.shouldUseWikipedia(message);
                
                if (useWikipedia) {
                    // Extract search query
                    const searchQuery = await this.extractSearchQuery(message);

                    // Search Wikipedia
                    wikipediaData = await this.searchWikipedia(searchQuery);

                    if (wikipediaData) {
                        // Use the finalPrompt function
                        prompt = finalPrompt(message, wikipediaData.title, wikipediaData.summary);
                    } else {
                        prompt = `Please keep the answer short and concise. User query: ${message} Note: No Wikipedia results were found for this query. Answer based on your general knowledge:`;
                    }
                }
            }

            // Process images if present
            const contents = [];
            
            // Add text to contents
            if (message) {
                contents.push({
                    role: 'user',
                    parts: [{ text: prompt }]
                });
            }

            // Add images to contents
            for (const file of files) {
                try {
                    const base64Image = file.buffer.toString('base64');
                    
                    // Determine MIME type
                    const mimeType = file.mimetype || 'image/jpeg';

                    contents.push({
                        role: 'user',
                        parts: [
                            {
                                inlineData: {
                                    mimeType: mimeType,
                                    data: base64Image
                                }
                            }
                        ]
                    });
                } catch (error) {
                    console.error('Error processing image:', error);
                }
            }

            // Generate response
            const response = await this.ai.models.generateContent({
                model: 'gemma-3-27b-it',
                contents: contents.length > 0 ? contents : prompt,
            });

            // Prepare response
            const responseData = {
                response: response.text,
                usedWikipedia: useWikipedia,
                processedImages: files.length,
            };

            if (wikipediaData) {
                responseData.wikipediaSource = {
                    title: wikipediaData.title,
                    url: wikipediaData.url
                };
            }

            res.json(responseData);
        } catch (error) {
            console.error('Error in setChat:', error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new GemmaController();