// app.js
require('dotenv').config();
const express = require('express');
const recipeRoutes = require('./routes/recipeRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const shoppingRoutes = require('./routes/shoppingRoutes');

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:5173',
}));
//app.use(cors());

// Register routes
app.use('/api/recipes', recipeRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/shopping', shoppingRoutes);

module.exports = app;
