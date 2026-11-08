#!/usr/bin/env bash
# Regeneration guard: fails if an external regeneration of the site dropped
# one of the pieces it has repeatedly lost. See CLAUDE.md -> "Regeneration Safety".
# Runs in CI (.github/workflows/regen-guard.yml) and locally:
#   bash scripts/check-regeneration.sh
set -u
cd "$(dirname "$0")/.."

fail=0

# check <label> <file> <extended-regex> <expected match-line count>
check() {
  local label=$1 file=$2 pattern=$3 want=$4 got
  if [ ! -f "$file" ]; then
    got="missing file"
  else
    got=$(grep -c -E "$pattern" "$file") || true
  fi
  if [ "$got" = "$want" ]; then
    echo "PASS  $label ($file: $got)"
  else
    echo "FAIL  $label ($file: got $got, want $want)"
    [ -n "${GITHUB_ACTIONS:-}" ] && echo "::error file=$file::Regeneration guard: $label - got $got, want $want"
    fail=1
  fi
}

check "i18n runtime (getCurrentLanguage)"    js/translations.js 'function getCurrentLanguage'   1
check "reCAPTCHA loader (api or enterprise)" contact.html       'recaptcha/(api|enterprise)\.js' 1
check "footer.contact_us in en/fr/de"        js/translations.js 'contact_us:'                   3

if [ "$fail" -ne 0 ]; then
  echo "Regeneration guard FAILED: restore the missing pieces (CLAUDE.md -> Regeneration Safety)."
fi
exit "$fail"
