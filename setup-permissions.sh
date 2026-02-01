#!/bin/bash

echo "Setting up User Permission System..."
echo

# Check if MySQL is running
if ! pgrep mysqld > /dev/null; then
    echo "❌ MySQL is not running. Please start MySQL server first."
    echo "   On Ubuntu/Debian: sudo systemctl start mysql"
    echo "   On macOS with Homebrew: brew services start mysql"
    echo "   On Windows: Start MySQL from Services"
    exit 1
fi

echo "✅ MySQL is running"

# Check if .env file has proper database credentials
if [ ! -f "backend/.env" ]; then
    echo "❌ backend/.env file not found"
    exit 1
fi

# Source the environment variables
source backend/.env

if [ -z "$DB_PASSWORD" ]; then
    echo "⚠️  Warning: DB_PASSWORD is empty in .env file"
    echo "   This might cause connection issues if MySQL requires a password"
fi

echo "Attempting to run database migrations..."
cd backend

# Run the migration
npx sequelize-cli db:migrate

if [ $? -eq 0 ]; then
    echo
    echo "✅ Database migration completed successfully!"
    echo
    echo "User Permission System is now set up in the database."
    echo "You can start the application with:"
    echo "   cd backend && npm start"
    echo "   cd frontend && npm run dev"
else
    echo
    echo "❌ Database migration failed"
    echo "Please check your database configuration in backend/.env"
    echo "Make sure the database exists and the credentials are correct"
fi