const TerserPlugin = require('terser-webpack-plugin');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
exports.getCommonWebpackConfig = () => {
  return {
    devtool: !IS_PRODUCTION && 'cheap-source-map',
    optimization: {
      minimize: IS_PRODUCTION,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            output: {
              keep_quoted_props: true,
            },
          },
        }),
      ],
    },
    output: {
      path: `${process.cwd()}/dist/build`,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
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
      ],
    },
  };
};

exports.getUrlLoaderBase = (options = {}) => {
  return {
    test: /\.(png|jpg|gif|svg|woff|woff2|ttf|eot)$/i,
    type: 'asset',
    parser: {
      dataUrlCondition: options,
    },
  };
};
