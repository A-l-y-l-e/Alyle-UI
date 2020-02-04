#!/usr/bin/env bash

set -e -o pipefail

. ci/setup.sh

which ts-node
export MSG=$(ts-node tools/src/commit-msg)
export SHA=$(node -pe 'const {env}=process;env.SYSTEM_PULLREQUEST_SOURCECOMMITID || env.BUILD_SOURCEVERSION')

echo $MSG.$SHA