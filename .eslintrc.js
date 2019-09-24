module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
  },
  env: {
    node: true,
  },
  rules: {
    'prettier/prettier': 'error',
  },
  overrides: [
    {
      files: ['src/**/*'],
      env: {
        browser: true,
        node: false,
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-use-before-define': 0,
        'no-unused-vars': 0,
        'no-undef': 0,
        'no-restricted-globals': 0,
      },
    },
  ],
};
