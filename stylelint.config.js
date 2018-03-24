module.exports = {
  extends: [
    'stylelint-config-standard',
    './node_modules/prettier-stylelint/config.js',
  ],
  rules: {
    'no-descending-specificity': null,
    'font-family-no-missing-generic-family-keyword': null,
  },
};
