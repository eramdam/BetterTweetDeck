/* eslint global-require: 0 */
import path from 'path';
import fs from 'fs';

import CopyWebpackPlugin from 'copy-webpack-plugin';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import GenerateJsonPlugin from 'generate-json-webpack-plugin';
import ZipPlugin from 'zip-webpack-plugin';
import config from 'config';

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const extractContent = new ExtractTextPlugin('css/index.css');
const extractOptions = new ExtractTextPlugin('options/css/index.css');

const staticFiles = [
  {
    from: 'icons/*.png',
  },
  {
    from: 'fonts/*',
  },
  {
    from: 'emojis/*.png',
  },
  {
    from: 'options/**/*.html',
  },
  {
    from: 'options/ui/*',
  },
  {
    from: 'options/img/*',
  },
  {
    from: '_locales/**/*',
  },
  {
    from: '../tools/embeds.js',
  },
].map(i => (Object.assign(i, {
  context: './src/',
})));

const DIST_FOLDER = 'dist';
const IS_PRODUCTION = process.env.NODE_ENV !== 'dev';
const POSSIBLE_BROWSERS = ['chrome', 'firefox'];

const cssLoaders = {
  fallback: 'style-loader',
  use: [
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1,
        minimize: IS_PRODUCTION,
        sourceMap: !IS_PRODUCTION,
      },
    },
    {
      loader: 'postcss-loader',
    },
  ],
};

module.exports = (env) => {
  if (!env || !env.browser || !POSSIBLE_BROWSERS.includes(env.browser)) {
    throw new Error(`Please provide a browser!
    webpack --env.browser=BROWSER
    Possible values: chrome, firefox`);
  }

  const getManifest = () => require(`./tools/manifests/${env.browser}.js`);

  fs.writeFileSync(path.resolve(__dirname, 'config/config.json'), JSON.stringify(config));

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
    devtool: 'source-map',
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
        config: path.resolve(__dirname, 'config/config.json'),
      },
    },
    plugins: [
      // new BundleAnalyzerPlugin(),
      extractContent,
      extractOptions,
      new CleanWebpackPlugin([DIST_FOLDER]),
      new CopyWebpackPlugin(staticFiles),
      new GenerateJsonPlugin('manifest.json', getManifest(), null, 2),
      IS_PRODUCTION ? new UglifyJSPlugin({
        parallel: true,
      }) : () => null,
      IS_PRODUCTION ? new ZipPlugin({
        path: path.resolve(__dirname, 'artifacts'),
        filename: `dist-${env.browser}`,
      }) : () => null,
    ],
  };
};
