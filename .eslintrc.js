module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: ['airbnb', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
};
