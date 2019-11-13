#!/usr/bin/env bash

set -e -o pipefail

export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"

TS_NODE_COMPILER_OPTIONS='{"module":"commonjs"}' node_modules/.bin/ava --tap | txunit > dist/test-results.xml
