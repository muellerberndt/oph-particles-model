#!/bin/sh
# Publish site/ as a single-commit gh-pages branch (no history of the large run files).
set -e
cd "$(dirname "$0")/../site"
rm -rf .git && git init -q -b gh-pages && git add -A && git commit -q -m "Site build $(date -u +%Y-%m-%dT%H:%MZ)"
git push -f git@github.com:muellerberndt/oph-particles-model.git gh-pages
rm -rf .git
