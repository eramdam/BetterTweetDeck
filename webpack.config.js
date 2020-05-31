/* eslint-disable global-require */
const GenerateJsonPlugin = require('generate-json-webpack-plugin');
const {NodeConfigTSPlugin} = require('node-config-ts/webpack');
const {join} = require('path');

function WebpackConfig(env) {
  const manifestJson = require(`./tools/manifests2/${env.browser}.js`);

  const finalConfig = {
    devtool: 'cheap-source-map',
    entry: {
      content: join(__dirname, 'src/content.ts'),
      inject: join(__dirname, 'src/inject.ts'),
      background: join(__dirname, 'src/background.ts'),
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    plugins: [new GenerateJsonPlugin('manifest.json', manifestJson, null, 2)],
    mode: 'development',
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
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.(png|jpg|gif|svg)$/i,
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
  };

  return NodeConfigTSPlugin(finalConfig);
}

module.exports = WebpackConfig;
