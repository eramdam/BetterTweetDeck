const config = require('config');
const {DateTime} = require('luxon');

module.exports = {
  ...require('./common.js'),
  version: DateTime.local().toFormat('yy.MdHH.mm'),
  optional_permissions: ['tabs'],
  applications: {
    gecko: {
      id: config.get('FirefoxBetaId'),
      strict_min_version: '84.0',
    },
  },
};
