#!/bin/bash

# Career Compass - Quick Question Import Script
# This script imports all questions from content MD files into MongoDB

echo "🚀 Career Compass - Question Import System"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    echo "   Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Check if MongoDB is running
if command -v mongosh &> /dev/null; then
    if mongosh --eval "db.version()" --quiet &> /dev/null; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  Warning: MongoDB may not be running"
        echo "   Please start MongoDB first:"
        echo "   - macOS: brew services start mongodb-community"
        echo "   - Linux: sudo systemctl start mongod"
        echo "   - Windows: net start MongoDB"
        echo ""
        read -p "Continue anyway? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
else
    echo "⚠️  Warning: mongosh not found, cannot verify MongoDB status"
fi

echo ""

# Navigate to backend directory
cd "$(dirname "$0")/.." || exit 1

echo "📂 Current directory: $(pwd)"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found"
    echo "   Creating default .env file..."
    echo "MONGODB_URI=mongodb://localhost:27017/careercompass" > .env
    echo "   Created .env with default MongoDB connection"
    echo ""
fi

# Check if content files exist
CONTENT_DIR="../content"
if [ ! -d "$CONTENT_DIR" ]; then
    echo "❌ Error: Content directory not found at $CONTENT_DIR"
    exit 1
fi

echo "✅ Content directory found"
echo ""

# List content files
echo "📚 Content files to import:"
ls -lh "$CONTENT_DIR"/Section-*.md 2>/dev/null | awk '{print "   - " $9 " (" $5 ")"}'
echo ""

# Confirm before proceeding
read -p "Ready to import questions? This will replace existing questions. (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Import cancelled."
    exit 0
fi

echo ""
echo "🔄 Starting import..."
echo "=========================================="
echo ""

# Run the import script
node scripts/import_all_sections.js

# Check exit code
if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "✨ Import completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Start your backend server: npm start"
    echo "2. Test the API: POST /api/tests/generate/enhanced"
    echo "3. Check the README: cat IMPORT_QUESTIONS_README.md"
    echo ""
else
    echo ""
    echo "❌ Import failed. Please check the error messages above."
    echo ""
    exit 1
fi
