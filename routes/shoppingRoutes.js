// routes/shoppingRoutes.js
const express = require('express');
const { generateShoppingList } = require('../controllers/shoppingController');

const router = express.Router();

// POST /api/shopping
router.post('/', generateShoppingList);

module.exports = router;
