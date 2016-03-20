/**
 * ESLint conf extending JS Standard Code Style (https://github.com/feross/eslint-config-standard) + a few globals
 */
module.exports = {
  'parser': 'babel-eslint',
  'env': {
    'node': true,
    'jquery': true,
    'browser': true
  },
  'globals': {
    'chrome': false,
    'TD': false
  },
  'extends': 'standard'
};
