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
  {
    from: '../CHANGELOG.md',
    to: 'options/',
  },
].map(i => (Object.assign(i, {
  context: './src/',
})));

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

const DIST_FOLDER = 'dist';
const POSSIBLE_BROWSERS = ['chrome', 'firefox'];

module.exports = (env) => {
  if (!env || !env.browser || !POSSIBLE_BROWSERS.includes(env.browser)) {
    throw new Error(`Please provide a browser!
    webpack --env.browser=BROWSER
    Possible values: chrome, firefox`);
  }

  const getManifest = () => require(`./tools/manifests/${env.browser}.js`);
  const isProduction = process.env.NODE_ENV !== 'dev';

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
    devtool: isProduction ? 'source-map' : 'cheap-source-map',
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
      extractContent,
      extractOptions,
      new CleanWebpackPlugin([DIST_FOLDER]),
      new CopyWebpackPlugin(staticFiles),
      new GenerateJsonPlugin('manifest.json', getManifest(), null, 2),
      isProduction ? new UglifyJSPlugin({
        parallel: true,
      }) : () => {},
      new ZipPlugin({
        path: path.resolve(__dirname, 'artifacts'),
        filename: `dist-${env.browser}`,
      }),
    ],
  };
};
