const fs = require('fs');
const _ = require('lodash');

const packageJson = JSON.parse(fs.readFileSync(`${__dirname}/../../package.json`, 'utf8'));
const isBeta = process.env.BTD_BETA === 'true';

const iconSizes = [16, 32, 48, 96, 128, 256, 512];

const icons = _(iconSizes)
  .map((size) => {
    return {
      size,
      icon: `build/icons/icon-${size}.png`,
    };
  })
  .keyBy((i) => i.size)
  .mapValues((v) => v.icon)
  .value();

const betaIcons = _(iconSizes)
  .map((size) => {
    return {
      size,
      icon: `build/icons/icon-beta-${size}.png`,
    };
  })
  .keyBy((i) => i.size)
  .mapValues((v) => v.icon)
  .value();

const betaVersion = () => {
  const d = new Date();
  const arr = String(Math.floor(Date.now() / 1000))
    .match(/.{1,4}/g)
    .map(Number);

  return `${d.getFullYear()}.${arr.join('.')}`;
};

const urls = require('./commonHosts');

/* eslint quotes: 0 */
const common = {
  name: `${isBeta ? 'βeta' : 'Better'} TweetDeck`.trim(),
  short_name: `${isBeta ? 'βeta ' : 'Better'}TDeck`,
  version: isBeta ? betaVersion() : packageJson.extension_version,
  version_name: isBeta ? betaVersion() : packageJson.extension_version,
  manifest_version: 2,
  homepage_url: 'https://better.tw',
  content_scripts: [
    {
      matches: ['*://tweetdeck.twitter.com/*'],
      js: ['build/js/content.js'],
      css: ['build/css/index.css'],
      run_at: 'document_end',
    },
  ],
  background: {
    scripts: ['build/js/background.js'],
  },
  icons: isBeta ? betaIcons : icons,
  browser_action: {
    default_icon: {
      16: 'build/icons/toolbar-icon-16.png',
      32: 'build/icons/toolbar-icon-32.png',
    },
  },
  permissions: ['storage', 'contextMenus', ...urls],
  options_ui: {
    page: 'build/options/ui/ui.html',
    chrome_style: false,
  },
  web_accessible_resources: [
    'build/revert-dark-theme.css',
    'build/emojis/sheet_twitter_64.png',
    'build/fonts/*.*',
    'build/js/inject.js',
    'build/options/options.html',
  ],
  content_security_policy: `img-src https: data: 'self' *; default-src; connect-src * https:; style-src 'unsafe-inline'; script-src 'self';`,
};

if (process.env.NODE_ENV === 'dev') {
  common.commands = {
    _execute_page_action: {
      suggested_key: {
        default: 'Ctrl+Shift+E',
      },
    },
  };
  common.permissions.push('management');
  common.page_action = {
    default_icon: isBeta ? betaIcons : icons,
    default_title: 'Reload BTD',
  };
}

module.exports = common;
