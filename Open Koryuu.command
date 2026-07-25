#!/bin/zsh
# Double-click this file to open the Koryuu website locally.
# It starts the dev server, so it always shows the LATEST version of the site —
# including any updates made since you last opened it. Hot-reloads on changes.

set -e

cd "$(dirname "$0")"

PORT="${KORYUU_DEV_PORT:-3200}"
URL="http://localhost:${PORT}"

if ! command -v npm >/dev/null 2>&1; then
  echo "ERROR: npm is not installed or is not available in PATH."
  echo "Install Node.js from https://nodejs.org, then run this file again."
  echo ""
  echo "Press any key to close this window."
  read -k1 -s
  exit 1
fi

# Install dependencies on first run (or after they've been removed).
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies (first run only — this can take a minute)..."
  npm install
fi

echo ""
echo "  交流  Koryuu — local website"
echo "  ─────────────────────────────────"
echo "  Project: $(pwd)"
echo "  URL:     ${URL}"
echo ""
echo "  Your browser will open in a moment."
echo "  Edits to the site appear here automatically (live reload)."
echo ""
echo "  Leave this window open while viewing."
echo "  Press Ctrl+C here to stop the server."
echo ""

# Open the browser ~2s after the server starts.
( sleep 2 && open "${URL}" >/dev/null 2>&1 ) &

exec npm run dev -- --port "${PORT}"
