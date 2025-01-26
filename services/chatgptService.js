require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

// Configuration for ChatGPT API
const config = {
    apiKey: process.env.OPENAI_API_KEY, // Load API key from .env file
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4' // Specify the model to use
};

/**
 * Summarizes recipe data using ChatGPT API.
 * @param {Object} rawData - Parsed JSON object representing the recipe.
 * @returns {Promise<Object>} - Summarized recipe data.
 */
async function summarizeRecipeData(rawData) {
    try {
        // Ensure input is correctly structured
        if (!rawData || typeof rawData !== 'object') {
            console.error("Invalid input: rawData must be a parsed JSON object.");
            return null;
        }

        // Prepare ChatGPT prompt
        const prompt = `The following data is scraped from the web and might have repeated or inconsistent information. Extract and summarize it into a cohesive JSON object with the following parameters: title, ingredients, directions, nutrition, cooking_time. If information is missing, use "--" or an empty string appropriately. Here is the input:

${JSON.stringify(rawData)}
        `;

        // API request payload
        const payload = {
            model: config.model,
            messages: [
                { role: 'system', content: 'You are a helpful assistant for summarizing recipe data.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7 // Adjust for creativity
        };

        // Send API request
        const response = await axios.post(config.apiUrl, payload, {
            headers: {
                'Authorization': `Bearer ${config.apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        // Extract and return ChatGPT response
        const chatResponse = response.data.choices[0]?.message?.content;
        const summarizedData = JSON.parse(chatResponse);

        // Log the results
        console.log("Summarized Data:", summarizedData);
        
        
        
        return summarizedData || rawData;

    } catch (error) {
        console.error("Error summarizing recipe data:", error);
        return rawData;
    }
}

module.exports = {
  summarizeRecipeData
};