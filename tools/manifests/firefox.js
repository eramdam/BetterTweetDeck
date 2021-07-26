const config = require('config');

module.exports = {
  ...require('./common.js'),
  optional_permissions: ['tabs'],
  applications: {
    gecko: {
      id: config.get('FirefoxId'),
      strict_min_version: '78.0',
    },
  },
};
