#!/usr/bin/env bash

set -e -o pipefail

if [ -z ${CI+x} ]; then
   TS_NODE_COMPILER_OPTIONS='{"module":"commonjs"}' node_modules/.bin/ava --watch
else
   TS_NODE_COMPILER_OPTIONS='{"module":"commonjs"}' node_modules/.bin/ava
fi