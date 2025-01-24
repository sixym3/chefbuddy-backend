// routes/recipeRoutes.js
const express = require('express');
const { scrapeAndAddRecipe } = require('../controllers/recipeController');

const router = express.Router();

// POST /api/recipes/scrape
router.post('/scrape', scrapeAndAddRecipe);

module.exports = router;
