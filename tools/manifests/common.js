const fs = require('fs');
const packageJson = JSON.parse(fs.readFileSync(`${__dirname}/../../package.json`, 'utf8'));

/* eslint quotes: 0 */
module.exports = {
  name: 'Better TweetDeck 3',
  short_name: 'BetterTDeck',
  version: packageJson.version,
  manifest_version: 2,
  homepage_url: 'https://github.com/eramdam/BetterTweetDeck/',
  content_scripts: [{
    matches: ['*://tweetdeck.twitter.com/*'],
    js: ['js/content.js'],
    css: ['css/index.css'],
  }],
  background: {
    scripts: ['js/background.js'],
  },
  icons: {
    16: 'icons/icon 16.png',
    48: 'icons/icon 48.png',
    128: 'icons/icon 128.png',
  },
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
    'https://api.streamable.com/*',
    'https://api.twitch.tv/kraken/*',
    'https://clips.twitch.tv/*',
    'https://*.bandcamp.com/*',
    'https://cl.ly/*',
    'https://giphy.com/services/oembed*',
    'https://api.gyazo.com/api/*',
    'https://www.tinami.com/api/*',
    'https://gyazo.com/*',
    '*://tweetdeck.twitter.com/*',
    'contextMenus',
    'notifications',
    'tabs',
  ],
  options_ui: {
    page: 'options/ui/ui.html',
    chrome_style: false,
  },
  web_accessible_resources: ['js/inject.js', 'js/content.js.map', 'js/inject.js.map', 'js/background.js.map', 'emojis/sheet_twitter_64.png', 'emojis/emoji-happy.svg', 'icons/controller-play.svg', 'options/options.html'],
  content_security_policy: `img-src https: data: 'self' *; default-src; connect-src * https:; style-src 'unsafe-inline'`,
};
