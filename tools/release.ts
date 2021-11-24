import * as archiver from 'archiver';
import * as chalk from 'chalk';
import {execa} from 'execa';
import {createWriteStream} from 'fs';
import * as path from 'path';

import * as packageJson from '../package.json';

const extensionPath = path.resolve(__dirname, '../dist');

(async () => {
  const chromeBuild = execa('npm', ['run', 'build:chrome']);
  console.log(chalk.blue('Building for Chrome/Edge'));
  // chromeBuild.stderr?.pipe(process.stderr);
  await chromeBuild;
  await zip(
    extensionPath,
    path.resolve(__dirname, '../artifacts/', `better-tweetdeck-${packageJson.version}.chrome.zip`)
  );

  const firefoxBuild = execa('npm', ['run', 'build:firefox']);

  console.log(chalk.blue('Building for Firefox'));
  // firefoxBuild.stderr?.pipe(process.stderr);
  await firefoxBuild;
  await zip(
    extensionPath,
    path.resolve(__dirname, '../artifacts/', `better-tweetdeck-${packageJson.version}.firefox.zip`)
  );

  const safariBuild = execa('npm', ['run', 'build:safari']);

  console.log(chalk.blue('Building for Safari'));
  // safariBuild.stderr?.pipe(process.stderr);
  await safariBuild;

  console.log(chalk.blue('Running XCode build'));
  const xcodeBuild = execa('npm', ['run', 'pack:safari']);
  xcodeBuild.stderr?.pipe(process.stderr);
  await xcodeBuild;
})();

function zip(source: string, saveTo: string, destPath: string | false = false) {
  return new Promise<void>((resolve, reject) => {
    const output = createWriteStream(saveTo);
    const archive = archiver('zip');

    archive.directory(source, destPath);
    archive.on('error', reject);
    archive.pipe(output);

    output.on('close', () => {
      resolve();
      console.log(chalk.green(`Archive saved as ${path.basename(saveTo)}`));
    });
    archive.finalize();
  });
}
