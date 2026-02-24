#!/bin/bash
set -e

if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
  cat <<HELP
Usage: ./scripts/test.sh [--unit-only] [--integration-only]
Runs test suite. Sources .testEnvVars if present.
Options:
  --unit-only         Run only unit tests
  --integration-only  Run only integration tests
Exit codes: 0=all pass, 1=tests failed, 2=misuse
HELP
  exit 0
fi

cd /Users/danielwait/Documents/MISM1/nestegg-is590r

# Source test environment variables if available
if [ -f .testEnvVars ]; then
  source .testEnvVars
  echo "Loaded .testEnvVars" >&2
fi

UNIT_ONLY=false
INTEGRATION_ONLY=false

for arg in "$@"; do
  case $arg in
    --unit-only) UNIT_ONLY=true ;;
    --integration-only) INTEGRATION_ONLY=true ;;
    *) echo '{"status":"error","message":"Unknown argument: '"$arg"'"}' >&2; exit 2 ;;
  esac
done

PASS=true

if [ "$INTEGRATION_ONLY" = false ]; then
  echo "Running unit tests..." >&2
  if npm test -- --run 2>&1; then
    echo '{"status":"pass","suite":"unit"}' >&2
  else
    echo '{"status":"fail","suite":"unit"}' >&2
    PASS=false
  fi
fi

if [ "$UNIT_ONLY" = false ]; then
  if [ -f ./scripts/test-integration.sh ]; then
    echo "Running integration tests..." >&2
    if bash ./scripts/test-integration.sh 2>&1; then
      echo '{"status":"pass","suite":"integration"}' >&2
    else
      echo '{"status":"fail","suite":"integration"}' >&2
      PASS=false
    fi
  else
    echo "No integration tests found, skipping." >&2
  fi
fi

if [ "$PASS" = true ]; then
  echo '{"status":"success","message":"All tests passed"}'
  exit 0
else
  echo '{"status":"error","message":"One or more test suites failed"}' >&2
  exit 1
fi
