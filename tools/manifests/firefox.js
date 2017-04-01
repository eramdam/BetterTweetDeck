/* eslint quotes: 0 */
module.exports = Object.assign(require('./common.js'), {
  name: '__MSG_appName__',
  description: '__MSG_appDesc__',
  default_locale: 'en',
  'applications.gecko.id': 'BetterTweetDeck@erambert.me',
  content_security_policy: `img-src https: data: 'self' *; media-src * https:; connect-src * https:; style-src 'unsafe-inline'; object-src 'self'; script-src 'self';`,
});
