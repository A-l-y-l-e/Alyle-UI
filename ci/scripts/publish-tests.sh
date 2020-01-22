#!/usr/bin/env bash

set -e -o pipefail

source ./ci/setup.sh
mkdir dist -p
ava --tap | txunit > dist/test-results.xml
