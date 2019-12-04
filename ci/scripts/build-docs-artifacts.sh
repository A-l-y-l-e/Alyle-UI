#!/usr/bin/env bash

set -u -e -o pipefail

yarn
yarn tools:prepare-lib
./ci/scripts/build-style-compiler.sh
node dist/@alyle/style-compiler/main dist/lib
yarn build:@alyle/ui
export CI_COMMIT_MESSAGE=$(git show -s --format=%s)
export CI_COMMIT_SHA=$(git rev-parse HEAD)
export CI_BRANCH=$(git rev-parse --abbrev-ref HEAD)
gzip -v -k dist/bundle.js
ls dist -lh