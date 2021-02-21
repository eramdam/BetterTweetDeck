/* eslint-disable global-require */
const GenerateJsonPlugin = require('generate-json-webpack-plugin');
const {NodeConfigTSPlugin} = require('node-config-ts/webpack');
const fs = require('fs');
const ZipPlugin = require('zip-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

function WebpackConfig(env) {
  const manifestJson = require(`./tools/manifests/${env.browser}.js`);
  const IS_PRODUCTION = process.env.NODE_ENV === 'production';

  const finalConfig = {
    devtool: 'cheap-source-map',
    entry: {
      content: path.join(__dirname, 'src/content.ts'),
      inject: path.join(__dirname, 'src/inject.ts'),
      background: path.join(__dirname, 'src/background.ts'),
      options: path.join(__dirname, 'src/options.tsx'),
      optionsPage: path.join(__dirname, 'src/optionsPage.ts'),
    },
    output: {
      path: `${__dirname}/dist/build`,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    plugins: [
      {
        apply: (compiler) => {
          let initialClean = false;
          compiler.hooks.emit.tap('EmitPlugin', () => {
            if (initialClean) {
              return;
            }
            try {
              fs.rmSync(`./dist`, {recursive: true, force: true});
              initialClean = true;
            } catch (e) {
              console.error(e);
            }
          });
          compiler.hooks.afterEmit.tap('AfterEmitPlugin', () => {
            fs.renameSync('./dist/build/manifest.json', './dist/manifest.json');
            fs.renameSync('./dist/build/_locales', './dist/_locales');
          });
        },
      },
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
        ],
      }),
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
      new GenerateJsonPlugin('manifest.json', manifestJson, null, 2),
      (IS_PRODUCTION &&
        new ZipPlugin({
          path: path.resolve(__dirname, 'artifacts'),
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
