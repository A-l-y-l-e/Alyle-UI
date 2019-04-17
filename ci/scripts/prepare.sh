#!/bin/bash

set -e

echo github
COMMIT_AUTHOR_NAME=$(git --no-pager show -s --format='%an' HEAD)
COMMIT_AUTHOR_EMAIL=$(git --no-pager show -s --format='%ae' HEAD)
echo "https://${GITHUB_USER_TOKEN}:@github.com" > .git/credentials
git config --global user.name "${COMMIT_AUTHOR_NAME}"
git config --global user.email "${COMMIT_AUTHOR_EMAIL}"
git config --global credential.helper "store --file=.git/credentials"
echo npm
echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" >> ~/.npmrc
npm config set @alyle:registry https://registry.npmjs.org
git clone https://github.com/A-l-y-l-e/alyle-ui-builds.git --depth 3
git clone https://github.com/A-l-y-l-e/alyle-ui-api.git --depth 3
git clone https://github.com/A-l-y-l-e/alyle-ui-docs-content.git --depth 3
yarn build:tools
yarn tools:prepare-lib