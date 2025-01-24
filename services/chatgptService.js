// services/chatgptService.js

/**
 * Placeholder function that returns a fake structured recipe
 * as if it was summarized by ChatGPT.
 */
async function summarizeRecipeData(rawData) {
  // For now, just return some dummy data
  return {
    ingredients: [
      "1 cup of flour",
      "2 eggs",
      "1/2 cup of milk"
    ],
    directions: [
      "Combine all ingredients in a bowl",
      "Mix thoroughly",
      "Bake at 180°C for 20 minutes"
    ],
    nutrition: {
      calories: "200 kcal per serving",
      fat: "10g",
      protein: "5g"
    }
  };
}

module.exports = {
  summarizeRecipeData
};
