set -e

. ./init.sh
ts-node tools/update-schematics.ts
cd tools && yarn