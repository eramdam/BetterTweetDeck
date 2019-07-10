const config = require('config');
const urls = require('./commonHosts');

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
    'contextMenus',
    'notifications',
    'tabs',
    'webRequest',
    'webRequestBlocking',
    ...urls,
  ],
  content_security_policy: `img-src https: data: 'self' *; media-src * https:; connect-src * https:; style-src 'unsafe-inline'; object-src 'self'; script-src 'self';`,
});
