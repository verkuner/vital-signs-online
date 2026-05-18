#!/usr/bin/env bash
# Build the frontend and rsync it to the production VM, then reload nginx.
# Override defaults via env vars: SSH_KEY, HOST, REMOTE_DIR.

set -euo pipefail

SSH_KEY="${SSH_KEY:-$HOME/.ssh/vital-api}"
HOST="${HOST:-ubuntu@101.42.46.218}"
REMOTE_DIR="${REMOTE_DIR:-/var/www/vital-signs-online}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

echo ">> Building frontend..."
npm run build

echo ">> Syncing dist/ to $HOST:$REMOTE_DIR ..."
rsync -avz --delete -e "ssh -i $SSH_KEY" dist/ "$HOST:$REMOTE_DIR/"

echo ">> Reloading nginx on $HOST ..."
ssh -i "$SSH_KEY" "$HOST" "sudo nginx -t && sudo systemctl reload nginx"

echo ">> Done. http://${HOST#*@}/"
