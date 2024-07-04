set -e

. ./init.sh
node --no-warnings=ExperimentalWarning --loader ts-node/esm/transpile-only tools/update-schematics.ts
cd tools && yarn