const chromeManifest = require('./chrome');
module.exports = Object.assign(chromeManifest, {
  name: 'Better TDeck',
  browser_action: {
    default_icon: {
      16: 'build/assets/icons/toolbar-icon-16.png',
      32: 'build/assets/icons/toolbar-icon-32.png',
    },
  },
});
