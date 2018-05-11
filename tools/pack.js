const chalk = require("chalk");
const config = require("config");

// eslint-disable-next-line no-console
const clog = (color, ...args) => console.log(chalk[color](...args));
const fs = require("fs");
const path = require("path");

if (!config.get("opera_key")) {
  clog("red", "Please provide a private key file");
  process.exit();
}

const privateKeyPath = path.resolve(config.get("opera_key"));
const extensionPath = path.resolve(__dirname, "../dist");
const ChromeExtension = require("crx");

const crx = new ChromeExtension({
  privateKey: fs.readFileSync(privateKeyPath)
});

clog(
  "blue",
  `Loading extension from ${extensionPath} with key from ${privateKeyPath}`
);

crx.load(extensionPath).then(
  d => {
    clog("blue", "Loaded", d.manifest.short_name, d.manifest.version);

    return crx.pack().then(buffer => {
      fs.writeFile(
        path.resolve(__dirname, "../artifacts/", "better-tweetdeck.crx"),
        buffer,
        err => {
          if (err) {
            clog("red", err);
          }

          clog("green", "Saved better-tweetdeck.crx");
        }
      );
      fs.writeFile(
        path.resolve(__dirname, "../artifacts/", "better-tweetdeck.nex"),
        buffer,
        err => {
          if (err) {
            clog("red", err);
          }

          clog("green", "Saved better-tweetdeck.nex");
        }
      );
    });
  },
  err => {
    if (err) {
      clog("red", err);
      clog("blue", "Try to run `npm run build` before executing this script");
    }
  }
);
