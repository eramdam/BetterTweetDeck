desc('Build the extension .zip file')
task('build', function() {
	jake.exec('gulp uglify');
	jake.exec('gulp sass');
	jake.exec('rm -r build/; cp -R source/ build/; rm build/**/*.scss; rm build/js/*.js; cp source/js/{BTD,libs}.js build/js/; zip -r build.zip build/');
})


task('default', jake.showAllTaskDescriptions)