#!/bin/bash

# Define MySQL credentials
USER="root"
PASSWORD="password"
HOST="localhost"

# Define the SQL file path
SQL_FILE="./database_setup.sql"

# Check if the SQL file exists
if [ ! -f "$SQL_FILE" ]; then
  echo "Error: SQL file '$SQL_FILE' not found."
  exit 1
fi

# Run the SQL file to set up the database and table
mysql -u "$USER" -p"$PASSWORD" -h "$HOST" < "$SQL_FILE"

if [ $? -eq 0 ]; then
  echo "Database and table setup completed successfully."
else
  echo "Failed to set up the database and table."
  exit 1
fi
