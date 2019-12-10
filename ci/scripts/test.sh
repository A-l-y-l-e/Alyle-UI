#!/usr/bin/env bash

set -e -o pipefail
source ./ci/setup.sh

if [ -z ${CI+x} ]; then
   node_modules/.bin/ava --watch
else
   node_modules/.bin/ava
fi