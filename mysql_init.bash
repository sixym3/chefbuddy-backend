#!/usr/bin/env bash
#
# This script installs MySQL and Node.js for Proof of Concept for the Chefbuddy backend.

### 1. Update and Install Dependencies ###
echo "Updating system packages..."
sudo apt update -y

echo "Installing required packages (curl, git)..."
sudo apt install -y curl git

### 2. Install Node.js (LTS) ###
echo "Adding NodeSource repository for Node.js..."
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -

echo "Installing Node.js..."
sudo apt install -y nodejs

echo "Verifying Node.js and npm versions..."
node -v
npm -v

### 3. Install and Configure MySQL ###
echo "Installing MySQL server..."
sudo apt-get install -y mysql-server

echo "Starting MySQL service..."
sudo systemctl start mysql
sudo systemctl enable mysql

# Variables for DB setup (customize these values as needed).
DB_NAME="recipe_db"
DB_USER="recipe_user"
DB_PASS="my_strong_password"

echo "Creating MySQL database and user..."

# Run commands in MySQL to create the database and user
sudo mysql --execute="
CREATE DATABASE IF NOT EXISTS ${DB_NAME};
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
USE ${DB_NAME};
CREATE TABLE IF NOT EXISTS recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    ingredients TEXT NOT NULL,
    directions TEXT NOT NULL,
    nutrition TEXT,
    source_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cooking_time INT DEFAULT NULL
);
ALTER TABLE recipes ADD UNIQUE INDEX idx_unique_title (title);
"

echo "MySQL database setup complete."

