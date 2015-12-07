var embedKey = '8bc612a8bb5f4f90b0fb1144c18e6270';

var Providers = {
	"500px": {
		"pattern": {
			"regex": false,
			"string": "500px.com"
		},
		"get": function(target, size, URL, cb) {
			var photoID = parseURL(URL).segments[1];
			switch (size) {
				case "small":
					var suffixFiveHundred = "2"
					break;
				case "medium":
					var suffixFiveHundred = "3"
					break;
				case "large":
					var suffixFiveHundred = "3"
					break;
			}
			var fivehundredURL = "https://api.500px.com/v1/photos/" + photoID + "?consumer_key=8EUWGvy6gL8yFLPbuF6A8SvbOIxSlVJzQCdWSGnm";

			_ajax(fivehundredURL, "GET", "json", null, function(data) {
				var picURL = data.photo.image_url.replace(/[0-9].jpg$/, suffixFiveHundred + ".jpg");
				var fullPicURL = data.photo.image_url;
				cb(target, picURL, fullPicURL, false, size);
			});
		}
	},
	"cloudapp": {
		"pattern": {
			"regex": false,
			"string": "cl.ly/"
		},
		"get": function(target, size, linkURL, cb) {
			var headers = {
				"Accept": "application/json"
			};
			linkURL = linkURL.replace("http://","https://");
			_ajax(linkURL, "GET", "json", headers, function(data) {
				if (data.item_type == "image") {
					var thumbnailUrl = data.thumbnail_url;
					cb(target, GoogleSafeURL(thumbnailUrl), GoogleSafeURL(data.content_url), false, size);
				}
			});
		}
	},
	"dailymotion": {
		"pattern": {
			"regex": false,
			"string": "dailymotion.com/video"
		},
		"get": function(target, size, linkURL, cb) {
			var dailymotionID = parseURL(linkURL).segments[1];
			var dailymotionURL = 'https://api.dailymotion.com/video/' + dailymotionID + '?fields=thumbnail_240_url,thumbnail_360_url,thumbnail_180_url,embed_html';
			if (size == "large") {
				_ajax(dailymotionURL, "GET", "json", null, function(data) {
					cb(target, GoogleSafeURL(data.thumbnail_360_url), data.embed_html.replace("http://", "https://"), true, size);
				});

			} else if (size == "medium") {
				_ajax(dailymotionURL, "GET", "json", null, function(data) {
					cb(target, GoogleSafeURL(data.thumbnail_240_url), data.embed_html.replace("http://", "https://"), true, size);
				});
			} else if (size == "small") {
				_ajax(dailymotionURL, "GET", "json", null, function(data) {
					cb(target, GoogleSafeURL(data.thumbnail_180_url), data.embed_html.replace("http://", "https://"), true, size);
				});
			}
		}
	},
	"deviantart": {
		"pattern": {
			"regex": true,
			"string": "(deviantart\.com\\/art|fav\.me|sta\.sh)"
		},
		"get": function(target, size, linkURL, cb) {
			var deviantURL = 'https://backend.deviantart.com/oembed?url=' + encodeURIComponent(linkURL);

			_ajax(deviantURL, "GET", "json", null, function(data) {
				if (data.type == "photo") {
					cb(target, data.thumbnail_url, data.url, false, size);
				}
			});
		}
	},
	"dribbble": {
		"pattern": {
			"regex": true,
			"string": "(dribbble.com\/shots|drbl.in)"
		},
		"get": function(target, thumbSize, linkURL, cb) {
			var dribbbleID = parseURL(linkURL).file.split("-").shift();
			var dribbleURL = 'https://api.dribbble.com/shots/' + dribbbleID;

			_ajax(dribbleURL, "GET", "json", null, function(data) {
				cb(target, data.image_teaser_url, data.image_url, false, thumbSize);
			});
		}
	},
	"droplr": {
		"pattern": {
			"regex": false,
			"string": "d.pr/i"
		}, 
		"get": function(target, size, linkURL, cb) {
			if (size == "small") {
				var suffixDroplr = size;
			} else {
				var suffixDroplr = "medium";
			}
			// Removing the last "/" if present and adding one+suffix
			var thumbnailUrl = linkURL.replace(/\/$/, "");
			var thumbnailUrl = thumbnailUrl + "/" + suffixDroplr;
			cb(target, thumbnailUrl.replace('http://','https://'), linkURL.replace('http://','https://') + "+", false, size);
		}
	},
	"flickr": {
		"pattern": {
			"regex": true,
			"string": "(flic.kr|flickr.com)"
		},
		"get": function(target, thumbSize, linkURL, cb) {
			var maxWidth;
			if (thumbSize == "large") maxWidth = 350;
			if (thumbSize == "medium") maxWidth = 280;
			if (thumbSize == "small") maxWidth = 150;
			var flickURL = encodeURIComponent(linkURL);
			flickURL = 'https://www.flickr.com/services/oembed/?url=' + flickURL + '&format=json&maxwidth=' + maxWidth;

			_ajax(flickURL, "GET", "json", null, function(data) {
				cb(target, data.url, data.url.replace(/_[a-z].jpg$/g, "_z.jpg"), false, thumbSize);
			});
		}
	},
	"ted": {
		"pattern": {
			"regex": false,
			"string": "ted.com/talks"
		},
		"get": function(target, thumbSize, linkURL, cb) {
			var bandcampURL = encodeURIComponent(linkURL);
			bandcampURL = 'https://api.embed.ly/1/oembed?key='+ embedKey +'&url=' + bandcampURL + '&format=json';

			_ajax(bandcampURL, "GET", "json", null, function(data) {
				var embed = data.html;
				var thumbnailBandcamp = data.thumbnail_url;
				cb(target, GoogleSafeURL(thumbnailBandcamp), embed, true, thumbSize);
			});
		}
	},
	"bandcamp": {
		"pattern": {
			"regex": false,
			"string": "bandcamp.com"
		},
		"get": function(target, thumbSize, linkURL, cb) {
			var bandcampURL = encodeURIComponent(linkURL);
			bandcampURL = 'https://api.embed.ly/1/oembed?key='+ embedKey +'&url=' + bandcampURL + '&format=json';

			_ajax(bandcampURL, "GET", "json", null, function(data) {
				var embed = data.html;
				var thumbnailBandcamp = data.thumbnail_url;
				cb(target, GoogleSafeURL(thumbnailBandcamp), embed, true, thumbSize);
			});
		}
	},
	"imgur": {
		"pattern": {
			"regex": false,
			"string": "imgur.com"
		},
		"get": function(target, size, linkURL, cb) {
			var imgurClientIDs = ["c189a7be5a7a313", "180ce538ef0dc41"];
			if (!new RegExp(/\.(jpg|png|gif|gifv)/g).test(linkURL)) {
				var headers = {
					"Authorization": "Client-ID " + getClientID()
				};
				// Setting the right suffix depending of the user's option
				switch (size) {
					case "small":
						var suffixImgur = "t"
						break;
					case "medium":
						var suffixImgur = "m"
						break;
					case "large":
						var suffixImgur = "l"
						break;
				}
				var imgurID = parseURL(linkURL).path.split('/').pop().split('.').shift();
				// Album
				if (linkURL._contains("imgur.com/a/")) {
					previewFromAnAlbum(imgurID);
				} else if (linkURL._contains("imgur.com/gallery/")) {
					var galleryURL = "https://api.imgur.com/3/gallery/image/" + imgurID;

					_ajax(galleryURL, "GET", "json", headers, onSuccess, onFailure);
				} else {
					// Single image
					var imgurID = parseURL(linkURL).file.split(".").shift();
					cb(target, "https://i.imgur.com/" + imgurID + suffixImgur + ".jpg", "https://i.imgur.com/" + imgurID + ".jpg", false, size);
				}
			}

			function getClientID() {
				return imgurClientIDs[Math.floor(Math.random() * imgurClientIDs.length)];
			}
			

			function previewFromAnAlbum(albumID) {
				var albumURL = "https://api.imgur.com/3/album/" + albumID;
				_ajax(albumURL, "GET", "json", headers, function(data)  {
					var thumbnailUrl = "https://i.imgur.com/" + data.data.cover + suffixImgur + ".jpg";
					var albumIframe = '<iframe class="imgur-album" width="708" height="550" frameborder="0" src="https://imgur.com/a/' + albumID + '/embed"></iframe>';
					cb(target, thumbnailUrl, albumIframe, true, size);
				});
			}

			function onFailure(data) {
				previewFromAnAlbum(imgurID, "https://imgur.com/a/" + imgurID + "/embed");
			}

			function onSuccess(data)  {
				var thumbnailUrl = "https://i.imgur.com/" + data.data.id + suffixImgur + ".jpg";
				cb(target, thumbnailUrl, thumbnailUrl.replace(/[a-z].jpg/, ".jpg"), false, size);
			}
		}
	},
	"instagram": {
		"pattern": {
			"regex": true,
			"string": "https?://(?:i\.|)instagr(?:\.am|am\.com)/p/.+"
		},
		"get": function(target, size, URL, cb) {
			var instagramentClientIDs = ["66bc9005ac964972bc940b690525c2d0", "72359a821b09408ba4b9e329c1acb021", "e6329b1fe3f94230be95ecd81ec00103"];
			var instagramID = parseURL(URL.replace(/\/$/, "")).segments.pop();
			switch (size) {
				case "small":
					var suffixInstagram = "thumbnail"
					break;
				case "medium":
					var suffixInstagram = "low_resolution"
					break;
				case "large":
					var suffixInstagram = "low_resolution"
					break;
			}
			var instagramURL = "https://api.instagram.com/v1/media/shortcode/"+instagramID+"?client_id="+getClientID();

			_ajax(instagramURL, "GET", "json", null, function(data) {
				var finalURL = data.data.images[suffixInstagram].url.replace('http://','https://');
				if (data.data.type == "image") {
					var imgURL = data.data.images["standard_resolution"].url.replace('http://', 'https://');
					cb(target, finalURL, imgURL, false, size);
				} else if (data.data.type == "video") {
					var content = '<video src="" ></video>';
					var content = '<video src="'+data.data.videos['standard_resolution'].url.replace('http://','https://')+'" controls autoplay loop></video>';
					cb(target, finalURL, content, true, size);
				}
			});

			function getClientID() {
				return instagramentClientIDs[Math.floor(Math.random() * instagramentClientIDs.length)];
			}

		}
	},
	"imgly": {
	    "pattern": {
	    		"regex": false,
	    		"string": "img.ly"
	    },
	    "get": function(target, thumbSize, linkURL, cb) {
    		var imglyID = parseURL(linkURL).file;
			if (thumbSize == "small") {
				var suffixImgly = "thumb";
			} else {
				var suffixImgly = thumbSize;
			}
			var finalImglyURL = "http://img.ly/show/" + suffixImgly + "/" + imglyID;
			cb(target, GoogleSafeURL(finalImglyURL), "http://img.ly/show/full/" + imglyID, false, thumbSize);
	    }
	},
	"mobyto": {
		"pattern": {
			"regex": false,
			"string": "moby.to/"
		},
		"get": function(target, thumbSize, linkURL, cb) {
			var mobyID = parseURL(linkURL).file;
			var sizeMobyto;
			switch (thumbSize) {
				case "small":
					sizeMobyto = "thumbnail"
					break;
				case "medium":
					sizeMobyto = "medium"
					break;
				case "large":
					sizeMobyto = "medium"
					break;
			}
			cb(target, GoogleSafeURL("http://moby.to/" + mobyID + ":" + sizeMobyto), GoogleSafeURL("http://moby.to/" + mobyID + ":full"), false, thumbSize);
		}
	},
	"soundcloud": {
		"pattern": {
			"regex": false,
			"string": "soundcloud.com/"
		},
		"get": function(target, thumbSize, linkURL, cb) {
			var soundcloudURL = 'https://soundcloud.com/oembed?format=json&url=' + linkURL;

			_ajax(soundcloudURL, "GET", "json", null, function(data) {
				cb(target, GoogleSafeURL(data.thumbnail_url), data.html.replace('width="100%"', 'width="600"'), true, thumbSize);
			});
		}
	},
	"toresize": {
		"pattern": {
			"regex": true,
			"string": ".(jpg|gif|png|jpeg)$"
		},
		"get": function(target, size, URL, cb) {
			if (URL.indexOf("dropbox.com") == -1 && URL.indexOf("tumblr.com") == -1) {
				var suffixResize;
				switch (size) {
					case "small":
						var suffixResize = 150
						break;
					case "medium":
						var suffixResize = 280;
						break;
					case "large":
						var suffixResize = 360;
						break;
				}
				var resizedURL = 'https://images4-focus-opensocial.googleusercontent.com/gadgets/proxy?url=' + encodeURIComponent(URL) + '&container=focus&resize_w=' + suffixResize + '&refresh=86400';
				cb(target, resizedURL, URL, false, size);
			}
		}
	},
	"tumblr": {
		"pattern": {
			"regex": true,
			"string": "tumblr.com\/.+(\.(gif|png|jpg)$)"
		},
		"get": function(target, size, URL, cb) {
				var suffixResize;
				switch (size) {
					case "small":
						var suffixResize = 150
						break;
					case "medium":
						var suffixResize = 280;
						break;
					case "large":
						var suffixResize = 360;
						break;
				}
				var resizedURL = 'https://images4-focus-opensocial.googleusercontent.com/gadgets/proxy?url=' + encodeURIComponent(URL) + '&container=focus&resize_w=' + suffixResize + '&refresh=86400';
				cb(target, resizedURL, URL, false, size);
		}
	},
	"vimeo": {
		"pattern": {
			"regex": true,
			"string": "vimeo.com\/[0-9]*$"
		},
		"get": function(target, thumbSize, linkURL, cb) {
			var suffixVimeo;
			switch (thumbSize) {
				case "small":
					suffixVimeo = "150"
					break;
				case "medium":
					suffixVimeo = "280"
					break;
				case "large":
					suffixVimeo = "360"
					break;
			}
			var vimeoID = parseURL(linkURL).segments.shift();
			var vimeoURL = 'https://vimeo.com/api/oembed.json?maxwidth=' + suffixVimeo + '&url=http%3A//vimeo.com/' + vimeoID;

			_ajax(vimeoURL, "GET", "json", null, function(data) {
				var thumbnailVimeo = data.thumbnail_url;
				_ajax('https://vimeo.com/api/oembed.json?maxwidth=1024&url=http%3A//vimeo.com/' + vimeoID, "GET", "json", null, function(data) {
					cb(target, thumbnailVimeo, data.html, true, thumbSize);
				});
			});
		}
	},
	"yfrog": {
		"pattern": {
			"regex": false,
			"string": "yfrog.com"
		},
		"get": function(target, thumbSize, linkURL, cb) {
			linkURL = linkURL.replace(/[a-z]+\.yfrog.com/g,"yfrog.com");
			var suffixYfrog;
			switch (thumbSize) {
				case "small":
					suffixYfrog = 150;
					break;
				case "medium":
					suffixYfrog = 280;
					break;
				case "large":
					suffixYfrog = 360;
					break;
			}

			var reqURL = "https://noembed.com/embed?maxwidth="+suffixYfrog+"&url="+encodeURIComponent(linkURL);

			_ajax(reqURL, "GET", "json", null, function(data) {
				var fullImage = data.media_url.replace("https://noembed.com/i/"+suffixYfrog+"/0/","");
				cb(target, data.media_url, fullImage, false, thumbSize);
			});			
		}
	}
};

// Sample Provider object
// "provider": {
//     "pattern": {
//     		"regex": true|false,
//     		"string": ""
//     },
//     "get": function(target, thumbSize, linkURL, cb) {
//     		// code
//     }
// }

