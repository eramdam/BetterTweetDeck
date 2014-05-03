var minifier = require("minifier");
var options = {
	template : "{{filename}}.{{ext}}"
}

minifier.on('error', function(err) {
	console.error(err);
})

minifier.minify('./source/js', options);
minifier.minify('./source/', options);
