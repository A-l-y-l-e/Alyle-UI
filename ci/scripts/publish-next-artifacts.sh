#!/bin/bash

set -e

git clone https://github.com/A-l-y-l-e/alyle-ui-builds.git
git clone https://github.com/A-l-y-l-e/Alyle-UI.git

PACKAGE_VERSION=$(node -p -e "require('./alyle-ui-pkg/package.json').version")

cd Alyle-UI

echo $PACKAGE_VERSION

# github
COMMIT_MESSAGE=$(git show -s --format=%s)
COMMIT_SHA=$(git rev-parse HEAD)
BRANCH=$(git rev-parse --abbrev-ref HEAD)

COMMIT_AUTHOR_NAME=$(git --no-pager show -s --format='%an' HEAD)
COMMIT_AUTHOR_EMAIL=$(git --no-pager show -s --format='%ae' HEAD)

cd ..

echo "https://$GITHUB_USER_TOKEN:@github.com" > git-credentials

cp -r alyle-ui-pkg/* alyle-ui-builds

cd alyle-ui-builds

CURRENT_VERSION=$(git describe --abbrev=0 --tags)

git config user.name "${COMMIT_AUTHOR_NAME}"
git config user.email "${COMMIT_AUTHOR_EMAIL}"
git config credential.helper "store --file=../git-credentials"

git add -A
git commit -m "${COMMIT_MESSAGE}" -m "${COMMIT_SHA}"

if [ $CURRENT_VERSION != $PACKAGE_VERSION ]
then
  git tag $PACKAGE_VERSION
fi

git push origin master --tags
