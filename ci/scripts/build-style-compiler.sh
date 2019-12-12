#!/usr/bin/env bash

set -u -e -o pipefail

readonly pkg_dir=dist/@alyle/ui/style-compiler
readonly lib_dir=dist/lib/style-compiler

rm -rf ${pkg_dir}
mkdir -p ${pkg_dir}
yarn tsc -p ${lib_dir}/tsconfig-build.json

mv ${pkg_dir}/src/* ${pkg_dir}
cp -r ${pkg_dir}/style-compiler/** ${pkg_dir}/

sed -i -e 's/..\/src\/parse\"/.\/parse\"/' ${pkg_dir}/compiler.js
rm -rf ${pkg_dir}/color
rm -rf ${pkg_dir}/src
rm -rf ${pkg_dir}/style-compiler
