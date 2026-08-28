#!/usr/bin/env bash
#
# Refuse to publish a build that still contains TODO placeholders. Spec §8:
# "No TODO placeholders remaining in published output."
#
# TODO markers are intentional and correct during authoring (spec §3.1 requires
# them in place of invented content). This script is the gate that stops one
# from reaching production.
#
#   ./scripts/check-todos.sh

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST="$ROOT/dist"

if [ ! -d "$DIST" ]; then
  echo "error: no dist/ directory. Run 'npm run build' first." >&2
  exit 1
fi

if grep -rIl --exclude='*.map' 'TODO' "$DIST" >/dev/null 2>&1; then
  echo "FAIL: TODO placeholders found in the built output:" >&2
  echo >&2
  grep -rIn --exclude='*.map' -o '.\{0,60\}TODO.\{0,60\}' "$DIST" | sed 's/^/  /' >&2
  echo >&2
  echo "Supply the missing content, or remove the section, before deploying." >&2
  exit 1
fi

echo "PASS: no TODO placeholders in dist/."
