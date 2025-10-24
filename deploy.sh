#!/bin/bash

# Deployment script for Enhanced Crossword Puzzle Game
# This script builds and deploys the app to Netlify

set -e

echo "🎯 Enhanced Crossword Puzzle Game - Deployment Script"
echo "======================================================"
echo ""

# Navigate to example directory
cd "$(dirname "$0")/example"

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🏗️  Building production version..."
npm run build

echo ""
echo "✅ Build complete!"
echo ""
echo "🚀 Ready to deploy!"
echo ""
echo "Choose your deployment method:"
echo "1. Deploy to Netlify (requires Netlify CLI): netlify deploy --prod"
echo "2. Manual deploy: Upload the 'example/build' folder to Netlify"
echo "3. Git deploy: Push to GitHub and connect repository to Netlify"
echo ""
echo "📝 For detailed instructions, see DEPLOYMENT_GUIDE.md"
echo ""
