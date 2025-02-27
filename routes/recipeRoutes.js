// routes/recipeRoutes.js
const express = require('express');
const { scrapeAndAddRecipe, synthesizeAndAddRecipe} = require('../controllers/recipeController');

const router = express.Router();

// POST /api/recipes/scrape
router.post('/scrape', scrapeAndAddRecipe);
router.post('/synthesize', synthesizeAndAddRecipe);

module.exports = router;
