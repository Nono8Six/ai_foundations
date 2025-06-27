#!/bin/sh
set -e

# Simple cleanup script for local development
# Stops Docker containers, removes node_modules and prunes Docker data

echo "🧹 Stopping containers..."
docker-compose down -v || true

echo "🗑 Removing node_modules directories..."
find . -name node_modules -type d -prune -exec rm -rf {} + 2>/dev/null || true

echo "🧹 Pruning Docker data (related to this project if possible)..."
# Try to remove volumes associated with the project first if docker-compose.yml has named volumes
# This is a best-effort, as docker-compose down -v should handle named volumes defined in the compose file.
# For a more aggressive cleanup of all unused Docker data:
# echo "For a more aggressive cleanup, run: docker system prune -af --volumes"
# docker-compose down -v should have removed project-specific anonymous volumes.
# The command below is very aggressive as it prunes ALL unused docker data including non-project volumes.
# Consider if this is truly desired for a simple project 'cleanup'.
# For now, we'll rely on 'docker-compose down -v' for volume cleanup related to the project.
# If you want to prune all unused docker data system-wide, uncomment the next line:
# docker system prune -af --volumes || true
echo "   (Skipping global 'docker system prune --volumes'. 'docker-compose down -v' handles project volumes)."

echo "✅ Cleanup complete"
