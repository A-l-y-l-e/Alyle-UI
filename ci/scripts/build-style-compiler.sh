#!/usr/bin/env bash

set -u -e -o pipefail

readonly pkg_dir=dist/@alyle/style-compiler
readonly lib_dir=dist/lib/style-compiler

yarn tsc -p ${lib_dir}/tsconfig-build.json

mv ${pkg_dir}/src/* ${pkg_dir}
mv ${pkg_dir}/style-compiler/** ${pkg_dir}/

sed -i -e 's/..\/src\/parse\"/.\/parse/' ${pkg_dir}/compiler.js
rm -rf ${pkg_dir}/color
rm -rf ${pkg_dir}/src
rm -rf ${pkg_dir}/style-compiler