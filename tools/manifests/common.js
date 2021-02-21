const urls = require('./commonHosts');

module.exports = {
  name: 'Better TweetDeck',
  short_name: 'Better TweetDeck',
  default_locale: 'en',
  version: '4.0.0',
  manifest_version: 2,
  content_scripts: [
    {
      matches: ['*://tweetdeck.twitter.com/*'],
      js: ['build/content.js'],
      run_at: 'document_end',
    },
  ],
  background: {
    scripts: ['build/background.js'],
  },
  options_ui: {
    page: 'build/options/ui.html',
    chrome_style: false,
  },
  web_accessible_resources: ['build/inject.js', '*.png'],
  permissions: ['storage', 'contextMenus', ...urls],
  content_security_policy: `img-src https: data: 'self' *; default-src; connect-src * https: ws: localhost; style-src 'unsafe-inline'; script-src 'self';`,
};
