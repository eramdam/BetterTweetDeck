/* eslint-disable global-require */
const GenerateJsonPlugin = require('generate-json-webpack-plugin');

module.exports = (env) => {
  const manifestJson = require(`./tools/manifests2/${env.browser}.js`);

  return {
    devtool: 'cheap-source-map',
    entry: {
      content: './src/content.ts',
      inject: './src/inject.ts',
      background: './src/background.ts',
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
      ],
    },
  };
};
