#!/bin/bash
source .travis.env.sh

#
# Provision the required files
#
travis_fold start "provision"

# Install the kdk if required
git clone https://github.com/kalisio/kdk.git && cd kdk && yarn 
node . $TRAVIS_BUILD_DIR/workspace/${FLAVOR}/${APP}.js --clone ${BRANCH}
node . $TRAVIS_BUILD_DIR/workspace/${FLAVOR}/${APP}.js --install
node . $TRAVIS_BUILD_DIR/workspace/${FLAVOR}/${APP}.js --link
cd $APP

travis_fold end "provision"

#
# Build the app
#
travis_fold start "build"

# Build the api
cd api && yarn build
ERROR_CODE=$?
if [ $ERROR_CODE -eq 1 ]; then
	echo "Building the api failed [error: $ERROR_CODE]"
	exit 1
fi
# Build the client
cd .. && yarn build > build.log 2>&1 && tail -n 24 build.log 
ERROR_CODE=$?
if [ $ERROR_CODE -eq 1 ]; then
	echo "Building the client image has failed [error: $ERROR_CODE]"
	exit 1
fi
# Build the docker image
cd .. && docker build --build-arg APP=$APP --build-arg FLAVOR=$FLAVOR --build-arg BUILD_NUMBER=$BUILD_NUMBER -t kalisio/$APP:$VERSION_TAG . 
ERROR_CODE=$?
if [ $ERROR_CODE -eq 1 ]; then
	echo "Building the docker image has failed [error: $ERROR_CODE]"
	exit 1
fi

travis_fold end "build"

#
# Deploy the app
#
travis_fold start "deploy"

# Push the docker image to the hub
docker login -u="$DOCKER_USER" -p="$DOCKER_PASSWORD"
docker push kalisio/$APP:$VERSION_TAG
ERROR_CODE=$?
if [ $ERROR_CODE -eq 1 ]; then
	echo "Pushing the docker image has failed [error: $ERROR_CODE]"
	exit 1
fi

# Copy the required keys and update the mode
cp workspace/$FLAVOR/*.pem ~/.ssh/.
for KEY in `ls ~/.ssh/*.pem`; do
	chmod 600 $KEY
done

# Copy the ssh config file
# Note: it does not seem necessary to restart the service (service sshd reload)
cp workspace/$FLAVOR/ssh.config ~/.ssh/config

# Deploy the stack
ssh REMOTE_SERVER "cd kargo; ./kargo remove $APP; ./kargo deploy $APP"

travis_fold end "deploy"
