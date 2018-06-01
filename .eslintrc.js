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
    BTD: false,
    Hogan: false,
  },
  extends: 'airbnb-base',
  rules: {
    'import/no-dynamic-require': 0,
    'no-param-reassign': 0,
    'max-len': 0,
    'arrow-body-style': 0,
    'no-underscore-dangle': 0,
    'prefer-destructuring': 0,
    'no-control-regex': 0,
    'no-mixed-operators': 0,
  },
};
