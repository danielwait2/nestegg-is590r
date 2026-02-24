#!/bin/bash

if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
  cat <<HELP
Usage: ./scripts/run.sh [--port PORT]
Starts the Next.js dev server.
Options:
  --port PORT  Port to listen on (default: 3000)
Exit codes: 0=success, 1=failed to start
HELP
  exit 0
fi

PORT=${2:-3000}
cd /Users/danielwait/Documents/MISM1/nestegg-is590r

echo "Starting NestEgg dev server on port $PORT..." >&2
exec npm run dev -- --port "$PORT"
