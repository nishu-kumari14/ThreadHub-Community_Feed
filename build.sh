#!/bin/bash

# Build script for Railway deployment
# This will build the React frontend and copy it to Django static files

echo "🔨 Building ThreadHub for deployment..."

# Navigate to frontend directory
cd frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing npm packages..."
    npm install
fi

# Build the React frontend
echo "🏗️  Building React frontend..."
npm run build

# Navigate back to root
cd ..

# Create static directory structure if it doesn't exist
mkdir -p backend/staticfiles/frontend

# Copy the built frontend to Django static files
echo "📁 Copying frontend build to Django static files..."
cp -r frontend/dist/* backend/staticfiles/frontend/

# Create a simple index.html that serves the React app
# Django will serve this as the default page
mkdir -p backend/templates
cat > backend/templates/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ThreadHub - Community Feed</title>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="{% static 'frontend/index.js' %}"></script>
</body>
</html>
EOF

echo "✅ Build complete! Ready for Railway deployment."
