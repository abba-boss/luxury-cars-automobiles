#!/bin/bash

echo "🚀 Starting production deployment..."

# Check if required environment variables are set
if [ -z "$DB_HOST" ] || [ -z "$DB_NAME" ] || [ -z "$JWT_SECRET" ]; then
    echo "❌ Missing required environment variables"
    exit 1
fi

# Backend setup
echo "📦 Installing backend dependencies..."
cd backend
npm ci --only=production

echo "🗄️  Running database migrations..."
npm run db:migrate

echo "🌱 Seeding database (if needed)..."
npm run db:seed

# Frontend setup
echo "📦 Building frontend..."
cd ../frontend
npm ci
npm run build

echo "✅ Deployment complete!"
echo "Backend: http://localhost:3001"
echo "Frontend: Serve the 'dist' folder with your web server"
