const xcode = require('xcode');
const fs = require('fs');
const path = require('path');
const packageJson = require('../package.json');
const plist = require('simple-plist');

const projectPath = 'safari/Better TweetDeck/Better TweetDeck.xcodeproj/project.pbxproj';
const safariProject = xcode.project(projectPath);

const VERSION_NUMBER = packageJson.version;

// 1. Parse the project.
safariProject.parseSync();
// 2. Grab build configurations.
const configurations = safariProject.pbxXCBuildConfigurationSection();
for (const key in configurations) {
  if (typeof configurations[key] === 'string') {
    continue;
  }

  const targetObject = configurations[key];
  const { buildSettings } = targetObject;

  // 3. If we don't have an info.plist file, nothing to do.
  if (!buildSettings.INFOPLIST_FILE) {
    continue;
  }

  // 4. Set the `MARKETING_VERSION` variable.
  buildSettings.MARKETING_VERSION = VERSION_NUMBER;

  // 5. Read the Info.plist file.
  const plistPath = path.resolve(
    __dirname,
    '..',
    'safari/Better TweetDeck',
    String(buildSettings.INFOPLIST_FILE).replace(/"/g, '')
  );
  const plistData = plist.readFileSync(plistPath);

  // 6. If the variables are already set, nothing to do.
  if (
    plistData.CFBundleShortVersionString === '$(MARKETING_VERSION)' &&
    plistData.LSApplicationCategoryType === 'public.app-category.social-networking'
  ) {
    continue;
  }

  // 7. Set the fields in the plist file.
  if (buildSettings.INFOPLIST_FILE === 'BetterTweetDeck/Info.plist') {
    plistData.LSApplicationCategoryType = 'public.app-category.social-networking';
  }
  plistData.CFBundleShortVersionString = '$(MARKETING_VERSION)';

  // 8. Write Info.plist file.
  plist.writeFileSync(plistPath, plistData);
}

// 9. Write XCode project
fs.writeFileSync(projectPath, safariProject.writeSync());
