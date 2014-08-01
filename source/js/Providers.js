var Providers = {
	"instagram": {
		"pattern": {
			"regex": true,
			"string": "https?://(?:i\.|)instagr(?:\.am|am\.com)/p/.+"
		},
		"get": function(target, size, URL, cb) {
			var instagramID = parseURL(URL.replace(/\/$/, "")).segments.pop();
			switch (size) {
				case "small":
					var suffixInstagram = "t"
					break;
				case "medium":
					var suffixInstagram = "m"
					break;
				case "large":
					var suffixInstagram = "l"
					break;
			}
			var instagramURL = "http://api.instagram.com/oembed?url=" + URL.replace("i.instagram", "instagram");

			_ajax(instagramURL, "GET", "json", null, function(data) {
				var finalURL = "http://instagr.am/p/" + instagramID + "/media/?size=" + suffixInstagram;
				if (data.type == "photo") {
					var imgURL = data.url;
					cb(target, finalURL, imgURL, false, size);
				} else {
					var content = "http://instagr.am/p/" + instagramID + "/media/?size=l";
					cb(target, finalURL, content, false, size);
				}
			})

		}
	}
};