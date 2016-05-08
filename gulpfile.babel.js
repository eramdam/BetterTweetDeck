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
import buffer from 'vinyl-buffer';
import eslint from 'gulp-eslint';
import uglify from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';
import gutil from 'gulp-util';

// CSS
import postcss from 'gulp-postcss';
import cssnext from 'postcss-cssnext';
import cssnano from 'cssnano';
import nested from 'postcss-nested';

const staticFiles = [
  'manifest.json',
  'icons/*.png',
].map((i) => path.resolve('src/', i));

const cssFiles = [
  'src/css/index.css',
];

const toLintFiles = [
  'src/js/**/*.js',
  '*.js',
];

const postCssPlugins = [
  cssnext,
  nested,
  cssnano({ autoprefixer: false, zindex: false }),
];

const maybeNotifyErrors = () => notify.onError({
  title: 'Compile Error',
  message: '<%= error.message %>',
});

const isProduction = () => gutil.env.type === 'production';

const buildWithBrowserify = (entry) => {
  return browserify({
    entries: entry,
    debug: !isProduction(),
  })
  .transform('babelify')
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
* Remove the build/ folder (used before build)
*
*/
gulp.task('clean', () => del(['dist/']));

/*
*
* `gulp static`
* Simply copy files like images/json to the build folder
*
*/
gulp.task('static', () => (
  gulp.src(staticFiles, { base: './src' }).pipe(gulp.dest('./dist'))
));

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

gulp.task('js', ['js-content', 'js-injected', 'js-background']);

/**
 * `gulp css`
 * Compile the css files using PostCSS + cssnext
 */
gulp.task('css', () => (
  gulp.src(cssFiles)
    .pipe(postcss(postCssPlugins))
    .pipe(isProduction() ? gutil.noop() : plumber())
    .pipe(gulp.dest('./dist/css'))
));

/**
 * `gulp lint`
 * Lint the JS files (Gulpfile as well)
 */
gulp.task('lint', () => (
  gulp.src(toLintFiles)
    .pipe(eslint())
    .pipe(eslint.format())
    // .pipe(eslint.failAfterError())
));

/*
*
* `gulp build`
* Build the project
*
*/
gulp.task('build', (done) => {
  runSequence('clean', ['js', 'js-injected', 'static', 'css'], done);
});

/*
*
* `gulp`
* Watches on modifications
*
*/
gulp.task('default', (done) => {
  runSequence('clean', ['css', 'js', 'static'], () => {
    gulp.watch('./src/js/**/*.js', ['js']);
    gulp.watch('./src/css/**/*.css', ['css']);
    gulp.watch(staticFiles, ['static']);
    done();
  });
});
