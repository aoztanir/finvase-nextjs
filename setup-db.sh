#!/bin/bash

echo "🚀 Setting up Finvase database..."

# Check if Docker is installed
if command -v docker &> /dev/null; then
    echo "✅ Docker found"
    echo "🐘 Starting PostgreSQL with Docker..."
    docker-compose up -d
    echo "⏳ Waiting for database to start..."
    sleep 5
else
    echo "❌ Docker not found. Please install Docker or set up PostgreSQL manually."
    echo "📖 See README for manual setup instructions."
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found!"
    echo "📝 Please create .env.local file with your database credentials."
    exit 1
fi

echo "📊 Pushing database schema..."
pnpm run db:push

if [ $? -eq 0 ]; then
    echo "✅ Database setup complete!"
    echo "🎉 You can now run 'pnpm dev' to start the application"
    echo "🗄️  Access database studio with 'pnpm run db:studio'"
else
    echo "❌ Database setup failed. Please check your DATABASE_URL in .env.local"
    echo "🔧 Make sure PostgreSQL is running and credentials are correct."
fi