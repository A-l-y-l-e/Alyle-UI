#!/bin/bash

export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"
export TS_NODE_COMPILER_OPTIONS='{"module": "commonjs"}'
export PATH="$PATH:$(pwd)/node_modules/.bin"
