// Gulp & utils
import path from 'path';
import gulp from 'gulp';
import runSequence from 'run-sequence';
import del from 'del';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';

// JS
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import vinylBuffer from 'vinyl-buffer';
import uglify from 'gulp-uglify';
import zip from 'gulp-zip';
import sourcemaps from 'gulp-sourcemaps';
import gutil from 'gulp-util';
import remoteSrc from 'gulp-remote-src';

// CSS
import postcss from 'gulp-postcss';
import cssnext from 'postcss-cssnext';
import cssnano from 'cssnano';
import nested from 'postcss-nested';
import cssimport from 'postcss-import';
import url from 'postcss-url';


const staticFiles = [
  'icons/*.png',
  'fonts/*',
  'emojis/sheet_twitter_64.png',
  'options/**/*.html',
  'options/ui/*',
  'options/img/*',
  '_locales/**/*',
].map(i => path.resolve('src/', i));

const postCssPlugins = [
  cssimport,
  cssnext,
  nested,
  url({
    url: 'inline',
    from: './src/css/index.css',
  }),
  cssnano({ autoprefixer: false, zindex: false }),
];

const maybeNotifyErrors = () => notify.onError({
  title: 'Compile Error',
  message: '<%= error.message %>',
});

const isProduction = () => gutil.env.type === 'production';
const browser = gutil.env.browser || 'chrome';


const buildWithBrowserify = (entry) => {
  return browserify({
    entries: entry,
    debug: !isProduction() && browser !== 'firefox',
  })
    .transform('babelify')
    .transform('brfs')
    .transform('config-browserify')
    .bundle()
    .on('error', maybeNotifyErrors())
    .pipe(source(path.basename(entry)))
    .pipe(vinylBuffer())
    .pipe(browser === 'firefox' ? gutil.noop() : sourcemaps.init({ loadMaps: true }))
    .pipe(isProduction() && browser !== 'firefox' ? uglify() : gutil.noop())
    .pipe(browser === 'firefox' ? gutil.noop() : sourcemaps.write('./'));
};

/*
*
* `gulp clean`
* Remove the dist/ folder (used before build)
*
*/
gulp.task('clean', () => del(['dist/']));

/*
*
* `gulp zip`
* zips the dist/ folder (used before build)
*
*/
gulp.task('zip', () => (
  gulp.src('dist/**/*')
    .pipe(zip(`dist-${browser}.zip`))
    .pipe(gulp.dest('artifacts/'))
));

/*
*
* `gulp static`
* Simply copy files like images/json to the build folder
*
*/
gulp.task('static', () => gulp.src(staticFiles, { base: './src' }).pipe(gulp.dest('./dist')));

gulp.task('static-news', () => gulp.src('./CHANGELOG.md').pipe(gulp.dest('./dist/options/')));

gulp.task('embed_instagram', () => {
  return remoteSrc(['embeds.js'], {
    base: 'https://platform.instagram.com/en_US/',
  })
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'));
});

/*
*
* `gulp js`
* Run babeljs + browserify on the js background.js/content.js files
*
*/
gulp.task('js-content', () => {
  return buildWithBrowserify('src/js/content.js')
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('js-injected', () => {
  return buildWithBrowserify('src/js/inject.js')
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('js-background', () => {
  return buildWithBrowserify('src/js/background.js')
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('js-options', () => {
  return buildWithBrowserify('src/options/options.js')
    .pipe(gulp.dest('./dist/options'));
});

gulp.task('js', ['js-content', 'js-injected', 'js-background', 'js-options']);

/**
 * `gulp css`
 * Compile the css files using PostCSS + cssnext
 */
gulp.task('css', () => (
  gulp.src('src/css/index.css')
    .pipe(postcss(postCssPlugins))
    .pipe(isProduction() ? gutil.noop() : plumber())
    .pipe(gulp.dest('./dist/css'))
));

gulp.task('css-options', () => (
  gulp.src('src/css/options/index.css')
    .pipe(postcss(postCssPlugins))
    .pipe(isProduction() ? gutil.noop() : plumber())
    .pipe(gulp.dest('./dist/options/css'))
));

/*
*
* `gulp build`
* Build the project
*
*/
gulp.task('build', (done) => {
  let tasks = ['clean', 'manifest', ['js', 'static', 'css', 'css-options'], 'static-news', 'embed_instagram', 'zip'];

  if (browser === 'firefox') {
    tasks = tasks.filter(t => t !== 'embed_instagram');
  }

  runSequence(...tasks, done);
});

/*
*
* `gulp manifest`
* Build the manifest
*
*/

const stream = require('stream');

const stringSrc = (filename, string) => {
  const src = stream.Readable({ objectMode: true });
  src._read = function read() {
    this.push(new gutil.File({
      cwd: '',
      base: '',
      path: filename,
      contents: Buffer.from(string),
    }));
    this.push(null);
  };

  return src;
};

const browserManifest = require(`./tools/manifests/${browser}.js`);

gulp.task('manifest', () => {
  const manifestJson = JSON.stringify(browserManifest, null, 2);

  return stringSrc('manifest.json', manifestJson).pipe(gulp.dest('./dist/'));
});

/*
*
* `gulp`
* Watches on modifications
*
*/
gulp.task('default', (done) => {
  const tasks = ['clean', 'manifest', ['css', 'css-options', 'js', 'static'], 'static-news'];

  if (browser !== 'firefox') {
    tasks.push('embed_instagram');
  }

  runSequence(...tasks, () => {
    gulp.watch(['./src/js/**/*.js', './src/options/*.js'], ['js', 'js-options']);
    gulp.watch(['./src/css/**/*.css'], ['css', 'css-options']);
    gulp.watch(staticFiles, ['static', 'static-news']);
    gulp.watch('./CHANGELOG.md', ['static-news']);
    done();
  });
});
