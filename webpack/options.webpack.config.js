const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const {getCommonWebpackConfig, getUrlLoaderBase} = require('./common');

module.exports = () => {
  const commonConfig = getCommonWebpackConfig();

  return {
    ...commonConfig,
    entry: {
      options: path.join(process.cwd(), 'src/options.tsx'),
      optionsPage: path.join(process.cwd(), 'src/optionsPage.ts'),
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Better TweetDeck Settings',
        filename: 'options/index.html',
        chunks: ['options'],
      }),
      new HtmlWebpackPlugin({
        title: 'Better TweetDeck Settings',
        filename: 'options/ui.html',
        chunks: ['optionsPage'],
      }),
      new MonacoWebpackPlugin({
        languages: ['css'],
      }),
    ],
    module: {
      rules: [...commonConfig.module.rules, getUrlLoaderBase(() => true)],
    },
  };
};
