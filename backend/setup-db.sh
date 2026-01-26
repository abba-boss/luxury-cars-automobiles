#!/bin/bash

echo "Setting up database configuration for development..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Creating .env file from example..."
    cp .env.example .env
    echo "Please update the .env file with your database credentials."
else
    echo ".env file already exists."
fi

# Check if sqlite3 is available
if command -v sqlite3 &> /dev/null; then
    echo "SQLite3 is available. Creating database file..."
    if [ ! -f ./database.sqlite ]; then
        sqlite3 database.sqlite "VACUUM;"
        echo "Database file created: database.sqlite"
    else
        echo "Database file already exists: database.sqlite"
    fi
else
    echo "SQLite3 is not available. Please install SQLite3 or configure MySQL in your .env file."
    echo "For MySQL, make sure the MySQL server is running and update your .env file accordingly."
fi

echo "Setup complete. Please ensure your database is running before starting the server."
echo ""
echo "To start the server:"
echo "1. Update your .env file with proper database configuration"
echo "2. Run database migrations: npm run db:migrate"
echo "3. Start the server: npm start"