var gulp = require("gulp");
var minifyCSS = require("gulp-minify-css");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var include = require("gulp-include");
var sass = require('gulp-sass');

var jsFiles = ["source/js/content.js"];

gulp.task("concat", function() {
	gulp.src(jsFiles)
		.pipe(include())
		.pipe(concat('BTD.js'))
		.pipe(gulp.dest('source/js/'));
	gulp.src(['source/js/handlebars.js', 'source/js/injectScript.js'])
		.pipe(concat("libs.js"))
		.pipe(gulp.dest('source/js'))
});

gulp.task("uglify", function() {
	gulp.src(jsFiles)
		.pipe(include())
		.pipe(uglify())
		.pipe(concat("BTD.js"))
		.pipe(gulp.dest('source/js/'));
	gulp.src(['source/js/handlebars.js', 'source/js/injectScript.js'])
		.pipe(uglify())
		.pipe(concat("libs.js"))
		.pipe(gulp.dest('source/js'))
});

gulp.task('sass', function() {
	gulp.src('source/styles/*.scss')
		.pipe(sass({
			outputStyle: "compressed"
		}))
		.pipe(gulp.dest('source/styles'));
})

gulp.task("watch", function() {
	gulp.watch('source/js/**/*.js', ['concat']);
	gulp.watch('source/styles/*.scss', ['sass']);
});