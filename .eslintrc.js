module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-hooks', 'unused-imports', 'simple-import-sort'],
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
        'simple-import-sort/sort': 2,
        'unused-imports/no-unused-imports-ts': 2,
        'no-use-before-define': 0,
        'no-unused-vars': 0,
        'no-undef': 0,
        'no-restricted-globals': 0,
      },
    },
  ],
};
