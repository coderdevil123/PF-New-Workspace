#!/bin/bash

# Deployment script for PF Workspace
# Usage: ./deploy.sh

set -e

echo "🚀 Starting deployment..."

# Pull latest changes from GitHub (if applicable)
echo "📥 Pulling latest code from GitHub..."
git pull origin main || echo "⚠️  Not pulling from git (working on local changes)"

# Stop and remove existing containers
echo "🛑 Stopping existing containers..."
docker compose down

# Build and start new containers
echo "🔨 Building Docker image..."
docker compose build --no-cache

echo "▶️  Starting containers..."
docker compose up -d

# Show container status
echo "✅ Deployment complete!"
echo ""
echo "Container status:"
docker compose ps

echo ""
echo "🌐 Your application is now running!"
echo "Access it at: http://10.10.10.57"
echo ""
echo "📝 To view logs, run: docker-compose logs -f"