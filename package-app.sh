#!/bin/bash

# Script to create a distributable package of the Hitcraft Electron app

echo "Creating distributable package of Hitcraft Electron app..."

# Ensure we're in the right directory
cd "$(dirname "$0")"

# Build the React app first
echo "Building React app..."
if [ -d "../source/V2react-dev" ]; then
  cd ../source/V2react-dev
  npm run build
  cd ../../hitcraft-electron
elif [ -d "./source/V2react-dev" ]; then
  cd ./source/V2react-dev
  npm run build
  cd ../../
else
  echo "Error: React app directory not found. Please ensure your directory structure is correct."
  exit 1
fi

# Copy favicon.ico to build directory if it doesn't exist
mkdir -p build/assets
if [ ! -f build/favicon.ico ]; then
  echo "Copying favicon.ico to build directory..."
  if [ -f ./source/V2react-dev/public/favicon.ico ]; then
    cp ./source/V2react-dev/public/favicon.ico build/favicon.ico
  elif [ -f ../source/V2react-dev/public/favicon.ico ]; then
    cp ../source/V2react-dev/public/favicon.ico build/favicon.ico
  else
    echo "Warning: favicon.ico not found. The app will use a default icon."
  fi
fi

# Create package for current platform
echo "Building Electron app package..."
npm run dist

echo "Package created successfully! Check the dist/ directory for the installable application."
