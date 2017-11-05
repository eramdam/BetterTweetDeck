/**
 * ESLint conf extending JS Standard Code Style (https://github.com/feross/eslint-config-standard) + a few globals
 */
module.exports = {
  env: {
    node: true,
    jquery: true,
    browser: true,
  },
  globals: {
    chrome: false,
    instgrm: false,
    TD: false,
    Hogan: false,
  },
  parser: 'babel-eslint',
  extends: 'airbnb',
  rules: {
    'import/no-dynamic-require': 0,
    'no-param-reassign': 0,
    'max-len': 0,
    'arrow-body-style': 0,
    'no-underscore-dangle': 0,
    'prefer-destructuring': 0,
    'react/jsx-filename-extension': 0,
  },
};
