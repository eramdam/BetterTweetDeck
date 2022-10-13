const config = require('config');
const {commonHosts} = require('./commonHosts');
const _ = require('lodash');
const packageJson = require('../../package.json');

const iconSizes = [16, 32, 48, 96, 128, 256, 512];

const icons = _(iconSizes)
  .map((size) => {
    return {
      size,
      icon: `build/assets/icons/icon-${size}.png`,
    };
  })
  .keyBy((i) => i.size)
  .mapValues((v) => v.icon)
  .value();

module.exports = {
  name: 'Better TweetDeck',
  description: 'Take TweetDeck to the next level!',
  short_name: 'Better TweetDeck',
  default_locale: 'en',
  version: packageJson.version,
  manifest_version: 2,
  icons,
  content_scripts: [
    {
      matches: ['*://tweetdeck.twitter.com/*'],
      js: ['build/content.js'],
      run_at: 'document_end',
    },
  ],
  background: {
    scripts: ['background.js'],
    persistent: false,
  },
  options_ui: {
    page: 'build/options/ui.html',
    chrome_style: false,
  },
  browser_specific_settings: {
    gecko: {
      id: config.get('FirefoxId'),
      strict_min_version: '78.0',
    },
    safari: {
      strict_min_version: '15.4',
    },
  },
  web_accessible_resources: ['build/inject.js', '*.png', 'build/emoji-sheet-64.png'],
  permissions: ['storage', 'contextMenus', 'notifications', ...commonHosts],
  content_security_policy: [
    ['img-src', 'https:', 'data:', "'self'", '*'],
    ['default-src'],
    ['font-src', `'self'`, '*', 'data:'],
    ['connect-src', '*', 'https:'],
    ['style-src', "'unsafe-inline'"],
    ['script-src', `'self'`],
  ]
    .map((directive) => {
      return directive.join(' ');
    })
    .join('; '),
};
