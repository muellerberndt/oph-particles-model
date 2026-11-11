#!/bin/sh
# Publish site/ as a single-commit gh-pages branch (no history of the large run files). The previous gh-pages commit is
# fetched first, so unchanged files are not uploaded again.
set -e
cd "$(dirname "$0")/../site"
rm -rf .git && git init -q -b gh-pages
git remote add origin git@github.com:muellerberndt/oph-particles-model.git
git fetch -q --depth 1 origin gh-pages || true
git add -A && git commit -q -m "Site build $(date -u +%Y-%m-%dT%H:%MZ)"
git push -f origin gh-pages
rm -rf .git
