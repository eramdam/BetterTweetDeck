const {config} = require('node-config-ts');

/* eslint quotes: 0 */
module.exports = Object.assign(require('./common.js'), {
  applications: {
    gecko: {
      id: config.FirefoxId,
      strict_min_version: '52.0',
    },
  },
});
