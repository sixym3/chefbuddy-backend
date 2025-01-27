// services/scrapingService.js
const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeRecipeData(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    
    // Get recipe title
    const title = $('h1').text().trim() || 'Untitled Recipe';
    
    // Collect ingredients
    const ingredients = [];
    $('[class*="ingredients"]').each((i, el) => {
      const text = $(el).text().replace(/[\n\t\r]+/g, ' ').replace(/\s+/g, ' ').trim();
      if (!ingredients.includes(text) && !ingredients.some(ing => ing.includes(text))) {
        ingredients.push(text);
      }
    });
    
    // Collect directions
    const directions = [];
    const directionKeywords = ['direction', 'instruction', 'steps', 'method', 'preparation'];
    const directionSelectors = directionKeywords.map(keyword => `[class*="${keyword}"]`).join(', ');
    $(directionSelectors).each((i, el) => {
      const text = $(el).text().replace(/[\n\t\r]+/g, ' ').replace(/\s+/g, ' ').trim();
      if (!directions.includes(text) && !directions.some(dir => dir.includes(text))) {
        directions.push(text);
      }
    });

    // Collect nutrition
    const nutrition = [];
    $('[class*="nutrition"]').each((i, el) => {
      const text = $(el).text().replace(/[\n\t\r]+/g, ' ').replace(/\s+/g, ' ').trim();
      if (!nutrition.includes(text) && !nutrition.some(nut => nut.includes(text))) {
        nutrition.push(text);
      }
    });

    // Get cooking time #TODO: Add cooking time information
    const cookingTime = [];
    $('[class*="time"]').each((i, el) => {
      const text = $(el).text().replace(/[\n\t\r]+/g, ' ').replace(/\s+/g, ' ').trim();
      if (!cookingTime.includes(text) && !cookingTime.some(ct => ct.includes(text))) {
        cookingTime.push(text);
      }
    });

    // Get prep time #TODO: Add prep time information
    const prepTime = [];
    $('[class*="prep*time"]').each((i, el) => {
      const text = $(el).text().replace(/[\n\t\r]+/g, ' ').replace(/\s+/g, ' ').trim();
      if (!prepTime.includes(text) && !prepTime.some(pt => pt.includes(text))) {
        prepTime.push(text);
      }
    });

    return {
      title,
      ingredients,
      directions,
      nutrition,
      cookingTime,
      prepTime,
      //metadata
      //recipeContainers: recipeContainers.html()
    };
  } catch (err) {
    console.error('Error scraping recipe:', err.message);
    throw err;
  }
}

module.exports = {
  scrapeRecipeData
};
