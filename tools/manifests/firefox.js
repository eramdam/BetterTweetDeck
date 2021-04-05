const {config} = require('node-config-ts');

module.exports = {
  ...require('./common.js'),
  optional_permissions: ['tabs'],
  applications: {
    gecko: {
      id: config.FirefoxId,
      strict_min_version: '52.0',
    },
  },
};
