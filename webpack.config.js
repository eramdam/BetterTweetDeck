const GenerateJsonPlugin = require("generate-json-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = env => {
  const getManifest = () => require(`./tools/manifests/${env.browser}.js`);

  return {
    mode: 'development',
    entry: {
      'js/content': "./src/js/content.js",
      'js/inject': "./src/js/inject.js",
      'js/background': "./src/js/background.js",
    },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new GenerateJsonPlugin("manifest.json", getManifest(), null, 2)]
  };
};
