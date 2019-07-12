module.exports = {
  extends: [
    'stylelint-config-standard',
    './node_modules/prettier-stylelint/config.js',
  ],
  rules: {
    'property-no-unknown': null,
    'no-descending-specificity': null,
    'font-family-no-missing-generic-family-keyword': null,
    'selector-combinator-space-before': null,
    'selector-descendant-combinator-no-non-space': null,
    'media-query-list-comma-space-after': null,
  },
};
