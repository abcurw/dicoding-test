#!/bin/bash
set -e

echo "Waiting for MySQL to be ready..."
until php -r "new PDO('mysql:host=mysql;dbname=dicoding_jobs', 'dicoding', 'password123');" 2>/dev/null; do
    echo "MySQL is unavailable - sleeping"
    sleep 2
done

echo "MySQL is up - running migrations"
php artisan migrate --force

echo "Running database seeders"
php artisan db:seed --force

echo "Starting Laravel server"
php artisan serve --host=0.0.0.0 --port=8000
