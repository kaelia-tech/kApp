#!/bin/bash
if [[ $TRAVIS_COMMIT_MESSAGE == *"[skip ios]"* ]]
then
	echo "Skipping ios stage"
else
	source .travis.env.sh

  # Retrieve the built Web app
	aws s3 sync s3://$APP-builds/$TRAVIS_BUILD_NUMBER/dist cordova/www > /dev/null

	# Retrieve the secret files
	echo -e "machine github.com\n  login $GITHUB_TOKEN" > ~/.netrc
	git clone -b $APP https://github.com/kalisio/kdk-workspaces workspace

	# Create a custom keychain
	security create-keychain -p travis ios-build.keychain
	security default-keychain -s ios-build.keychain
	security unlock-keychain -p travis ios-build.keychain
  security set-keychain-settings -t 3600 -l ~/Library/Keychains/ios-build.keychain

	# Add certificates to keychain and allow codesign to access them
	# see: https://github.com/travis-ci/travis-ci/issues/6791#issuecomment-261215038
	security import workspace/$FLAVOR/ios/AppleWWDRCA.cer -k ~/Library/Keychains/ios-build.keychain -T /usr/bin/codesign
	security import workspace/$FLAVOR/ios/ios_distribution.cer -k ~/Library/Keychains/ios-build.keychain -T /usr/bin/codesign
	security import workspace/$FLAVOR/ios/ios_distribution.p12 -k ~/Library/Keychains/ios-build.keychain -P $APPLE_KEY_PASSWORD -T /usr/bin/codesign

	# see: https://docs.travis-ci.com/user/common-build-problems/#mac-macos-sierra-1012-code-signing-errors
  security set-key-partition-list -S apple-tool:,apple: -s -k travis ios-build.keychain

	# Install the required secret files requied to sign the app
	cp workspace/$FLAVOR/ios/build.json cordova/.
	mkdir -p ~/Library/MobileDevice/Provisioning\ Profiles
	cp workspace/$FLAVOR/ios/*.mobileprovision ~/Library/MobileDevice/Provisioning\ Profiles/

	# Build the app
	npm run cordova:build:ios
	if [ $? -ne 0 ]; then
		exit 1
	fi

  # Deploy the IPA to the AppleStore
	#ALTOOL="/Applications/Xcode.app/Contents/Applications/Application Loader.app/Contents/Frameworks/ITunesSoftwareService.framework/Support/altool"
	# "$ALTOOL" --upload-app -f "./cordova/platforms/ios/build/device/kApp.ipa" -u "$APPLE_ID" -p "$APPLE_APP_PASSWORD"
	/usr/libexec/PlistBuddy -c "Set :CFBundleVersion $TRAVIS_BUILD_NUMBER" "${PROJECT_DIR}/${INFOPLIST_FILE}"
	#/usr/libexec/PlistBuddy -c "Set :CFBundleVersion $TRAVIS_BUILD_NUMBER" "$PRODUCT_SETTINGS_PATH"

	/Applications/Xcode.app/Contents/Applications/Application\ Loader.app/Contents/Frameworks/ITunesSoftwareService.framework/Support/altool --upload-app -f "./cordova/platforms/ios/build/device/kApp.ipa" -u "$APPLE_ID" -p "$APPLE_APP_PASSWORD"
	#if [ $? -ne 0 ]; then
	#	exit 1
	#fi

	# Backup the ios build to S3
	aws s3 sync cordova/platforms/ios/build/device s3://kapp-builds/$TRAVIS_BUILD_NUMBER/ios > /dev/null
	if [ $? -eq 1 ]; then
		exit 1
	fi
fi
