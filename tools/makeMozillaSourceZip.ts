import * as archiver from 'archiver';
import {createWriteStream} from 'fs';
import * as path from 'path';

import * as packageJson from '../package.json';

(async () => {
  const output = createWriteStream(
    path.resolve(__dirname, '../artifacts/', `source-${packageJson.version}.zip`)
  );

  const archive = archiver('zip');

  archive.glob('*/**/*.*', {
    cwd: path.resolve(__dirname, '../'),
    dot: true,
    ignore: [
      '.git/**/*',
      'node_modules/**/*',
      'dist/**/*',
      'artifacts/**/*',
      'safari/Better TweetDeck for Safari/build/**/*',
    ],
  });
  archive.on('error', (err) => {
    throw err;
  });
  archive.pipe(output);

  // archive.on('progress', console.log);
  archive.on('entry', (entry) => {
    // @ts-expect-error
    console.log(entry.sourcePath);
  });
  archive.on('close', () => {});
  archive.finalize();
})();
