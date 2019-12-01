module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-hooks'],
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
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
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
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
