const config = require('config');

/* eslint quotes: 0 */
module.exports = Object.assign(require('./common.js'), {
  description: '__MSG_appDesc__',
  version_name: undefined,
  default_locale: 'en',
  applications: {
    gecko: {
      id: config.get('FirefoxId'),
      strict_min_version: '48.0',
    },
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
    '*://tweetdeck.twitter.com/*',
    'https://raw.githubusercontent.com/eramdam/BetterTweetDeck/master/*',
    'contextMenus',
    'notifications',
    'tabs',
  ],
  content_security_policy: `img-src https: data: 'self' *; media-src * https:; connect-src * https:; style-src 'unsafe-inline'; object-src 'self'; script-src 'self';`,
});
