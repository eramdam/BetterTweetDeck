const config = require('config');
const GenerateJsonPlugin = require('generate-json-webpack-plugin');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {getCommonWebpackConfig, getUrlLoaderBase} = require('./common');
const btdWebpackPlugin = require('./btdWebpackPlugin');
const webpack = require('webpack');

module.exports = (env) => {
  const commonConfig = getCommonWebpackConfig();

  return {
    ...commonConfig,
    entry: {
      content: path.join(process.cwd(), 'src/content.ts'),
      inject: path.join(process.cwd(), 'src/inject.ts'),
      background: path.join(process.cwd(), 'src/background.ts'),
    },
    plugins: [
      new webpack.DefinePlugin({
        __BTD_CONFIG: JSON.stringify(config.get('Client') || {}),
      }),
      btdWebpackPlugin,
      new CopyWebpackPlugin({
        patterns: [
          {
            from: '_locales/**/*',
            context: './src/',
          },
          {
            from: 'assets/icons/*',
            context: './src/',
          },
          {
            from: 'assets/emoji-sheet.png',
            context: './src/',
          },
        ],
      }),
      new GenerateJsonPlugin('manifest.json', env.manifest, null, 2),
    ],
    module: {
      rules: [
        ...commonConfig.module.rules,
        getUrlLoaderBase({
          maxSize: 50 * 1000,
        }),
        {
          test: /\.js$/,
          loader: 'string-replace-loader',
          options: {
            search: 'https://unpkg.com/emoji-datasource',
            replace: '',
          },
        },
      ],
    },
  };
};
