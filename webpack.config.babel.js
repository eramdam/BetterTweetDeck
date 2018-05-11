/* eslint global-require: 0 */
import path from "path";
import fs from "fs";

import CopyWebpackPlugin from "copy-webpack-plugin";
import ExtractTextPlugin from "extract-text-webpack-plugin";
import CleanWebpackPlugin from "clean-webpack-plugin";
import GenerateJsonPlugin from "generate-json-webpack-plugin";
import ZipPlugin from "zip-webpack-plugin";
import config from "config";

const extractContent = new ExtractTextPlugin("css/index.css");
const extractOptions = new ExtractTextPlugin("options/css/index.css");

const staticFiles = [
  {
    from: "revert-dark-theme.css"
  },
  {
    from: "icons/*.png"
  },
  {
    from: "fonts/*"
  },
  {
    from: "emojis/*.png"
  },
  {
    from: "options/**/*.html"
  },
  {
    from: "options/ui/*"
  },
  {
    from: "options/img/**/*"
  },
  {
    from: "_locales/**/*"
  }
];

const DIST_FOLDER = "dist";
const IS_PRODUCTION = process.env.NODE_ENV !== "dev";
const POSSIBLE_BROWSERS = ["chrome", "firefox"];

const cssLoaders = {
  fallback: "style-loader",
  use: [
    {
      loader: "css-loader",
      options: {
        importLoaders: 1,
        minimize: IS_PRODUCTION,
        sourceMap: !IS_PRODUCTION
      }
    },
    {
      loader: "postcss-loader"
    }
  ]
};

module.exports = env => {
  if (!env || !env.browser || !POSSIBLE_BROWSERS.includes(env.browser)) {
    throw new Error(`Please provide a browser!
    webpack --env.browser=BROWSER
    Possible values: chrome, firefox`);
  }

  if (env.browser !== "firefox") {
    staticFiles.push({
      from: "../tools/embeds.js"
    });
  }

  const staticFilesPath = staticFiles.map(i =>
    Object.assign(i, {
      context: "./src/"
    })
  );

  const getManifest = () => require(`./tools/manifests/${env.browser}.js`);

  fs.writeFileSync(
    path.resolve(__dirname, "config/config.json"),
    JSON.stringify(config)
  );

  return {
    entry: {
      "js/inject": "./src/js/inject.js",
      "js/background": "./src/js/background.js",
      "js/content": "./src/js/content.js",
      "options/options": "./src/options/options.js"
    },
    output: {
      filename: "[name].js",
      path: `${__dirname}/${DIST_FOLDER}`
    },
    mode: IS_PRODUCTION ? "production" : "development",
    devtool: !IS_PRODUCTION && "source-map",
    module: {
      rules: [
        {
          test: /.js$/,
          exclude: /node_modules/,
          loader: "babel-loader"
        },
        {
          test: /\.css$/,
          exclude: path.resolve(__dirname, "src/css/options"),
          use: extractContent.extract(cssLoaders)
        },
        {
          test: /\.css$/,
          include: path.resolve(__dirname, "src/css/options"),
          use: extractOptions.extract(cssLoaders)
        }
      ]
    },
    resolve: {
      alias: {
        config: path.resolve(__dirname, "config/config.json")
      }
    },
    plugins: [
      extractContent,
      extractOptions,
      new CleanWebpackPlugin([DIST_FOLDER]),
      new CopyWebpackPlugin(staticFilesPath),
      new GenerateJsonPlugin("manifest.json", getManifest(), null, 2),
      IS_PRODUCTION
        ? new ZipPlugin({
            path: path.resolve(__dirname, "artifacts"),
            filename: `dist-${env.browser}`
          })
        : () => null
    ]
  };
};
