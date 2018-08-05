const config = require('config');
const urls = require('./commonHosts');

/* eslint quotes: 0 */
module.exports = Object.assign(require('./common.js'), {
  description: 'lorem',
  version_name: undefined,
  applications: {
    gecko: {
      id: config.get('FirefoxId'),
      strict_min_version: '52.0'
    }
  },
  permissions: ['storage', 'contextMenus', 'notifications', 'tabs', ...urls],
  content_security_policy: `img-src https: data: 'self' *; media-src * https:; connect-src * https:; style-src 'unsafe-inline'; object-src 'self'; script-src 'self';`
});
