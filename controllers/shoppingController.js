// controllers/shoppingController.js
const db = require('../models/dbConnection');

async function generateShoppingList(req, res) {
  try {
    // For simplicity, fetch all meals from meal_calendar
    const [calendarRows] = await db.query(`SELECT * FROM meal_calendar`);
    
    const neededItems = [];
    
    // Loop over scheduled meals
    for (const meal of calendarRows) {
      // Get recipe data
      const [recipes] = await db.query(`SELECT * FROM recipes WHERE id = ?`, [meal.recipe_id]);
      if (!recipes.length) continue;
      const recipe = recipes[0];
      
      const ingredients = JSON.parse(recipe.ingredients) || [];
      
      // Compare with pantry (for POC, let's assume no user or pantry, so we take all ingredients as needed)
      for (const ingredient of ingredients) {
        neededItems.push({
          itemName: ingredient,
          // If you have quantity data, parse here
          quantity: 1
        });
      }
    }
    
    // Insert into a shopping_list table, for demonstration
    for (const item of neededItems) {
      // Insert each item row
      await db.query(`INSERT INTO shopping_list (item_name, quantity, status) VALUES (?, ?, ?)`, 
        [item.itemName, item.quantity, 'TO_BUY']
      );
    }
    
    return res.json({
      message: 'Shopping list generated successfully.',
      items: neededItems
    });
    
  } catch (err) {
    console.error('Error generating shopping list:', err);
    return res.status(500).json({ error: 'Error generating shopping list.' });
  }
}

module.exports = {
  generateShoppingList
};
