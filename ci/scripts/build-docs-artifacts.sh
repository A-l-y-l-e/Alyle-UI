#!/usr/bin/env bash

set -u -e -o pipefail
source ./ci/setup.sh

yarn
yarn tools:prepare-lib

./ci/scripts/build-style-compiler.sh
node dist/@alyle/ui/style-compiler/main dist/lib

yarn ng-packagr --config dist/lib/tsconfig.lib.json -p dist/lib/ng-package.json
yarn build:schematics
node --no-warnings=ExperimentalWarning --loader ts-node/esm/transpile-only tools/src/build-lib.ts
node --no-warnings=ExperimentalWarning --loader ts-node/esm/transpile-only tools/src/copy-readme.ts

./ci/scripts/build-style-compiler.sh

node --no-warnings=ExperimentalWarning --loader ts-node/esm/transpile-only tools/*/fix-style-compiler.ts
ls dist -lh