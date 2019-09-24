const config = require('config');

/* eslint quotes: 0 */
module.exports = Object.assign(require('./common.js'), {
  applications: {
    gecko: {
      id: config.get('FirefoxId'),
      strict_min_version: '52.0',
    },
  },
});
