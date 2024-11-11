#!/bin/bash

set -e

echo "Building tweeter-shared"
CURRENT_DIR=$(pwd)
cd "$(dirname "$CURRENT_DIR")/tweeter-shared"
npm run build
echo ""

echo "Building tweeter-server"
cd "$CURRENT_DIR"
npm run build
echo ""

echo "Update Layer Dependencies"
./awsUpdateLayerDependencies.sh

echo "Sleeping 1 sec"
sleep 1
echo ""

echo "Upload Lambdas"
./uploadLambdas.sh

echo "Sleeping 5 secs"
sleep 5
echo ""

echo "Update Layers on Lambda"
./updateLayers.sh

