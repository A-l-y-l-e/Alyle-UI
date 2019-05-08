#!/bin/bash

set -e

yarn build:tools

git clone https://github.com/A-l-y-l-e/alyle-ui-docs-content.git --depth 3 repos/alyle-ui-docs-content
COMMIT_AUTHOR_NAME=$(git --no-pager show -s --format='%an' HEAD)
COMMIT_AUTHOR_EMAIL=$(git --no-pager show -s --format='%ae' HEAD)

git config --global user.name "${COMMIT_AUTHOR_NAME}"
git config --global user.email "${COMMIT_AUTHOR_EMAIL}"

echo "https://${GITHUB_USER_TOKEN}:@github.com" > ~/git-credentials
git config --global credential.helper "store --file=$HOME/git-credentials"
echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" >> ~/.npmrc
npm config set @alyle:registry https://registry.npmjs.org

node dist/tools/release