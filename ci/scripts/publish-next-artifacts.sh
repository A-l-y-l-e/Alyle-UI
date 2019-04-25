#!/bin/bash

set -e

git clone https://github.com/A-l-y-l-e/alyle-ui-builds.git
git clone https://github.com/A-l-y-l-e/Alyle-UI.git

PACKAGE_VERSION=$(node -p -e "require('./alyle-ui-pkg/package.json').version")

cd Alyle-UI

echo "Package version: ${PACKAGE_VERSION}"

# github
COMMIT_MESSAGE=$(git show -s --format=%s)
COMMIT_SHA=$(git rev-parse HEAD)
BRANCH=$(git rev-parse --abbrev-ref HEAD)

COMMIT_AUTHOR_NAME=$(git --no-pager show -s --format='%an' HEAD)
COMMIT_AUTHOR_EMAIL=$(git --no-pager show -s --format='%ae' HEAD)

cd ..

echo "https://$GITHUB_USER_TOKEN:@github.com" > git-credentials

rm -rf ./alyle-ui-builds/*
cp -r alyle-ui-pkg/* alyle-ui-builds

cd alyle-ui-builds

CURRENT_VERSION=$(git describe --abbrev=0 --tags)

git config user.name "${COMMIT_AUTHOR_NAME}"
git config user.email "${COMMIT_AUTHOR_EMAIL}"
git config credential.helper "store --file=../git-credentials"

echo "Commit"
git add -A
git commit -m "${COMMIT_MESSAGE}" -m "${COMMIT_SHA}"

echo "Tag"
if [ $CURRENT_VERSION != $PACKAGE_VERSION ]
then
  git tag $PACKAGE_VERSION
fi

echo "Push"

git push origin master --tags