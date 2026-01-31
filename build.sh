#!/bin/bash
set -e

echo "Installing Python dependencies..."
uv pip install --system -r requirements.txt

echo "Running Django migrations..."
cd backend
python manage.py migrate --noinput
python manage.py collectstatic --noinput
cd ..

echo "Installing Node dependencies..."
cd frontend
npm install

echo "Building frontend..."
npm run build
cd ..

echo "Build completed successfully!"
