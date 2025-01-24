// controllers/calendarController.js
const db = require('../models/dbConnection');

async function addMealToCalendar(req, res) {
  // For POC, we skip user auth; we only store a reference to recipe ID + date
  const { recipeId, date } = req.body;
  
  if (!recipeId || !date) {
    return res.status(400).json({ error: 'recipeId and date are required.' });
  }
  
  try {
    const query = `INSERT INTO meal_calendar (recipe_id, scheduled_date) VALUES (?, ?)`;
    const [result] = await db.query(query, [recipeId, date]);
    return res.status(201).json({ 
      message: 'Meal added to calendar.',
      calendarId: result.insertId 
    });
  } catch (err) {
    console.error('Error adding meal to calendar:', err);
    return res.status(500).json({ error: 'Error adding meal to calendar.' });
  }
}

module.exports = {
  addMealToCalendar
};
