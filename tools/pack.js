const chalk = require('chalk');
const clog = (color, ...args) => console.log(chalk[color](...args));
const fs = require('fs');
const path = require('path');

if (!process.argv[2]) {
  clog('red', 'Please provide a private key file');
  process.exit();
}

const privateKeyPath = path.resolve(process.argv[2]);
const extensionPath = path.resolve(__dirname, '../dist');
const ChromeExtension = require('crx');
const crx = new ChromeExtension({
  privateKey: fs.readFileSync(privateKeyPath),
});


clog('blue', `Loading extension from ${extensionPath} with key from ${privateKeyPath}`);

crx.load(extensionPath)
  .then((d) => {
    clog('blue', 'Loaded', d.manifest.short_name, d.manifest.version);

    return crx.pack().then(buffer => {
      fs.writeFile(path.resolve(__dirname, '../packed/', 'better-tweetdeck.crx'), buffer, (err) => {
        if (err) {
          clog('red', err);
        }

        clog('green', 'Saved better-tweetdeck.crx');
      });
      fs.writeFile(path.resolve(__dirname, '../packed/', 'better-tweetdeck.nex'), buffer, (err) => {
        if (err) {
          clog('red', err);
        }

        clog('green', 'Saved better-tweetdeck.nex');
      });
    });
  }, (err) => {
    if (err) {
      clog('red', err);
      clog('blue', 'Try to run `npm run build` before executing this script');
    }
  });
