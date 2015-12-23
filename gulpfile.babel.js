import path from 'path';
import gulp from 'gulp';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import runSequence from 'run-sequence';
import del from 'del';


let staticFiles = [
  'manifest.json',
  'icons/*.png',
].map((i) => path.resolve('source/', i));

let jsFiles = [
  'content.js',
].map((i) => path.resolve(`source/js`, i));

let injectedFiles = [
  'inject.js',
].map((i) => path.resolve(`source/js`, i));


/*
*
* `gulp clean`
* Remove the build/ folder (used before build)
*
*/
gulp.task('clean', (done) => {
  del('build/', done);
});

/*
*
* `gulp static`
* Simply copy files like images/json to the build folder
*
*/
gulp.task('static', () => {
  return gulp.src(staticFiles, { base: './source'})
  .pipe(gulp.dest('./build'));
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
    .transform('babelify', {presets: ['es2015']})
    .bundle()
    .pipe(source('content.js'))
    .pipe(gulp.dest('./build/js'));
});

gulp.task('js-injected', () => {
    return browserify({
      entries: injectedFiles,
      debug: true
    })
    .transform('babelify', {presets: ['es2015']})
    .bundle()
    .pipe(source('inject.js'))
    .pipe(gulp.dest('./build/js'));
});

/*
*
* `gulp build`
* Build the project
*
*/
gulp.task('build', runSequence('clean', ['js', 'static']));

/*
*
* `gulp`
* Watches on modifications
*
*/
gulp.task('default', (done) => {
  runSequence('clean', ['js', 'static', 'js-injected'], () => {
    gulp.watch('./source/js/*.js', ['js', 'js-injected']);
    gulp.watch(staticFiles, ['static']);
    done();
  });
});