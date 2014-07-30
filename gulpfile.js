var gulp = require("gulp");
var minifyCSS = require("gulp-minify-css");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");

var jsFiles = ["source/js/content.js"];

gulp.task("concat", function() {
	gulp.src(jsFiles)
		.pipe(concat('BTD.js'))
		.pipe(gulp.dest('source/js/'))
})

gulp.task("watch", function() {
	gulp.watch('source/js/**/*.js', ['concat']);
})