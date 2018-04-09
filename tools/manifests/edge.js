/**
 * EDGE SUPPORT STILL IN WORK THO
 */
const common = require('./common.js');

module.exports = {
  name: common.name,
  version: common.extension_version,
  minimum_edge_version: '38.14393.0.0',
  description: 'Emojis, thumbnails and advanced features for http://tweetdeck.twitter.com !',
  author: 'Damien Erambert',
  background: Object.assign(common.background, {
    persistent: true,
  }),
  options_page: 'options/options.html',
  content_scripts: Object.assign(common.content_scripts, {
    run_at: 'document_start',
  }),
  icons: common.icons,
  '-ms-preload': {
    backgroundScript: 'backgroundScriptsAPIBridge.js',
    contentScript: 'contentScriptsAPIBridge.js',
  },
};
