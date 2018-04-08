const fs = require('fs');

const packageJson = JSON.parse(fs.readFileSync(`${__dirname}/../../package.json`, 'utf8'));
const isBeta = process.env.BTD_BETA === 'true';

const icons = {
  16: 'icons/icon-16.png',
  48: 'icons/icon-48.png',
  128: 'icons/icon-128.png',
};

const betaIcons = {
  16: 'icons/icon-beta-16.png',
  48: 'icons/icon-beta-48.png',
  128: 'icons/icon-beta-128.png',
};

const betaVersion = () => {
  const d = new Date();
  const arr = String(Math.floor(Date.now() / 1000))
    .match(/.{1,4}/g)
    .map(Number);

  return `${d.getFullYear()}.${arr.join('.')}`;
};

const urls = require('./commonHosts');

/* eslint quotes: 0 */
const common = {
  name: `${isBeta ? 'βeta' : 'Better'} TweetDeck`.trim(),
  short_name: `${isBeta ? 'βeta ' : 'Better'}TDeck`,
  version: isBeta ? betaVersion() : packageJson.extension_version,
  version_name: isBeta ? betaVersion() : packageJson.extension_version,
  manifest_version: 2,
  homepage_url: 'https://better.tw',
  content_scripts: [
    {
      matches: ['*://tweetdeck.twitter.com/*'],
      js: ['js/content.js'],
      run_at: 'document_end',
    },
  ],
  permissions: ['storage', 'contextMenus', 'notifications', ...urls],
  optional_permissions: ['tabs'],
  content_security_policy: `img-src https: data: 'self' *; default-src; connect-src * https:; style-src 'unsafe-inline'; script-src 'self';`,
};

module.exports = common;
