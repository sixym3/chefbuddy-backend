-- SQL script to set up recipe_db and recipe table

-- Create the database if it does not exist
CREATE DATABASE IF NOT EXISTS recipe_db;

-- Use the database
USE recipe_db;

-- Create the recipe table
CREATE TABLE IF NOT EXISTS recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    ingredients TEXT,
    directions TEXT,
    nutrition TEXT,
    source_url VARCHAR(255),
    cooking_time VARCHAR(255) DEFAULT '--',
    prep_time VARCHAR(255) DEFAULT '--',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);
