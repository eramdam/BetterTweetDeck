const xcode = require('xcode');
const {DateTime} = require('luxon');
const fs = require('fs');
const path = require('path');
const packageJson = require('../package.json');
const plist = require('simple-plist');

const projectPath =
  'safari/Better TweetDeck for Safari/BetterTDeck for TweetDeck.xcodeproj/project.pbxproj';
const safariProject = xcode.project(projectPath);

const VERSION_NUMBER = packageJson.version;

// Parse the project.
safariProject.parseSync();
console.log('test');
// Grab build configurations.
const configurations = safariProject.pbxXCBuildConfigurationSection();
for (const key in configurations) {
  if (typeof configurations[key] === 'string') {
    continue;
  }

  const targetObject = configurations[key];
  const {buildSettings} = targetObject;

  // If we don't have an info.plist file, nothing to do.
  if (!buildSettings.INFOPLIST_FILE) {
    continue;
  }

  // Set the `MARKETING_VERSION` variable.
  buildSettings.MARKETING_VERSION = VERSION_NUMBER;

  // Read the Info.plist file.
  const plistPath = path.resolve(
    __dirname,
    '..',
    'safari/Better TweetDeck for Safari',
    String(buildSettings.INFOPLIST_FILE).replace(/"/g, '')
  );
  const plistData = plist.readFileSync(plistPath);
  // Set the fields in the plist file.
  if (buildSettings.INFOPLIST_FILE === 'BetterTweetDeck/Info.plist') {
    plistData.LSApplicationCategoryType = 'public.app-category.social-networking';
  }
  plistData.CFBundleShortVersionString = '$(MARKETING_VERSION)';
  plistData.CFBundleVersion = DateTime.local().toFormat('yyMMddHHmm');

  // Write Info.plist file.
  plist.writeFileSync(plistPath, plistData);
}

// Write XCode project
fs.writeFileSync(projectPath, safariProject.writeSync());
