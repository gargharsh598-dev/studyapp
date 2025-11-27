import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'demo-key';
let genAI;

try {
    genAI = new GoogleGenerativeAI(apiKey);
} catch (error) {
    console.warn('Gemini AI initialization failed. Please add your API key to .env file.');
}

export const getGeminiModel = (modelName = 'gemini-1.5-flash') => {
    if (!genAI) {
        console.warn('Gemini AI not initialized. Please configure your API key.');
        return null;
    }
    return genAI.getGenerativeModel({ model: modelName });
};

export default genAI;
