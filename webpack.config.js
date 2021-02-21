/* eslint-disable global-require */

module.exports = (env) => {
  const manifest = require(`./tools/manifests/${env.browser}.js`);

  return [
    require('./webpack/main.webpack.config')({
      ...env,
      manifest,
    }),
    require('./webpack/options.webpack.config')(env),
  ];
};
