#!/usr/bin/env bash

set -u -e -o pipefail
source ./ci/setup.sh

export MSG=$(ts-node tools/src/commit-msg)

yarn
yarn tools:prepare-lib
ts-node tools/*/bump-version.ts
./ci/scripts/build-style-compiler.sh
node dist/@alyle/ui/style-compiler/main dist/lib
yarn build:@alyle/ui
./ci/scripts/build-style-compiler.sh
ls dist -lh