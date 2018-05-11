const cssnext = require("postcss-cssnext");
const cssnano = require("cssnano");
const nested = require("postcss-nested");
const cssimport = require("postcss-import");
const url = require("postcss-url");

module.exports = {
  plugins: [
    cssimport,
    cssnext,
    nested,
    url({
      url: "inline",
      from: "./src/css/index.css"
    }),
    cssnano({ autoprefixer: false, zindex: false })
  ]
};
