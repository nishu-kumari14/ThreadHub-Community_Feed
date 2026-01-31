#!/bin/bash
set -e

# Get the directory this script is in
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "=== Current directory: $SCRIPT_DIR ==="
echo "=== Node version: $(node --version) ==="
echo "=== npm version: $(npm --version) ==="
echo "=== Python version: $(python --version) ==="

echo ""
echo "=== Installing Python dependencies ==="
if ! uv pip install --system -r requirements.txt 2>&1; then 
  echo "ERROR: Failed to install Python dependencies"
  exit 1
fi

echo ""
echo "=== Building frontend ==="
cd frontend
if [ ! -d "node_modules" ]; then
  echo "Installing npm dependencies..."
  if ! npm install --legacy-peer-deps 2>&1; then
    echo "ERROR: Failed to install npm dependencies"
    exit 1
  fi
else
  echo "node_modules exists, skipping npm install"
fi

echo "Running build..."
if ! npm run build 2>&1; then
  echo "ERROR: Frontend build failed"
  exit 1
fi
cd "$SCRIPT_DIR"

echo ""
echo "=== Django setup (if DATABASE_URL is set) ==="
if [ -n "$DATABASE_URL" ]; then
  echo "DATABASE_URL detected, running migrations..."
  cd backend
  if ! python manage.py migrate --noinput 2>&1; then
    echo "WARNING: Migration failed, but continuing build"
  fi
  if ! python manage.py collectstatic --noinput 2>&1; then
    echo "WARNING: Collectstatic failed, but continuing build"
  fi
  cd "$SCRIPT_DIR"
else
  echo "DATABASE_URL not set, skipping migrations"
fi

echo ""
echo "=== Build completed successfully! ===

