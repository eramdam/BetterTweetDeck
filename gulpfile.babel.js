// Gulp & utils
import fs from 'fs';
import path from 'path';
import gulp from 'gulp';
import runSequence from 'run-sequence';
import del from 'del';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import config from 'config';
import needle from 'needle';

// JS
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import eslint from 'gulp-eslint';
import uglify from 'gulp-uglify';
import zip from 'gulp-zip';
import sourcemaps from 'gulp-sourcemaps';
import gutil from 'gulp-util';

// CSS
import postcss from 'gulp-postcss';
import cssnext from 'postcss-cssnext';
import cssnano from 'cssnano';
import nested from 'postcss-nested';

const staticFiles = [
  'icons/*.png',
  'emojis/sheet_twitter_64.png',
  'options/**/*.html',
  'options/ui/*',
  'options/img/*',
  '_locales/**/*'
].map((i) => path.resolve('src/', i));

const toLintFiles = [
  'src/js/**/*.js',
  '*.js',
];

const postCssPlugins = [
  require('postcss-import'),
  cssnext,
  nested,
  require('postcss-url')({
    url: 'inline',
    from: './src/css/index.css'
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
    debug: !isProduction(),
  })
  .transform('babelify')
  .transform('brfs')
  .transform('config-browserify')
  .bundle()
  .on('error', maybeNotifyErrors())
  .pipe(source(path.basename(entry)))
  .pipe(buffer())
  .pipe(isProduction() ? gutil.noop() : sourcemaps.init({ loadMaps: true }))
  .pipe(isProduction() ? uglify() : gutil.noop())
  .pipe(isProduction() ? gutil.noop() : sourcemaps.write('./'));
}

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
  gulp.src('dist/*')
  .pipe(zip(`dist-${browser}.zip`))
  .pipe(gulp.dest('artifacts/'))
));

/*
*
* `gulp static`
* Simply copy files like images/json to the build folder
*
*/
gulp.task('static', () => gulp.src(staticFiles, { base: './src' }).pipe(gulp.dest('./dist')) );

gulp.task('static-news', () => gulp.src('./CHANGELOG.md').pipe(gulp.dest('./dist/options/')) );

gulp.task('embed_instagram', (done) => {
  const out = fs.createWriteStream('./dist/embeds.js');
  
  needle.get('https://platform.instagram.com/en_US/embeds.js').pipe(out);
  out.on('end', done);
  out.on('error', done);
});

/*
*
* `gulp js`
* Run babeljs + browserify on the js background.js/content.js files
*
*/
gulp.task('js-content', () => {
  return buildWithBrowserify('src/js/content.js')
  .pipe(gulp.dest('./dist/js'))
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

/**
 * `gulp lint`
 * Lint the JS files (Gulpfile as well)
 */
gulp.task('lint', () => (
  gulp.src(toLintFiles)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
));

/*
*
* `gulp build`
* Build the project
*
*/
gulp.task('build', (done) => {
  const tasks = ['clean', 'manifest', ['js', 'static', 'css', 'css-options'], 'static-news', 'zip'];
  
  if (!config.get('Client.remote_inst'))
    tasks.push('embed_instagram');

  runSequence(...tasks, done);
});

/*
*
* `gulp manifest`
* Build the manifest
*
*/

const string_src = (filename, string) => {
  const src = require('stream').Readable({ objectMode: true });
  src._read = function () {
    this.push(new gutil.File({
      cwd: '',
      base: '',
      path: filename,
      contents: new Buffer(string)
    }));
    this.push(null);
  }

  return src;
}

gulp.task('manifest', (done) => {
  const manifestJson = JSON.stringify(require(`./tools/manifests/${browser}.js`));

  return string_src('manifest.json', manifestJson).pipe(gulp.dest('./dist/'));
});

/*
*
* `gulp`
* Watches on modifications
*
*/
gulp.task('default', (done) => {
  const tasks = ['clean', 'manifest', ['css', 'css-options', 'js', 'static'], 'static-news'];
  
  if (!config.get('Client.remote_inst'))
    tasks.push('embed_instagram');

  runSequence(...tasks, () => {
    gulp.watch(['./src/js/**/*.js',  './src/options/*.js'], ['js', 'js-options']);
    gulp.watch(['./src/css/**/*.css'], ['css', 'css-options']);
    gulp.watch(staticFiles, ['static', 'static-news']);
    gulp.watch('./CHANGELOG.md', ['static-news']);
    done();
  });
});
