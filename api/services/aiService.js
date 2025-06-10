// api/services/aiService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
// Add imports for OpenAI (ChatGPT) and Grok SDKs here

const analyzeWithGemini = async (text) => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Analyze the sentiment of this text and return only "positive", "negative", or "neutral": "${text}"`;
    const result = await model.generateContent(prompt);
    return result.response.text();
};

const analyzeWithChatGPT = async (text) => {
    // Add logic for ChatGPT here
    return "positive"; // Placeholder
};

const analyzeWithGrok = async (text) => {
    // Add logic for Grok here
    return "neutral"; // Placeholder
};

// This is the main function you will call from your routes
const analyzeSentiment = async (text, provider = 'gemini') => {
    switch (provider) {
        case 'chatgpt':
            return await analyzeWithChatGPT(text);
        case 'grok':
            return await analyzeWithGrok(text);
        case 'gemini':
        default:
            return await analyzeWithGemini(text);
    }
};

module.exports = { analyzeSentiment };