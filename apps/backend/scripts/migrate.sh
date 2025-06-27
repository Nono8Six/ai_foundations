#!/bin/bash
set -e

# Apply Supabase migrations to the linked project
# Normally this script is run automatically; executing it manually is exceptional.

set -e

echo "\u26a1\uFE0F Running Supabase migrations..."
supabase db push

echo "\u2705 Migrations applied successfully"
