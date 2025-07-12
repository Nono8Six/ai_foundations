#!/bin/bash

# Wrapper script pour le serveur MCP Supabase
# Résout le problème de npx qui ne trouve pas le binaire

# Détermine le répertoire du cache npx le plus récent
MCP_DIR=$(find ~/.npm/_npx -name "@supabase" -type d 2>/dev/null | head -1)

if [ -z "$MCP_DIR" ] || [ ! -d "$MCP_DIR" ]; then
    echo "📦 Installation du serveur MCP Supabase..." >&2
    npx -y @supabase/mcp-server-supabase@latest --version >/dev/null 2>&1
    MCP_DIR=$(find ~/.npm/_npx -name "@supabase" -type d 2>/dev/null | head -1)
fi

if [ -z "$MCP_DIR" ] || [ ! -d "$MCP_DIR" ]; then
    echo "❌ Impossible de trouver le serveur MCP Supabase" >&2
    exit 1
fi

SCRIPT_PATH="$MCP_DIR/mcp-server-supabase/dist/transports/stdio.js"

if [ ! -f "$SCRIPT_PATH" ]; then
    echo "❌ Script MCP non trouvé: $SCRIPT_PATH" >&2
    exit 1
fi

# Exécute le serveur MCP avec les arguments passés
exec node "$SCRIPT_PATH" "$@"