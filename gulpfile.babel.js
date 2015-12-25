import path from 'path';
import gulp from 'gulp';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import runSequence from 'run-sequence';
import del from 'del';
import postcss from 'gulp-postcss';
import cssnext from 'postcss-cssnext';
import eslint from 'gulp-eslint';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';

const staticFiles = [
  'manifest.json',
  'icons/*.png'
].map((i) => path.resolve('src/', i));

const jsFiles = [
  'src/js/content.js'
];

const injectedFiles = [
  'src/js/inject.js'
];

const cssFiles = [
  'src/css/index.css'
];

const toLintFiles = [
  'src/js/**/*.js',
  '*.js'
];

const postCssPlugins = [cssnext({
  compress: true,
  sourcemap: true
})];

const maybeNotifyErrors = () => {
  return notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  });
};

/*
*
* `gulp clean`
* Remove the build/ folder (used before build)
*
*/
gulp.task('clean', () => {
  return del(['dist/']);
});

/*
*
* `gulp static`
* Simply copy files like images/json to the build folder
*
*/
gulp.task('static', () => {
  return gulp.src(staticFiles, { base: './src' })
  .pipe(gulp.dest('./dist'));
});

/*
*
* `gulp js`
* Run babeljs + browserify on the js background.js/content.js files
*
*/
gulp.task('js', () => {
  return browserify({
    entries: jsFiles,
    debug: true
  })
  .transform('babelify', { presets: ['es2015'] })
  .bundle()
  .on('error', maybeNotifyErrors())
  .pipe(source('content.js'))
  .pipe(gulp.dest('./dist/js'));
});

gulp.task('js-injected', () => {
  return browserify({
    entries: injectedFiles,
    debug: true
  })
  .transform('babelify', { presets: ['es2015'] })
  .bundle()
  .on('error', maybeNotifyErrors())
  .pipe(source('inject.js'))
  .pipe(gulp.dest('./dist/js'));
});

/**
 * `gulp css`
 * Compile the css files using PostCSS + cssnext
 */
gulp.task('css', function () {
  return gulp.src(cssFiles)
    .pipe(postcss(postCssPlugins))
    .pipe(plumber())
    .pipe(gulp.dest('./dist/css'));
});

/**
 * `gulp lint`
 * Lint the JS files (Gulpfile as well)
 */
gulp.task('lint', function () {
  return gulp.src(toLintFiles)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

/*
*
* `gulp build`
* Build the project
*
*/
gulp.task('build', (done) => {
  runSequence('clean', ['js', 'js-injected', 'static'], done);
});

/*
*
* `gulp`
* Watches on modifications
*
*/
gulp.task('default', (done) => {
  runSequence('clean', ['js', 'static', 'js-injected'], () => {
    gulp.watch('./src/js/**/*.js', ['js', 'js-injected']);
    gulp.watch('./src/css/**/*.css', ['css']);
    gulp.watch(staticFiles, ['static']);
    done();
  });
});