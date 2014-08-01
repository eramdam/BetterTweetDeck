desc('Build the extension .zip file')
task('build', function() {
	var cmds = [
		"gulp uglify",
		"gulp sass",
		"rm -r build*",
		"cp -R source/ build/",
		"rm build/**/*.scss",
		"rm build/js/*.js",
		"cp source/js/{BTD,libs}.js build/js/",
		"zip -r build.zip build/"
	];

	jake.exec(cmds, {printStdout: true, printStderr: true, breakOnError: false});
})


task('default', jake.showAllTaskDescriptions)