/* eslint-disable global-require */
const GenerateJsonPlugin = require('generate-json-webpack-plugin');
const {NodeConfigTSPlugin} = require('node-config-ts/webpack');
const {join, resolve} = require('path');
const ZipPlugin = require('zip-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

function WebpackConfig(env) {
  const manifestJson = require(`./tools/manifests/${env.browser}.js`);
  const IS_PRODUCTION = process.env.NODE_ENV === 'production';

  const finalConfig = {
    devtool: 'cheap-source-map',
    entry: {
      content: join(__dirname, 'src/content.ts'),
      inject: join(__dirname, 'src/inject.ts'),
      background: join(__dirname, 'src/background.ts'),
      options: join(__dirname, 'src/options.tsx'),
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Better TweetDeck Options',
        filename: 'options/index.html',
        chunks: ['options'],
      }),
      new GenerateJsonPlugin('manifest.json', manifestJson, null, 2),
      (IS_PRODUCTION &&
        new ZipPlugin({
          path: resolve(__dirname, 'artifacts'),
          filename: `dist-${env.browser}.zip`,
        })) ||
        undefined,
    ].filter((i) => !!i),
    mode: process.env.NODE_ENV || 'development',
    stats: 'minimal',
    target: 'web',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
        {
          test: /\.css$/i,
          use: [
            'style-loader',
            {loader: 'css-loader', options: {importLoaders: 1}},
            'postcss-loader',
          ],
        },
        {
          test: /\.(png|jpg|gif|svg|woff|woff2|ttf|eot)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 20 * 1000,
              },
            },
          ],
        },
      ],
    },
    devServer: {
      hot: true,
      stats: 'minimal',
      contentBase: path.join(__dirname, 'dist'),
    },
  };

  return NodeConfigTSPlugin(finalConfig);
}

module.exports = WebpackConfig;
