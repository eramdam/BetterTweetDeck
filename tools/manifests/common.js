const fs = require('fs');

const packageJson = JSON.parse(fs.readFileSync(`${__dirname}/../../package.json`, 'utf8'));
const isBeta = process.env.BTD_BETA === 'true';

const icons = {
  16: 'icons/icon-16.png',
  48: 'icons/icon-48.png',
  128: 'icons/icon-128.png',
};

const betaIcons = {
  16: 'icons/icon-beta-16.png',
  48: 'icons/icon-beta-48.png',
  128: 'icons/icon-beta-128.png',
};

const betaVersion = () => {
  const d = new Date();

  return `${d.getFullYear()}.${d.getDate()}.${d.getHours()}.${d.getMinutes()}${d.getSeconds()}`;
};

const betaVersionName = () => {
  const d = new Date();

  return `${packageJson.extension_version} @ ${d.toLocaleString()}`;
};

/* eslint quotes: 0 */
const common = {
  name: `${isBeta ? 'βeta' : 'Better'} TweetDeck`.trim(),
  short_name: `${isBeta ? 'βeta ' : 'Better'}TDeck`,
  version: isBeta ? betaVersion() : packageJson.extension_version,
  version_name: isBeta ? betaVersionName() : packageJson.extension_version,
  manifest_version: 2,
  homepage_url: 'https://github.com/eramdam/BetterTweetDeck/',
  content_scripts: [{
    matches: ['*://tweetdeck.twitter.com/*'],
    js: ['js/content.js'],
    css: ['css/index.css'],
    run_at: 'document_end',
  }],
  background: {
    scripts: ['js/background.js'],
  },
  icons: isBeta ? betaIcons : icons,
  permissions: [
    'storage',
    'https://api.embed.ly/1/*',
    'https://backend.deviantart.com/*',
    'https://500px.com/oembed*',
    'https://api.dailymotion.com/video/*',
    'https://api.dribbble.com/v1/shots/*',
    'https://*.imgur.com/*',
    'https://*.instagram.com/*',
    'https://images4-focus-opensocial.googleusercontent.com/gadgets/proxy*',
    'http://erambert.me/*',
    'https://embed.spotify.com/oembed/*',
    'https://open.spotify.com/oembed/*',
    'https://api.streamable.com/*',
    'https://api.twitch.tv/kraken/*',
    'https://clips.twitch.tv/*',
    'https://*.bandcamp.com/*',
    'https://cl.ly/*',
    'https://giphy.com/services/oembed*',
    'https://api.gyazo.com/api/*',
    'https://www.tinami.com/api/*',
    'https://gyazo.com/*',
    'https://raw.githubusercontent.com/eramdam/BetterTweetDeck/master/*',
    '*://tweetdeck.twitter.com/*',
    'contextMenus',
    'notifications',
  ],
  optional_permissions: ['tabs'],
  options_ui: {
    page: 'options/ui/ui.html',
    chrome_style: false,
  },
  web_accessible_resources: [
    'embeds.js',
    'emojis/sheet_twitter_64.png',
    'fonts/*.*',
    'js/inject.js',
    'options/options.html',
  ],
  content_security_policy: `img-src https: data: 'self' *; default-src; connect-src * https:; style-src 'unsafe-inline'`,
};

if (process.env.NODE_ENV === 'dev') {
  common.commands = {
    _execute_page_action: {
      suggested_key: {
        default: "Ctrl+Shift+E",
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
