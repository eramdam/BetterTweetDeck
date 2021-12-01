const _ = require('lodash');
const config = require('config');
const {DateTime} = require('luxon');

const isCi = process.env.CI === 'true';
const betaId = isCi ? process.env.FIREFOX_BETA_ID : config.get('FirefoxBetaId');

const iconSizes = [16, 32, 48, 96, 128, 256, 512];

const icons = _(iconSizes)
  .map((size) => {
    return {
      size,
      icon: `build/assets/icons/icon-beta-${size}.png`,
    };
  })
  .keyBy((i) => i.size)
  .mapValues((v) => v.icon)
  .value();

module.exports = {
  ...require('./common.js'),
  name: 'Better TweetDeck Nightly',
  version: DateTime.local().toFormat('yy.MMdd.hh.mm').replaceAll('.0', '.9'),
  optional_permissions: ['tabs'],
  icons,
  applications: {
    gecko: {
      id: betaId,
      strict_min_version: '78.0',
    },
  },
};
