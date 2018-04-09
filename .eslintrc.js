module.exports = {
  extends: "airbnb",
  env: {
    browser: true,
    node: true,
    jquery: true
  },
  parser: "babel-eslint",
  rules: {
    "import/prefer-default-export": 0
  }
};