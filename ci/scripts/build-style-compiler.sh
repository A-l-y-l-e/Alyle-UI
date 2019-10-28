#!/usr/bin/env bash

set -u -e -o pipefail

readonly pkg_dir=dist/@alyle/ui/style-compiler
readonly lib_dir=dist/lib/style-compiler

yarn tsc -p dist/lib/style-compiler/tsconfig-build.json

mv ${pkg_dir}/src/* ${pkg_dir}
mv ${pkg_dir}/style-compiler/** ${pkg_dir}/

sed -i -e 's/@alyle\/ui\"/.\/parse.js/' ${pkg_dir}/index.js
rm -rf ${pkg_dir}/color
rm -rf ${pkg_dir}/src
rm -rf ${pkg_dir}/style-compiler
