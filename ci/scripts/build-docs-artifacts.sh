#!/usr/bin/env bash

set -u -e -o pipefail
source ./ci/setup.sh

yarn
yarn tools:prepare-lib

./ci/scripts/build-style-compiler.sh
node dist/@alyle/ui/style-compiler/main dist/lib

yarn ng-packagr -p dist/lib/ng-package.json
yarn build:schematics
ts-node tools/src/build-lib
ts-node tools/src/copy-readme

./ci/scripts/build-style-compiler.sh

ts-node tools/*/fix-style-compiler.ts
ls dist -lh