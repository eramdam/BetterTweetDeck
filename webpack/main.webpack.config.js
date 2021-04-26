const GenerateJsonPlugin = require('generate-json-webpack-plugin');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {getCommonWebpackConfig, getUrlLoaderBase} = require('./common');
const {NodeConfigTSPlugin} = require('node-config-ts/webpack');
const btdWebpackPlugin = require('./btdWebpackPlugin');

module.exports = (env) => {
  const commonConfig = getCommonWebpackConfig();

  return NodeConfigTSPlugin({
    ...commonConfig,
    entry: {
      content: path.join(process.cwd(), 'src/content.ts'),
      inject: path.join(process.cwd(), 'src/inject.ts'),
      background: path.join(process.cwd(), 'src/background.ts'),
    },
    plugins: [
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
          limit: 50 * 1000,
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
  });
};
