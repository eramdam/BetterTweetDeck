/* eslint import/no-dynamic-require: 0 */
/* eslint global-require: 0 */
const GenerateJsonPlugin = require('generate-json-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const Stylish = require('webpack-stylish');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = (env) => {
  const getManifest = () => require(`./tools/manifests/${env.browser}.js`);

  return {
    mode: 'development',
    devtool: 'cheap-source-map',
    entry: {
      'js/content': './src/js/content.ts',
      'js/inject': './src/js/inject.ts',
      'js/background': './src/js/background.ts',
    },
    stats: 'none',
    plugins: [
      new Stylish(),
      new CleanWebpackPlugin(['dist']),
      new LodashModuleReplacementPlugin(),
      new GenerateJsonPlugin('manifest.json', getManifest(), null, 2),
      new ForkTsCheckerWebpackPlugin(),
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      ],
    },
  };
};
