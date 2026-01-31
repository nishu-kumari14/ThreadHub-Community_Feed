#!/bin/bash
set -e

echo "Installing backend dependencies..."
pip install -r requirements.txt

echo "Running Django migrations..."
cd backend
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

cd ..

echo "Building frontend..."
cd frontend
npm install
npm run build

echo "Build completed successfully!"
