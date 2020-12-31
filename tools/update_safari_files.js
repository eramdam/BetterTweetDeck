const xcode = require('xcode');
const fs = require('fs');
const path = require('path');
const packageJson = require('../package.json');
const plist = require('simple-plist');

const projectPath = 'safari/BetterTweetDeck/BetterTweetDeck.xcodeproj/project.pbxproj';
const safariProject = xcode.project(projectPath);

const VERSION_NUMBER = packageJson.version;

safariProject.parseSync();
const configurations = safariProject.pbxXCBuildConfigurationSection();
for (const key in configurations) {
  if (typeof configurations[key] === 'string') {
    continue;
  }

  const targetObject = configurations[key];
  const { buildSettings } = targetObject;

  if (!buildSettings.INFOPLIST_FILE) {
    continue;
  }

  buildSettings.MARKETING_VERSION = VERSION_NUMBER;

  const plistPath = path.resolve(
    __dirname,
    '..',
    'safari/BetterTweetDeck',
    String(buildSettings.INFOPLIST_FILE).replace(/"/g, '')
  );

  const plistData = plist.readFileSync(plistPath);

  if (
    plistData.CFBundleShortVersionString === '$(MARKETING_VERSION)' &&
    plistData.LSApplicationCategoryType === 'public.app-category.social-networking'
  ) {
    continue;
  }

  plistData.LSApplicationCategoryType = 'public.app-category.social-networking';
  plistData.CFBundleShortVersionString = '$(MARKETING_VERSION)';
  plist.writeFileSync(plistPath, plistData);
}

fs.writeFileSync(projectPath, safariProject.writeSync());
