const GenerateJsonPlugin = require("generate-json-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = env => {
  const getManifest = () => require(`./tools/manifests/${env.browser}.js`);

  return {
    entry: { 'js/content': "./src/js/content.js" },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new GenerateJsonPlugin("manifest.json", getManifest(), null, 2)]
  };
};
