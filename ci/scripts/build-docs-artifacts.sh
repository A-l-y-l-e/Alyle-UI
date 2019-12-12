#!/usr/bin/env bash

set -u -e -o pipefail

yarn
yarn tools:prepare-lib
./ci/scripts/build-style-compiler.sh
node dist/@alyle/ui/style-compiler/main dist/lib
yarn build:@alyle/ui
./ci/scripts/build-style-compiler.sh
ls dist -lh