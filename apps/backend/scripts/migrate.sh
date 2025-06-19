#!/bin/bash

# Apply Supabase migrations to the linked project

set -e

echo "\u26a1\uFE0F Running Supabase migrations..."
supabase db push

echo "\u2705 Migrations applied successfully"
