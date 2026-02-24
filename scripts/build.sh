#!/bin/bash
set -e

if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
  cat <<HELP
Usage: ./scripts/build.sh
Runs the Next.js production build.
Exit codes: 0=success, 1=build failed
HELP
  exit 0
fi

cd /Users/danielwait/Documents/MISM1/nestegg-is590r

echo "Building NestEgg..." >&2
if npm run build 2>&1; then
  echo '{"status":"success","script":"build"}'
  exit 0
else
  echo '{"status":"error","script":"build","message":"Build failed"}' >&2
  exit 1
fi
