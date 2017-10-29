/* eslint global-require: 0 */
const path = require('path');
const fs = require('fs');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const GenerateJsonPlugin = require('generate-json-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const config = require('config');

fs.writeFileSync(path.resolve(__dirname, 'dist/config.json'), JSON.stringify(config));

const extractContent = new ExtractTextPlugin('css/index.css');
const extractOptions = new ExtractTextPlugin('options/css/index.css');

const DIST_FOLDER = 'output';

const staticFiles = [
  'icons/*.png',
  'fonts/*',
  'emojis/*.png',
  'options/**/*.html',
  'options/ui/*',
  'options/img/*',
  '_locales/**/*',
].map(i => ({
  from: i,
  context: './src/',
}));

const cssLoaders = {
  fallback: 'style-loader',
  use: [
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1,
        minimize: false,
        sourceMap: true,
      },
    },
    {
      loader: 'postcss-loader',
    },
  ],
};

module.exports = (env) => {
  if (!env || !env.browser) {
    throw new Error(`Please provide a browser!
    Possible values: chrome, firefox`);
  }

  const getManifest = () => require(`./tools/manifests/${env.browser}.js`);

  return {
    entry: {
      'js/inject': './src/js/inject.js',
      'js/background': './src/js/background.js',
      'js/content': './src/js/content.js',
      'options/options': './src/options/options.js',
    },
    output: {
      filename: '[name].js',
      path: `${__dirname}/${DIST_FOLDER}`,
    },
    module: {
      rules: [
        {
          test: /.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.css$/,
          exclude: path.resolve(__dirname, 'src/css/options'),
          use: extractContent.extract(cssLoaders),
        },
        {
          test: /\.css$/,
          include: path.resolve(__dirname, 'src/css/options'),
          use: extractOptions.extract(cssLoaders),
        },
      ],
    },
    resolve: {
      alias: {
        config: path.resolve(__dirname, 'dist/config.json'),
      },
    },
    plugins: [
      extractContent,
      extractOptions,
      new CleanWebpackPlugin([DIST_FOLDER]),
      new CopyWebpackPlugin(staticFiles),
      new GenerateJsonPlugin('manifest.json', getManifest(), null, 2),
      new UglifyJSPlugin({
        parallel: true,
      new ZipPlugin({
        path: path.resolve(__dirname, 'artifacts'),
        filename: `dist-${env.browser}`,
      }),
    ],
  };
};
