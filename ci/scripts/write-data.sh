#!/usr/bin/env bash

set -e -o pipefail

. ci/setup.sh

which ts-node
export MSG=$(node --no-warnings=ExperimentalWarning --loader ts-node/esm/transpile-only tools/src/commit-msg)
export SHA=$(node -pe 'const {env}=process;env.SYSTEM_PULLREQUEST_SOURCECOMMITID || env.BUILD_SOURCEVERSION')

echo $MSG.$SHA