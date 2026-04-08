#!/bin/bash

# Script to run Laravel backend on host machine
# This allows Jenkins (in Docker) to access it via host.docker.internal

echo "🚀 Starting Laravel backend on host..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    exit 1
fi

# Install dependencies if needed
if [ ! -d vendor ]; then
    echo "📦 Installing composer dependencies..."
    composer install
fi

# Run migrations
echo "🔧 Running database migrations..."
php artisan migrate --force

# Seed database if empty
echo "🌱 Seeding database..."
php artisan db:seed --force

# Clear caches
echo "🧹 Clearing caches..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# Start the server
echo "✅ Starting server on http://localhost:8000"
echo "Press Ctrl+C to stop"
php artisan serve --host=0.0.0.0 --port=8000
