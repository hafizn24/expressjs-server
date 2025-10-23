const gemma = require('../../gemma')
const { GoogleGenAI } = require('@google/genai');

class GemmaController {
    constructor() {
        this.ai = new GoogleGenAI({ apiKey: gemma });
    }

    setChat = async (req, res) => {
        try {
            const { message } = req.body;

            const response = await this.ai.models.generateContent({
                model: 'gemma-3-27b-it',
                contents: `Please keep the answer short and concise.\n${message}`,
            });

            res.json({ response: response.text });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new GemmaController();