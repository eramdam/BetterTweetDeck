const urls = require('./commonHosts');

module.exports = {
  name: 'Better TweetDeck',
  version: '4.0.0',
  manifest_version: 2,
  content_scripts: [
    {
      matches: ['*://tweetdeck.twitter.com/*'],
      js: ['content.js'],
      run_at: 'document_end',
    },
  ],
  background: {
    scripts: ['background.js'],
  },
  web_accessible_resources: ['inject.js'],
  permissions: ['storage', 'contextMenus', ...urls],
  content_security_policy: `img-src https: data: 'self' *; default-src; connect-src * https:; style-src 'unsafe-inline'; script-src 'self';`,
};
