#!/bin/bash

# Define variables
LAYER_NAME="tweeter-lambda-dependencies"
REGION="us-east-1"
RUNTIME="nodejs20.x"
ZIP_FILE="node_layer.zip"
NODEJS_DIR="nodejs"

# Remove any previous zip file and nodejs dir
rm -f "$ZIP_FILE"

# Create a temporary directory structure for Lambda layer
CURRENT_DIR=$(pwd)
mkdir "$CURRENT_DIR/$NODEJS_DIR"

# Install npm packages
npm install --prefix "$CURRENT_DIR"
echo ""

# Copy npm packages to nodejs
cp -r "node_modules" "$NODEJS_DIR"

# Copy local modules by following symbolic links
echo "Copying local modules..."
echo ""
find "$CURRENT_DIR/node_modules" -type l | while read -r link; do
    # Resolve the link target
    target=$(readlink "$link")

    # Skip internal npm directories like .bin
    if [[ "$link" == *"/.bin/"* ]]; then
        continue
    fi

    # If the target is a relative path, resolve it relative to the link's directory
    if [[ ! "$target" =~ ^/ ]]; then
        target=$(realpath "$(dirname "$link")/$target")
    fi

    # Check if the target is a directory (likely a local module)
    if [ -d "$target" ]; then
        echo "Copying local module from"
        echo "$target -> $link"
        rm "$link" # Remove the symlink
        cp -R "$target" "$link" # Copy the local module
    fi
done
echo ""

# Zip the `nodejs` folder for Lambda layer
echo "Zipping node_modules into $ZIP_FILE..."
zip -r "$CURRENT_DIR/$ZIP_FILE" "$NODEJS_DIR" > /dev/null
echo ""

# Publish the layer to AWS Lambda
echo "Uploading layer to AWS..."
# echo "aws lambda publish-layer-version --layer-name "$LAYER_NAME" --region "$REGION" --compatible-runtimes "$RUNTIME" --zip-file "fileb://$ZIP_FILE" --query 'LayerVersionArn' --output text"
LAYER_ARN=$(aws lambda publish-layer-version \
    --layer-name "$LAYER_NAME" \
    --region "$REGION" \
    --compatible-runtimes "$RUNTIME" \
    --zip-file "fileb://$CURRENT_DIR/$ZIP_FILE" \
    --query 'LayerVersionArn' \
    --output text)
echo ""

if [ $? -eq 0 ]; then
    echo "Layer uploaded successfully!"
    echo ""

    echo "New Layer ARN: $LAYER_ARN"
    sed -i '' "s|^LAMBDALAYER_ARN=.*|LAMBDALAYER_ARN='$LAYER_ARN'|" .server
else
    echo "Failed to upload layer."
fi
