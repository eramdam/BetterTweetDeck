var Providers = {
	"instagram": {
		"pattern": {
			"regex": true,
			"string": "https?://(?:i\.|)instagr(?:\.am|am\.com)/p/.+"
		},
		"get": function(target, size, URL, cb) {
			var instagramID = parseURL(URL.replace(/\/$/, "")).segments.pop();
			var suffixInstagram = "m";
			var instagramURL = "http://api.instagram.com/oembed?url=" + URL.replace("i.instagram","instagram");

			_ajax(instagramURL, "GET", "json", null, function(data) {
				var finalURL = "http://instagr.am/p/" + instagramID + "/media/?size=" + suffixInstagram;
				if (!data.type == "video") {
					cb(target, finalURL, data.url, false, size);
				} else {
					cb(target, finalURL, data.html, true, size);
				}
			})

		}
	}
};

function AddPreview(target, finalURL, content, isHTML, size) {
	var dataThumbs = {
		"data_key": target.getAttribute("data-key"),
		"link_to_media": target.querySelector('p > a:last-of-type').href,
		"image": finalURL
	};

	if (size == "small") {
		var tpl = Handlebars.compile(templates.media_small);
	} else if (size == "medium") {
		var tpl = Handlebars.compile(templates.media_medium);
	} else if (size == "large") {
		var tpl = Handlebars.compile(templates.media_large);
	}
	var html = tpl(dataThumbs);

	if (size == "large") {
		target.querySelector('.js-tweet').insertAdjacentHTML("afterend",html);
	} else {
		target.querySelector('p.tweet-text').insertAdjacentHTML("afterend",html);
	}
}

function mediaPreviewSize() {
	var jsColumns = document.querySelectorAll(".js-column[data-column]");
	for (var i = jsColumns.length - 1; i >= 0; i--) {
		var col = jsColumns[i];
		var columnSize = TD.storage.columnController.get(col.getAttribute("data-column")).getMediaPreviewSize() || "medium";
		col.setAttribute("data-media-preview-size", columnSize);
	}
}