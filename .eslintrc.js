module.exports = {
  parser: 'typescript-eslint-parser',
  plugins: ['typescript'],
  extends: ['airbnb'],
  env: {
    browser: true,
    node: true,
  },
  rules: {
    'import/prefer-default-export': 0,
    'no-underscore-dangle': 0,
    'nonblock-statement-body-position': [2, 'below'],
    'object-curly-spacing': [2, 'never'],
    'object-curly-newline': 0,
    'import/extensions': 0,
    'import/prefer-default-export': 0,
    'max-len': [2, {code: 200}],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'import/no-unresolved': 0,
        'no-unused-vars': 0,
        'no-undef': 0,
        'react/jsx-filename-extension': 0,
        'react/jsx-one-expression-per-line': 0,
        'react/destructuring-assignment': 0,
        'react/prop-types': 0,
        'react/prefer-stateless-function': 0,
        'no-restricted-globals': 0,
      },
    },
  ],
};
