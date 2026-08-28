#!/usr/bin/env bash
# Pushes an updated resume PDF to the S3 bucket resume.maxwellkendall.com serves from.
#
# Source of truth is this Google Doc (export manually as PDF before running):
# https://docs.google.com/document/d/1cbsJraw4UAU6v2vMiuYhmSRUzKWQUXuOgBNpJg6S0oQ/edit
# (File > Download > PDF Document)
#
# Usage:
#   scripts/update-resume.sh [path/to/resume.pdf]
#
# With no argument, uses the most recently downloaded PDF in ~/Downloads
# whose name contains "resume" (case-insensitive).

set -euo pipefail

BUCKET_KEY="s3://mnk-resume/maxwell_kendall_resume.pdf"

pdf_path="${1:-}"

if [[ -z "$pdf_path" ]]; then
  pdf_path=$(find ~/Downloads -maxdepth 1 -iname "*resume*.pdf" -print0 \
    | xargs -0 ls -t 2>/dev/null | head -n 1)
fi

if [[ -z "$pdf_path" || ! -f "$pdf_path" ]]; then
  echo "No resume PDF found. Pass a path explicitly:" >&2
  echo "  scripts/update-resume.sh ~/Downloads/your-resume.pdf" >&2
  exit 1
fi

echo "Uploading: $pdf_path"
echo "       to: $BUCKET_KEY"
aws s3 cp "$pdf_path" "$BUCKET_KEY"

echo
echo "Done. Current object:"
aws s3 ls "$BUCKET_KEY"
