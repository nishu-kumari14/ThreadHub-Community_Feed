#!/bin/bash
set -e

# Get the directory this script is in
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "=== Installing Python dependencies ==="
uv pip install --system -r requirements.txt 2>&1 || { echo "Failed to install Python deps"; exit 1; }

echo "=== Building frontend ==="
cd frontend
if [ ! -d "node_modules" ]; then
  npm install --legacy-peer-deps 2>&1 || { echo "Failed to install npm deps"; exit 1; }
fi
npm run build 2>&1 || { echo "Failed to build frontend"; exit 1; }
cd "$SCRIPT_DIR"

echo "=== Running Django migrations (if DATABASE_URL set) ==="
if [ -n "$DATABASE_URL" ]; then
  cd backend
  python manage.py migrate --noinput 2>&1 || { echo "Warning: Migration failed, but continuing"; }
  python manage.py collectstatic --noinput 2>&1 || { echo "Warning: Collectstatic failed, but continuing"; }
  cd "$SCRIPT_DIR"
else
  echo "Skipping migrations: DATABASE_URL not set"
fi

echo "=== Build completed successfully! ==="
