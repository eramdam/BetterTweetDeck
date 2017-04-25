const needle = require('needle');
const fs = require('fs');

const out = fs.createWriteStream('./dist/embeds.js');
needle.get('https://platform.instagram.com/en_US/embeds.js').pipe(out);
