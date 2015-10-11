import path from 'path';
import gulp from 'gulp';
import babelify from 'babelify';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import runSequence from 'run-sequence';
import del from 'del';


let sourcePath = 'source/';
let staticFiles = [
  'manifest.json',
  'icons/*.png',
  'js/inject.js'
].map((i) => path.resolve(sourcePath, i));


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
      entries: './source/js/content.js',
      debug: true
    })
    .transform(babelify)
    .bundle()
    .pipe(source('content.js'))
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
  runSequence('clean', ['js', 'static'], () => {

    gulp.watch('./source/js/*.js', ['js']);
    gulp.watch(staticFiles, ['static']);
    done();
  });
});