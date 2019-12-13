#!/usr/bin/env bash

set -u -e -o pipefail
source ./ci/setup.sh

yarn
export MSG=$(ts-node tools/src/commit-msg)
echo $MSG
ts-node tools/*/bump-version.ts
yarn tools:prepare-lib
./ci/scripts/build-style-compiler.sh
node dist/@alyle/ui/style-compiler/main dist/lib
yarn build:@alyle/ui
./ci/scripts/build-style-compiler.sh
ts-node tools/*/fix-style-compiler.ts
ls dist -lh