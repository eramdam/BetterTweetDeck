const chalk = require('chalk');
const path = require('path');
const stringifyPackage = require('stringify-package');

const [, , version] = process.argv;
const semver = require('semver');
const childProcess = require('child_process');
const fs = require('fs');

// eslint-disable-next-line no-console
const clog = (color, ...args) => console.log(chalk[color](...args));

const packageJson = require('../package.json');

if (!semver.valid(version)) {
  clog('red', 'This is not a valid version. Format should be of "1.2.3"');
  process.exit(1);
}

if (!semver.gt(version, packageJson.version)) {
  clog(
    'red',
    `The version you passed needs to be higher than the current version. Yours: ${version}, current: ${packageJson.version}`
  );
  process.exit(1);
}

clog('green', 'Version valid!');
clog('blue', `Bumping to ${version}`);

const newPackageJson = Object.assign(packageJson, {
  version,
  extension_version: version,
});

clog('blue', `Writing ${path.resolve(__dirname, '../package.json')}`);
fs.writeFileSync(path.resolve(__dirname, '../package.json'), stringifyPackage(newPackageJson), {
  encoding: 'utf8',
});
clog('green', `Wrote ${path.resolve(__dirname, '../package.json')}`);
clog('blue', 'Committing changes');
childProcess.execSync('git add package.json');
childProcess.execSync(`git commit -m "Bump to version ${version}"`);
clog('green', 'Commited changes');

clog('blue', `Creating git tag with ${version}`);
childProcess.execSync(`git tag ${version}`);
clog('green', `Created tag ${version}`);
