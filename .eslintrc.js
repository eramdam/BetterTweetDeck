/**
 * ESLint conf extending JS Standard Code Style (https://github.com/feross/eslint-config-standard) + a few globals
 */
module.exports = {
  env: {
    node: true,
    jquery: true,
    browser: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  globals: {
    chrome: false,
    instgrm: false,
    TD: false,
    BTD: false,
    Hogan: false,
  },
  plugins: ['unused-imports', 'simple-import-sort'],
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  rules: {
    'simple-import-sort/sort': 2,
    'unused-imports/no-unused-imports': 2,
    'prettier/prettier': 'error',
    'import/first': 0,
    'import/prefer-default-export': 0,
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
