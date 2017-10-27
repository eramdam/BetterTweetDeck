const path = require('path');
const fs = require('fs');

const config = require('config');

fs.writeFileSync(path.resolve(__dirname, 'dist/config.json'), JSON.stringify(config));

module.exports = {
  entry: {
    inject: './src/js/inject.js',
    background: './src/js/background.js',
    content: './src/js/content.js',
  },
  output: {
    filename: '[name].js',
    path: `${__dirname}/output`,
  },
  resolve: {
    alias: {
      config: path.resolve(__dirname, 'dist/config.json'),
    },
  },
};