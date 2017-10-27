const path = require('path');
const fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');

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

module.exports = {
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
    new CopyWebpackPlugin(staticFiles),
  ],
};
