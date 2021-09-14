const config = require('config');
const {DateTime} = require('luxon');

const isCi = process.env.CI === 'true';
const betaId = isCi ? process.env.FIREFOX_BETA_ID : config.get('FirefoxBetaId');

module.exports = {
  ...require('./common.js'),
  version: DateTime.local().toFormat('yy.MMdd.hh.mm').replaceAll('.0', '.9'),
  optional_permissions: ['tabs'],
  applications: {
    gecko: {
      id: betaId,
      strict_min_version: '78.0',
    },
  },
};
