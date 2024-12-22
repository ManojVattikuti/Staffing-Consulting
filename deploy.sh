#!/bin/bash

# Variables
COMMIT_ID=$1
PROJECT_NAME=$2
BUILD_TYPE=${3:-production}
TARGET_BASE="/home/rakeshkumar_manda8161/Staffing-ConsultingDist"
TARGET_PATH="${TARGET_BASE}/${PROJECT_NAME}dist"

# Check out the specified commit
echo "Checking out commit $COMMIT_ID..."
git checkout $COMMIT_ID || { echo "Failed to check out commit."; exit 1; }

# Install dependencies
echo "Installing dependencies..."
npm install --legacy-peer-deps || { echo "Failed to install dependencies."; exit 1; }

# Build the Angular project
echo "Building project $PROJECT_NAME with configuration $BUILD_TYPE..."
ng build $PROJECT_NAME --configuration=$BUILD_TYPE || { echo "Failed to build project."; exit 1; }

# Move the built dist directory to the specified path
echo "Moving built files to $TARGET_PATH..."
mkdir -p $TARGET_PATH
mv dist/$PROJECT_NAME/browser/* $TARGET_PATH || { echo "Failed to move built files."; exit 1; }

echo "Deployment complete."
