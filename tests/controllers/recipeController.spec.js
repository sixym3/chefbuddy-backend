// tests/controllers/recipeController.spec.js
const db = require('../../models/dbConnection');
const { scrapeAndAddRecipe } = require('../../controllers/recipeController');

jest.mock('../../services/scrapingService', () => ({
  scrapeRecipeData: jest.fn().mockResolvedValue({
    title: 'Test Recipe',
    rawIngredients: ['Ingredient 1', 'Ingredient 2'],
    rawDirections: ['Step 1', 'Step 2'],
    rawNutrition: 'Nutrition info'
  })
}));

jest.mock('../../services/chatgptService', () => ({
  summarizeRecipeData: jest.fn().mockResolvedValue({
    ingredients: ['Ingredient 1', 'Ingredient 2'],
    directions: ['Step 1', 'Step 2'],
    nutrition: { calories: '100' }
  })
}));

describe('recipeController', () => {
  beforeAll(() => {
    // Optionally set up DB test environment
    // or mock db.query if you want pure unit tests
    jest.spyOn(db, 'query').mockImplementation(async (sql, params) => {
      // Return a fake insert result
      return [{ insertId: 1 }, undefined];
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('scrapeAndAddRecipe should insert a new recipe', async () => {
    const req = {
      body: {
        url: 'https://fake-website.com/recipe'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await scrapeAndAddRecipe(req, res);

    expect(db.query).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Recipe added successfully.' });
  });
});


