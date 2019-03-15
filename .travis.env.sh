#!/bin/bash

# Define required environement variobles according the flavor
if [[ $TRAVIS_BRANCH == "master" ]]
then
	export FLAVOR=dev
	export PACKAGE_ID=com.${AUTHOR:-kalisio}.$APP.dev
fi
if [[ $TRAVIS_BRANCH == "test" ]]
then
	export FLAVOR=test
	export PACKAGE_ID=com.${AUTHOR:-kalisio}.$APP.test
fi
if [[ -n "$TRAVIS_TAG" ]]
then
	export FLAVOR=prod
	export PACKAGE_ID=com.${AUTHOR:-kalisio}.$APP
fi

# Exports addtionnal variables
export VERSION=$(node -p -e "require('./package.json').version")
export BUILDS_BUCKET=$APP-builds

# Retrieve the environment variables stored in the workspace
echo -e "machine github.com\n  login $GITHUB_TOKEN" > ~/.netrc
git clone -b $APP https://github.com/kalisio/kdk-workspaces workspace
cp workspace/common/.env .env
if [ -f workspace/$FLAVOR/.env ]
then
	cat workspace/$FLAVOR/.env >> .env
fi

# Add computed variables
echo "APP=$APP" >> .env
echo "COMPOSE_PROJECT_NAME=$APP" >> .env
echo "NODE_APP_INSTANCE=$FLAVOR" >> .env
echo "VERSION=$VERSION" >> .env
echo "VERSION_TAG=$VERSION-$FLAVOR" >> .env
echo "BUILD_NUMBER=$TRAVIS_BUILD_NUMBER" >> .env

echo .env
set -a
. .env
set +a

# Retrieve ci environement variables
cp workspace/common/.travis.env .travis.env
if [ -f workspace/$FLAVOR/.travis.env ]
then
	cat workspace/$FLAVOR/.travis.env >> .travis.env
fi

echo .travis.env
set -a
. .travis.env
set +a

