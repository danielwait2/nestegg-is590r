#!/bin/bash
set -e

if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
  cat <<HELP
Usage: ./scripts/lint.sh
Runs ESLint on the project.
Exit codes: 0=no issues, 1=lint errors
HELP
  exit 0
fi

cd /Users/danielwait/Documents/MISM1/nestegg-is590r

echo "Running linter..." >&2
if npm run lint 2>&1; then
  echo '{"status":"success","script":"lint"}'
  exit 0
else
  echo '{"status":"error","script":"lint","message":"Lint errors found"}' >&2
  exit 1
fi
