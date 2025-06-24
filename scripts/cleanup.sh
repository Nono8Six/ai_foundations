#!/bin/sh
set -e

# Simple cleanup script for local development
# Stops Docker containers, removes node_modules and prunes Docker data

echo "🧹 Stopping containers..."
docker-compose down -v || true

echo "🗑 Removing node_modules directories..."
find . -name node_modules -type d -prune -exec rm -rf {} + 2>/dev/null || true

echo "🧹 Pruning Docker data..."
docker system prune -af --volumes || true

echo "✅ Cleanup complete"
