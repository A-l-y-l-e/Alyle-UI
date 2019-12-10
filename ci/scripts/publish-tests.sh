#!/usr/bin/env bash

set -e -o pipefail

source ./ci/setup.sh
node_modules/.bin/ava --tap | txunit > dist/test-results.xml
