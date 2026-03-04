
top on error
set -e

# Define variables
VERSION="0.36.5"
FILENAME="pocketbase_${VERSION}_linux_amd64.zip"
DOWNLOAD_URL="https://github.com/pocketbase/pocketbase/releases/download/v${VERSION}/${FILENAME}"
TARGET_DIR="services/pocketbase"

# Download and unzip
echo "Downloading PocketBase ${VERSION}..."
curl -L -o "$FILENAME" "$DOWNLOAD_URL"

echo "Unzipping..."
unzip -o "$FILENAME" -d "$TARGET_DIR"
chmod +x "$TARGET_DIR/pocketbase"

# Clean up
rm "$FILENAME"

echo "Installed PocketBase ${VERSION} to ./${TARGET_DIR}/pocketbase"

# Install npm packages
npm install
echo "Installed npm packages"
