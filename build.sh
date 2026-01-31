#!/bin/bash
set -e

# Get the directory this script is in
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "=== Current directory: $SCRIPT_DIR ==="
echo "=== Node version: $(node --version) ==="
echo "=== npm version: $(npm --version) ==="
echo "=== Python version: $(python --version) ==="

python - <<'PY'
import sys
if sys.version_info < (3, 10):
  raise SystemExit(
    "Python 3.10+ is required. Set Vercel Project Settings → Python Version to 3.12."
  )
PY

echo ""
echo "=== Installing Python dependencies ==="
export UV_LINK_MODE=copy
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
echo "=== Django setup (if database env is set) ==="
echo "DATABASE_URL length: ${#DATABASE_URL}"
echo "POSTGRES_URL length: ${#POSTGRES_URL}"
echo "POSTGRES_PRISMA_URL length: ${#POSTGRES_PRISMA_URL}"
echo "POSTGRES_URL_NON_POOLING length: ${#POSTGRES_URL_NON_POOLING}"

DB_URL=${DATABASE_URL:-${POSTGRES_URL:-${POSTGRES_PRISMA_URL:-$POSTGRES_URL_NON_POOLING}}}

if [ -n "$DB_URL" ]; then
  echo "✓ Database URL detected, running migrations..."
  cd backend
  if ! python manage.py migrate --noinput 2>&1; then
    echo "WARNING: Migration failed, but continuing build"
  fi
  if ! python manage.py collectstatic --noinput 2>&1; then
    echo "WARNING: Collectstatic failed, but continuing build"
  fi
  cd "$SCRIPT_DIR"
else
  echo "✗ ERROR: No database URL env detected. Configure DATABASE_URL (or POSTGRES_URL) in Vercel."
  exit 1
fi

echo ""
echo "=== Build completed successfully! ===

