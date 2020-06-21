const chalk = require('chalk');

// eslint-disable-next-line no-console
const clog = (color, ...args) => console.log(chalk[color](...args));
const fs = require('fs');
const path = require('path');

const extensionPath = path.resolve(__dirname, '../dist');
const ChromeExtension = require('crx');

const crx = new ChromeExtension({});

clog('blue', `Loading extension from ${extensionPath}`);

crx.load(extensionPath).then(
  (d) => {
    clog('blue', 'Loaded', d.manifest.short_name, d.manifest.version);

    return crx.pack().then((buffer) => {
      fs.writeFile(
        path.resolve(__dirname, '../artifacts/', 'better-tweetdeck.crx'),
        buffer,
        (err) => {
          if (err) {
            clog('red', err);
          }

          clog('green', 'Saved better-tweetdeck.crx');
        }
      );
    });
  },
  (err) => {
    if (err) {
      clog('red', err);
      clog('blue', 'Try to run `npm run build` before executing this script');
    }
  }
);
