// app.js
require('dotenv').config();
const express = require('express');
const recipeRoutes = require('./routes/recipeRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const shoppingRoutes = require('./routes/shoppingRoutes');

const app = express();
app.use(express.json());

// Register routes
app.use('/api/recipes', recipeRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/shopping', shoppingRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
