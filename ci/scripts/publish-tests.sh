#!/usr/bin/env bash

set -e -o pipefail


TS_NODE_COMPILER_OPTIONS='{"module":"commonjs"}' node_modules/.bin/ava --tap | txunit > dist/test-results.xml
