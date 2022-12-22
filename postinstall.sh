set -e

. ./init.sh
ts-node --esm tools/update-schematics.ts
cd tools && yarn