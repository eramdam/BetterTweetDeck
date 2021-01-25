const chromeManifest = require('./chrome');
module.exports = Object.assign(chromeManifest, {
  browser_action: {
    default_icon: {
      16: 'build/icons/toolbar-icon-16.png',
      32: 'build/icons/toolbar-icon-32.png',
    },
  },
});
