const package = require('./package.json');
module.exports = {
  plugins: {
    'postcss-preset-env': {
      stage: 1,
      browsers: package.browserslist,
    },
  },
};
