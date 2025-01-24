// routes/calendarRoutes.js
const express = require('express');
const { addMealToCalendar } = require('../controllers/calendarController');

const router = express.Router();

// POST /api/calendar
router.post('/', addMealToCalendar);

module.exports = router;
