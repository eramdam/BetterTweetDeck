const {config} = require('node-config-ts');

module.exports = {
  ...require('./common.js'),
  name: '__MSG_app_name__',
  description: '__MSG_app_desc__',
  applications: {
    gecko: {
      id: config.FirefoxId,
      strict_min_version: '52.0',
    },
  },
};
