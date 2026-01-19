#!/bin/bash

# Build and push Docker image to GitHub Container Registry
# Prerequisites:
# 1. Install Docker
# 2. Authenticate with ghcr.io: docker login ghcr.io -u USERNAME -p GITHUB_TOKEN
#    (Use a PAT with write:packages permission)

set -e

IMAGE_NAME="ghcr.io/ameerfaisaladanan/formatje"
VERSION="${1:-latest}"
FULL_IMAGE_NAME="${IMAGE_NAME}:${VERSION}"

echo "Building Docker image: ${FULL_IMAGE_NAME}"
docker build -t "${FULL_IMAGE_NAME}" -t "${IMAGE_NAME}:latest" .

echo "Pushing image to GitHub Container Registry..."
docker push "${FULL_IMAGE_NAME}"
docker push "${IMAGE_NAME}:latest"

echo "✓ Successfully pushed ${FULL_IMAGE_NAME}"
echo ""
echo "To run with docker-compose:"
echo "  docker-compose up -d"
echo ""
echo "Or with docker directly:"
echo "  docker run -p 9111:8080 ${FULL_IMAGE_NAME}"
