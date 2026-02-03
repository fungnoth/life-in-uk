#!/bin/bash

# Build script for GitHub Pages deployment
echo "Building for GitHub Pages..."

# Set environment variables
export NEXT_PUBLIC_BUILD_TIME=$(date -u +%Y-%m-%dT%H:%M:%S)
export NEXT_PUBLIC_GITHUB_PAGES=true
export GITHUB_PAGES=true
export NODE_ENV=production

# Debug output
echo "Environment variables set:"
echo "  NODE_ENV: $NODE_ENV"
echo "  GITHUB_PAGES: $GITHUB_PAGES"
echo "  NEXT_PUBLIC_GITHUB_PAGES: $NEXT_PUBLIC_GITHUB_PAGES"
echo "  NEXT_PUBLIC_BUILD_TIME: $NEXT_PUBLIC_BUILD_TIME"

# Run the build
echo "Running Next.js build..."
npx next build

# Update Service Worker with build time for cache busting
echo "Updating Service Worker build time..."
if [ -f "out/sw.js" ]; then
  sed -i "s/BUILD_TIME_PLACEHOLDER/$NEXT_PUBLIC_BUILD_TIME/g" out/sw.js
fi
if [ -f "public/sw.js" ]; then
  sed -i "s/BUILD_TIME_PLACEHOLDER/$NEXT_PUBLIC_BUILD_TIME/g" public/sw.js
fi

echo "Build completed!"
