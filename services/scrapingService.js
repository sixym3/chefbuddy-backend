// services/scrapingService.js
const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeRecipeData(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    
    // Basic scraping example; your actual selectors may differ
    const title = $('h1').text().trim() || 'Untitled Recipe';
    
    // Collect raw ingredients from the DOM
    const rawIngredients = [];
    $('li.ingredient').each((i, el) => {
      rawIngredients.push($(el).text().trim());
    });
    
    // Collect raw directions
    const rawDirections = [];
    $('li.direction').each((i, el) => {
      rawDirections.push($(el).text().trim());
    });
    
    // Possibly collect raw nutrition info
    const rawNutrition = $('div.nutrition').text().trim();
    
    return {
      title,
      rawIngredients,
      rawDirections,
      rawNutrition
    };
  } catch (err) {
    console.error('Error scraping recipe:', err.message);
    throw err;
  }
}

module.exports = {
  scrapeRecipeData
};
