const isBeta = process.env.BTD_BETA === 'true';
const common = require('./common.js');

module.exports = Object.assign(require('./common.js'), {
  name: isBeta ? common.name : '__MSG_appName__',
  description: '__MSG_appDesc__',
  default_locale: 'en',
});
