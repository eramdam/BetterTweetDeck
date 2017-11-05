const WebpackDevServer = require('webpack-dev-server');
const WriteFilePlugin = require('write-file-webpack-plugin');
const webpack = require('webpack');
const config = require('../webpack.config')({ browser: 'chrome' });
const path = require('path');

const excludeEntriesToHotReload = ['js/content'];

Object.keys(config.entry).forEach((entryName) => {
  if (excludeEntriesToHotReload.indexOf(entryName) === -1) {
    config.entry[entryName] =
      [
        (`webpack-dev-server/client?https://localhost:${3000}`),
        'webpack/hot/dev-server',
      ].concat(config.entry[entryName]);
  }
});

config.plugins =
  [new webpack.HotModuleReplacementPlugin(), new WriteFilePlugin()].concat(config.plugins || []);

delete config.chromeExtensionBoilerplate;

const compiler = webpack(config);

const server =
  new WebpackDevServer(compiler, {
    hot: true,
    https: true,
    stats: {
      colors: true,
    },
    contentBase: path.join(__dirname, '../dist'),
    headers: { 'Access-Control-Allow-Origin': '*' },
  });

server.listen(3000);
