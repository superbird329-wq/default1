#!/usr/bin/env bash
#
# Heuristic scan for confidential client information. Spec §3.2.
#
#   ./scripts/check-confidential.sh            scan the working tree
#   ./scripts/check-confidential.sh --history  also scan the full git history
#
# This is a safety net, NOT a substitute for reading what you wrote. It looks
# for the shapes that client information takes — street addresses, case and
# permit numbers, internal project numbers — but it cannot recognise a client's
# company name. That judgement stays with the author.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

FOUND=0

report() {
  FOUND=1
  echo "  [$1] $2"
}

# Street addresses: a number followed by a street-type word.
ADDRESS='[0-9]{1,5}[[:space:]]+([A-Z][a-zA-Z]+[[:space:]]+){1,3}(St|Street|Ave|Avenue|Rd|Road|Dr|Drive|Ln|Lane|Blvd|Boulevard|Ct|Court|Pl|Place|Hwy|Highway|Tpke|Turnpike)\b'
# Case / permit / docket / job numbers.
CASENUM='(Case|Docket|Permit|Application|Job|Project)[[:space:]#:.-]*(No\.?|Number|#)?[[:space:]]*[0-9]{3,}'
# Internal project numbers in the common NN-NNN form.
PROJNUM='\b[0-9]{2}-[0-9]{3,4}\b'
# Phone numbers. Vin's own published number lives in src/data/site.ts by design,
# so that one file is exempt from this pattern only. A phone number ANYWHERE
# else is flagged: spec §3.2 forbids the number of any person other than Vin,
# and a client's number appearing in a case study is exactly what this catches.
PHONE='\(?[0-9]{3}\)?[-. ][0-9]{3}[-. ][0-9]{4}'
PHONE_EXEMPT='src/data/site.ts'

# Only src/ and public/ are scanned: that is where every published word and
# asset comes from. README.md and SPEC.md are deliberately excluded because they
# contain anti-examples ("do not write ...") that are supposed to look like the
# thing being forbidden.
SEARCH_PATHS=(src public)

echo "Scanning working tree for confidential patterns..."
echo

for spec in "ADDRESS:$ADDRESS" "CASE/PERMIT NUMBER:$CASENUM" "PROJECT NUMBER:$PROJNUM" "PHONE:$PHONE"; do
  name="${spec%%:*}"
  pattern="${spec#*:}"
  while IFS= read -r line; do
    [ -z "$line" ] && continue
    # Vin's own published number is allowed in, and only in, the site data file.
    if [ "$name" = "PHONE" ] && [ "${line#"$PHONE_EXEMPT"}" != "$line" ]; then
      continue
    fi
    report "$name" "$line"
  done < <(grep -rInE --exclude-dir=node_modules --exclude='*.woff2' \
             "$pattern" "${SEARCH_PATHS[@]}" 2>/dev/null || true)
done

if [ "${1:-}" = "--history" ]; then
  echo
  echo "Scanning git history..."
  echo
  for spec in "ADDRESS:$ADDRESS" "CASE/PERMIT NUMBER:$CASENUM" "PROJECT NUMBER:$PROJNUM"; do
    name="${spec%%:*}"
    pattern="${spec#*:}"
    while IFS= read -r line; do
      [ -n "$line" ] && report "history/$name" "$line"
    done < <(git grep -InE "$pattern" $(git rev-list --all) -- src public 2>/dev/null | head -40 || true)
  done
fi

echo
if [ "$FOUND" -eq 1 ]; then
  echo "REVIEW REQUIRED: the patterns above may be confidential client information." >&2
  echo "If any of it is, it must be removed from the working tree AND from history" >&2
  echo "before this is pushed to a public repository." >&2
  exit 1
fi

echo "PASS: no confidential-looking patterns found."
echo "Remember: this cannot detect client company names. Read your own content."
