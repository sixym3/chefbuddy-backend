const axios = require('axios');
const fs = require('fs');
const OpenAI = require('openai');

const JSONFORMAT = '{title :[], ingredients :[], directions :[], nutrition :{"Calories": "xxx","Carbohydrates": "xxx","Protein": "xxx","Fat": "xxx","Saturated Fat": "xxx","Cholesterol": "xxx","Sodium": "xxx","Potassium": "xxx","Fiber": "xxx","Vitamin A": "xxx","Vitamin C": "xxx","Calcium": "xxx","Iron": "xxx"}, cooking_time : "xxx", prep_time : "xxx"}.';

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

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    console.log("ChatGPT Service Called, Raw Data: \n", rawData);

    const prompt = `The following data is scraped from the web and might have repeated or inconsistent information. 
        Extract and summarize it into a cohesive JSON object with the following format: 
        ${JSONFORMAT}
        If information is missing, use "--" or an empty string appropriately. Return the JSON object only. 
        Here is the input: ${JSON.stringify(rawData)}
        `;

    console.log("PROMPT: \n", prompt);

    const completion = openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages: [
        { "role": "user", "content": prompt },
      ],
    });

    const result = await completion;

    // Extract and return ChatGPT response
    return parseResponse(result);

  } catch (error) {
    console.error("Error summarizing recipe data:", error);
    return rawData;
  }
}

async function synthesizeRecipeData(input) {
  try {
    if (typeof input !== String) {
      console.error("Must proide a prompt");
      return null;
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = ` : ${JSON.stringify(input)}`;

    console.log("PROMPT: \n", prompt);

    const completion = openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages: [
        { "role": "user", "content": prompt },
      ],
    });

    const result = await completion;

    // Extract and return ChatGPT response
    return parseResponse(result);

  } catch (error) {
    console.error("Error summarizing recipe data:", error);
    return rawData;
  }
};



function parseResponse(result) {
  const chatResponse = result.choices[0].message.content;
  // Extract JSON content between ```json and ``` markers
  const jsonContent = chatResponse.replace(/^```json\n|\n```$/g, '').trim();
  console.log("ChatGPT Response JSON: \n", jsonContent);
  const summarizedData = JSON.parse(jsonContent);

  return summarizedData || rawData;
};

module.exports = {
  summarizeRecipeData,
  synthesizeRecipeData,
};
