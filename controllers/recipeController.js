// controllers/recipeController.js
const db = require('../models/dbConnection');
const { scrapeRecipeData } = require('../services/scrapingService');
const { summarizeRecipeData } = require('../services/chatgptService'); // placeholder or real ChatGPT

/**
 * 1. CREATE (Scrape & Add)
 */
async function scrapeAndAddRecipe(req, res) {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required.' });
  }
  
  try {
    // 1. Scrape
    const rawData = await scrapeRecipeData(url);
    
    // 2. Summarize (currently a placeholder or real ChatGPT)
    const structuredData = await summarizeRecipeData(rawData);
    
    // We'll use cooking_time if returned from summarization or set it manually
    // For now, let's just read from structuredData if it exists
    const cookingTime = null;
    
    // 3. Store in DB (handle potential duplicates for title)
    const query = `
      INSERT INTO recipes (title, ingredients, directions, nutrition, source_url, cooking_time)
      VALUES (?, ?, ?, ?, ?, ?);
    `;
    const params = [
      rawData.title.trim(),
      JSON.stringify(structuredData.ingredients),
      JSON.stringify(structuredData.directions),
      JSON.stringify(structuredData.nutrition),
      url,
      cookingTime
    ];
    
    await db.query(query, params);
    
    return res.status(201).json({ message: 'Recipe added successfully.' });
  } catch (err) {
    console.error('Error in scrapeAndAddRecipe:', err);
    
    // If this is a duplicate title error (ER_DUP_ENTRY), respond accordingly
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'A recipe with this title already exists.' });
    }
    
    return res.status(500).json({ error: 'Failed to scrape and add recipe.' });
  }
}

/**
 * 2. READ ALL (with filters & pagination)
 *    GET /api/recipes?title=...&minCookingTime=...&maxCookingTime=...&page=1&limit=10
 */
async function getAllRecipes(req, res) {
  const { title, minCookingTime, maxCookingTime, page = 1, limit = 10 } = req.query;
  
  // Build WHERE clause parts
  const whereClauses = [];
  const queryParams = [];
  
  if (title) {
    whereClauses.push(`title LIKE ?`);
    queryParams.push(`%${title}%`);
  }
  if (minCookingTime) {
    whereClauses.push(`cooking_time >= ?`);
    queryParams.push(Number(minCookingTime));
  }
  if (maxCookingTime) {
    whereClauses.push(`cooking_time <= ?`);
    queryParams.push(Number(maxCookingTime));
  }
  
  // Combine WHERE clauses
  let whereSQL = '';
  if (whereClauses.length > 0) {
    whereSQL = 'WHERE ' + whereClauses.join(' AND ');
  }
  
  const offset = (Number(page) - 1) * Number(limit);
  
  try {
    // Count total results for pagination
    const countQuery = `SELECT COUNT(*) as total FROM recipes ${whereSQL}`;
    const [countRows] = await db.query(countQuery, queryParams);
    const total = countRows[0].total;
    
    // Main select with filters + pagination
    const selectQuery = `
      SELECT id, title, ingredients, directions, nutrition, source_url, cooking_time, created_at
      FROM recipes
      ${whereSQL}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    // Add limit & offset to the query params
    const selectParams = [...queryParams, Number(limit), offset];
    const [rows] = await db.query(selectQuery, selectParams);
    
    return res.json({
      page: Number(page),
      limit: Number(limit),
      total,
      data: rows
    });
  } catch (err) {
    console.error('Error in getAllRecipes:', err);
    return res.status(500).json({ error: 'Failed to fetch recipes.' });
  }
}

/**
 * 3. READ ONE (by id)
 *    GET /api/recipes/:id
 */
async function getRecipeById(req, res) {
  const { id } = req.params;
  
  try {
    const [rows] = await db.query(`SELECT * FROM recipes WHERE id = ?`, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Recipe not found.' });
    }
    return res.json(rows[0]);
  } catch (err) {
    console.error('Error in getRecipeById:', err);
    return res.status(500).json({ error: 'Failed to fetch recipe.' });
  }
}

/**
 * 4. UPDATE (by id)
 *    PUT /api/recipes/:id
 *    Body can contain title, ingredients, directions, nutrition, cooking_time, etc.
 */
async function updateRecipe(req, res) {
  const { id } = req.params;
  const { title, ingredients, directions, nutrition, cooking_time, source_url } = req.body;
  
  // We’ll build a dynamic UPDATE query
  const fields = [];
  const params = [];
  
  if (title) {
    fields.push(`title = ?`);
    params.push(title.trim());
  }
  if (ingredients) {
    fields.push(`ingredients = ?`);
    params.push(JSON.stringify(ingredients));
  }
  if (directions) {
    fields.push(`directions = ?`);
    params.push(JSON.stringify(directions));
  }
  if (nutrition) {
    fields.push(`nutrition = ?`);
    params.push(JSON.stringify(nutrition));
  }
  if (cooking_time !== undefined) {
    fields.push(`cooking_time = ?`);
    params.push(Number(cooking_time));
  }
  if (source_url) {
    fields.push(`source_url = ?`);
    params.push(source_url);
  }
  
  if (fields.length === 0) {
    return res.status(400).json({ error: 'No fields to update.' });
  }
  
  try {
    const updateQuery = `
      UPDATE recipes
      SET ${fields.join(', ')}
      WHERE id = ?
    `;
    
    params.push(id);  // for WHERE clause
    const [result] = await db.query(updateQuery, params);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Recipe not found.' });
    }
    
    return res.json({ message: 'Recipe updated successfully.' });
  } catch (err) {
    console.error('Error in updateRecipe:', err);
    
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'A recipe with this title already exists.' });
    }
    
    return res.status(500).json({ error: 'Failed to update recipe.' });
  }
}

module.exports = {
  scrapeAndAddRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe
};
