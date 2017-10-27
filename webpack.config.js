/* eslint global-require: 0 */
const path = require('path');
const fs = require('fs');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const GenerateJsonPlugin = require('generate-json-webpack-plugin');
const config = require('config');

fs.writeFileSync(path.resolve(__dirname, 'dist/config.json'), JSON.stringify(config));

const staticFiles = [
  'icons/*.png',
  'fonts/*',
  'emojis/sheet_twitter_64.png',
  'options/**/*.html',
  'options/ui/*',
  'options/img/*',
  '_locales/**/*',
].map(i => ({
  from: i,
  context: './src/',
}));

module.exports = (env) => {
  if (!env || !env.browser) {
    throw new Error(`Please provide a browser!
    Possible values: chrome, firefox`);
  }

  const getManifest = () => require(`./tools/manifests/${env.browser}.js`);

  return {
    entry: {
      inject: './src/js/inject.js',
      background: './src/js/background.js',
      content: './src/js/content.js',
      'options/options': './src/options/options.js',
    },
    output: {
      filename: '[name].js',
      path: `${__dirname}/output`,
    },
    module: {
      rules: [
        {
          test: /.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
      ],
    },
    resolve: {
      alias: {
        config: path.resolve(__dirname, 'dist/config.json'),
      },
    },
    plugins: [
      new CleanWebpackPlugin(['output']),
      new CopyWebpackPlugin(staticFiles),
      new GenerateJsonPlugin('manifest.json', getManifest(), null, 2),
    ],
  };
};
