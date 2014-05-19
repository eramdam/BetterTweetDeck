var options;
chrome.extension.sendRequest({}, function(response) {
	setAllTheSettings(response);
});

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {

	if (!document.body.classList.contains("btd-ready")) {
		var observer = new MutationObserver(function(mutations) {
			for (var i = mutations.length - 1; i >= 0; i--) {
				if (mutations[0].target.tagName === "BODY" && mutations[0].target.classList.contains('btd-ready')) {
					document.dispatchEvent(new CustomEvent('uiComposeTweet'));
					document.querySelector('textarea.js-compose-text').value = request.text + ' ' + request.url;
					document.querySelector('textarea.js-compose-text').dispatchEvent(new Event('change'));
					observer.disconnect();
				}
			};
		});
		observer.observe(document.body, {
			attributes: true
		});
	} else {
		document.dispatchEvent(new CustomEvent('uiComposeTweet'));
		document.querySelector('textarea.js-compose-text').value = request.text + ' ' + request.url;
		document.querySelector('textarea.js-compose-text').dispatchEvent(new Event('change'));
	}
})

function setAllTheSettings(response) {
	options = response;
	// Handling the old true/false strings in options
	for (var key in options) {
		if (options.hasOwnProperty(key)) {
			if (options[key] == "true") options[key] = true;
			if (options[key] == "false") options[key] = false;
		}
	}
	bodyClasses = document.body.classList;
	doneTheStuff = false;
	document.body.addEventListener("DOMNodeInserted", eventDispatcher);
	if (options.circled_avatars == true) {
		bodyClasses.add("btd-circle-avatars");
	}
	if (options.no_columns_icons == true) {
		bodyClasses.add("btd-no-columns-icons");
	}
	if (options.grayscale_notification_icons == true) {
		bodyClasses.add("btd-grayscale-notification-icons");
	}
	if (options.only_one_thumbnails == true) {
		bodyClasses.add("btd-one-thumbnail");
	}
	if (options.blurred_modals) {
		bodyClasses.add("btd-blurred-modals");
	}
	if (options.small_icons_compose) {
		bodyClasses.add("btd-small-icons-compose");
	}
	if (options.name_display == "fullname" ||  options.name_display == "username") {
		bodyClasses.add("btd-no-username");
	}
	if (options.yt_rm_button) {
		bodyClasses.add("btd-no-video-icon");
	}
	if (options.typeahead_display_username_only) {
		bodyClasses.add("btd-username-typeahead");
	}

	if (options.minimal_mode) {
		bodyClasses.add("btd-minimal-mode");
	}

	var easter_egg = new Konami(function() {
		document.getElementById("open-modal").style.display = "none";
		document.getElementById("open-modal").innerHTML = "";
		konamiTweets();
	});


}

window.document.onkeydown = function(e) {
	var openModal = document.getElementById("open-modal");
	if (openModal.children.length > 0 && e.keyCode == 27) {
		openModal.innerHTML = "";
		openModal.style.display = "none";
	}
}

function modalWorker() {
	if (options.timestamp != "relative") {
		if (typeof event.target.querySelector === "function") {
			timeIsNotRelative(event.target.querySelector("time > *"), options.timestamp);
		}
	}

	if (options.url_redirection == true) {
		useFullUrl(event.target);
	}

	if (typeof event.target.querySelectorAll === "function") {
		nameDisplay(event.target.querySelectorAll("a[rel='user']:not(.item-img)"), options.name_display);
	}
}

function eventDispatcher() {
	function readyTD() {
		document.body.classList.add(TD.ready ? 'btd-ready' : '');

	}

	function mediaPreviewSize() {
		var jsColumns = document.querySelectorAll(".js-column[data-column]");
		for (var i = jsColumns.length - 1; i >= 0; i--) {
			var col = jsColumns[i];
			var columnSize = TD.storage.columnController.get(col.getAttribute("data-column")).getMediaPreviewSize() || "medium";
			col.setAttribute("data-media-preview-size", columnSize);
		};
	}

	// Change data-media-preview-size when small/medium/large are clicked
	var sizeChanger = document.querySelectorAll(".column a[data-value]:not(.is-selected):not(.binded)");
	for (var i = 0; i < sizeChanger.length; i++) {
		sizeChanger[i].addEventListener("click", function() {
			findColumn(event.target).setAttribute("data-media-preview-size", event.target.parentNode.getAttribute("data-value"));
		});
		sizeChanger[i].classList.add("binded");
	};


	// If the event.target is the text (TweetDeck updates timestamp at regular intervals) then we can get the .txt-mute element and tweak it in real-time
	if ((event.target.nodeName == "#text" && event.relatedNode.className._contains("txt-mute")) && options.timestamp != "relative") {
		timeIsNotRelative(event.relatedNode, options.timestamp);
	}
	// If it's not a .txt-mute element, it must be a tweet or something similar, let's check it !
	else if (event.target.className && event.target.className._contains("stream-item")) {

		if (document.querySelectorAll(".js-column").length > 0) {
			if (!doneTheStuff) {
				doneTheStuff = true;
				injectScript(mediaPreviewSize);
				injectScript(getTDTheme);
				var openModal = document.getElementById("open-modal");
				openModal.addEventListener("DOMNodeInserted", modalWorker);
				var modals = document.querySelectorAll(".js-modals-container, #actions-modal");
				for (var i = modals.length - 1; i >= 0; i--) {
					modals[i].addEventListener("DOMNodeInserted", function() {
						document.body.classList.add("btd-modal-opened");
						if (openModal.children.length > 0) {
							openModal.innerHTML = "";
							openModal.style.display = "none";
						}
					});
					modals[i].addEventListener("DOMNodeRemoved", function() {
						document.body.classList.remove("btd-modal-opened");
					});
					var emojiURL = chrome.extension.getURL("emoji-popover.html");
					_ajax(emojiURL, "GET", null, null, function(data) {
						buildingEmojiComposer(data)
					});
				};
				var settingsPage = chrome.extension.getURL("fancy-settings/source/index.html");
				var settingsButton = '<a class="btd-settings js-header-action link-clean cf app-nav-link padding-hl" data-title="BTD Settings" data-action> <div class="obj-left"> <i class="icon icon-sliders icon-large icon-unread-color"></i> </div> <div class="nbfc padding-ts hide-condensed">BTD Settings</div> </a>';
				document.querySelector(".js-header-action.link-clean.app-nav-link[data-action=change-sidebar-width]").insertAdjacentHTML("beforebegin", settingsButton);
				document.querySelector(".btd-settings").addEventListener("click", function() {
					window.open(chrome.extension.getURL("fancy-settings/source/index.html"));
				});
				injectScript(readyTD);
			}
		}
		// Applying the timestamp
		if (options.timestamp != "relative") {
			var time = event.target.querySelector("time");
			if (time) {
				timeIsNotRelative(time.querySelector("*"), options.timestamp);
			}
		}

		// Tweaking the name displaying
		nameDisplay(event.target.querySelectorAll("a[rel='user']:not(.item-img)"), options.name_display);

		// If asked, removing t.co links
		if (options.url_redirection == true) {
			useFullUrl(event.target);
		}

		// If asked, creating the non-pic.twitter image previews
		var links = event.target.querySelectorAll("p > a[data-full-url]");
		if (links.length > 0) {
			var linkToHandle = links[links.length - 1];
			var isDetail = linkToHandle.parentNode.parentNode.querySelectorAll(".js-cards-container").length != 0;
			var imgURL = linkToHandle.getAttribute("data-full-url");
			if ((imgURL._contains("imgur.com/") && !imgURL._contains("/?q")) && options.img_preview_imgur) {
				createPreviewDiv(linkToHandle, "imgur");
			} else if (imgURL._contains("d.pr/i") && options.img_preview_droplr) {
				createPreviewDiv(linkToHandle, "droplr");
			} else if (imgURL._contains("cl.ly/") && options.img_preview_cloud) {
				createPreviewDiv(linkToHandle, "cloudApp");
			} else if (imgURL._contains("instagram.com/") && options.img_preview_instagram) {
				createPreviewDiv(linkToHandle, "instagram");
			} else if ((imgURL._contains("flic.kr/") || imgURL._contains("flickr.com/")) && options.img_preview_flickr) {
				createPreviewDiv(linkToHandle, "flickr")
			} else if (imgURL._contains("500px.com/") && options.img_preview_500px) {
				createPreviewDiv(linkToHandle, "fivehundredpx");
			} else if ((imgURL._contains("media.tumblr.com/") && !imgURL._contains("tumblr_inline")) && options.img_preview_tumblr) {
				createPreviewDiv(linkToHandle, "tumblr");
			} else if (new RegExp("vimeo.com\/[0-9]*$").test(imgURL) && options.img_preview_vimeo) {
				createPreviewDiv(linkToHandle, "vimeo");
			} else if (imgURL._contains("dailymotion.com/video/") && options.img_preview_dailymotion) {
				createPreviewDiv(linkToHandle, "dailymotion");
			} else if (new RegExp("(deviantart.com\/art|fav.me|sta.sh)").test(imgURL) && options.img_preview_deviantart) {
				createPreviewDiv(linkToHandle, "deviantart");
			} else if (imgURL._contains("img.ly") && options.img_preview_imgly) {
				createPreviewDiv(linkToHandle, "img.ly");
			} else if (new RegExp("(dribbble.com\/shots|drbl.in)").test(imgURL) && options.img_preview_dribbble) {
				createPreviewDiv(linkToHandle, "dribbble");
			} else if (imgURL._contains("yfrog.com") && options.img_preview_yfrog) {
				createPreviewDiv(linkToHandle, "yfrog")
			} else if (imgURL._contains("moby.to/") && options.img_preview_mobyto) {
				createPreviewDiv(linkToHandle, "mobyto");
			} else if (imgURL._contains("soundcloud.com/") && options.img_preview_soundcloud) {
				createPreviewDiv(linkToHandle, "soundcloud");
			} else if (imgURL._contains("bandcamp.com/") && options.img_preview_bandcamp) {
				createPreviewDiv(linkToHandle, "bandcamp");
			} else if (new RegExp("((https?://db\\.tt/[a-zA-Z0-9]+)|(https?://www\\.(dropbox\\.com/s/.+\\.(?:jpg|png|gif))))").test(imgURL) && options.img_preview_dropbox) {
				createPreviewDiv(linkToHandle, "dropbox");
			} else if (new RegExp(".(jpg|gif|png|jpeg)$").test(imgURL)) {
				createPreviewDiv(linkToHandle, "toResize");
			} else if (imgURL._contains("ted.com/talks") && options.img_preview_ted) {
				createPreviewDiv(linkToHandle, "ted");
			} else {
				emojiAfterNodeInsertion(event);
			}
		} else {
			emojiAfterNodeInsertion(event);
		}

	} else if (event.relatedNode.id == "open-modal" && options.blurred_modals) {
		var openModal = document.getElementById("open-modal");
		if (event.relatedNode.querySelector(".js-mediatable") != undefined) {
			document.body.classList.add("btd-modal-opened");
			var blurredDismiss = document.createElement("div");
			blurredDismiss.classList.add("btd-blurred-dismiss");
			document.querySelector(".js-modal-panel a[rel='dismiss']").insertAdjacentElement("beforebegin", blurredDismiss);
			document.querySelector(".js-embeditem.med-embeditem").insertAdjacentElement("afterbegin", blurredDismiss);
			for (var i = openModal.querySelectorAll("a[rel=dismiss], #btd-modal-dismiss, .btd-blurred-dismiss").length - 1; i >= 0; i--) {
				openModal.querySelectorAll("a[rel=dismiss], #btd-modal-dismiss, .btd-blurred-dismiss")[i].addEventListener("click", function() {
					openModal.style.display = "none";
					openModal.innerHTML = "";
					document.querySelector("body").classList.remove("btd-modal-opened");
				});
			};
			openModal.querySelector("#open-modal .js-mediatable").addEventListener("DOMNodeRemoved", function() {
				if (event.relatedNode.id == "open-modal") {
					document.querySelector("body").classList.remove("btd-modal-opened");
				}
			});
		} else {
			document.body.classList.add("btd-modal-opened");
			if (openModal.querySelector("#open-modal .js-modal-panel") != undefined) {
				openModal.querySelector("#open-modal .js-modal-panel:not(.binded)").addEventListener("DOMNodeRemoved", function() {
					if (event.relatedNode.id == "open-modal") {
						document.querySelector("body").classList.remove("btd-modal-opened");
					}
				});
			}
		}

	} else if (event.target.id == "general_settings" && options.minimal_mode) {
		for (var i = event.target.querySelectorAll("input.js-theme-radio").length - 1; i >= 0; i--) {
			event.target.querySelectorAll("input.js-theme-radio")[i].addEventListener("click", function() {
				injectScript(getTDTheme);
			});
		};
	} else if ((event.relatedNode.classList != null && event.relatedNode.classList.contains('js-modal-content') && !event.relatedNode.firstChild.classList.contains('is-loading')) && options.url_redirection) {
		var profileURL = event.target.querySelector("a.prf-siteurl").innerText;
		if (new RegExp("http(|s)://").test(profileURL)) {
			event.target.querySelector("a.prf-siteurl").href = event.target.querySelector("a.prf-siteurl").innerText;
		} else {
			event.target.querySelector("a.prf-siteurl").href = "http://" + event.target.querySelector("a.prf-siteurl").innerText;
		}

	}
}

function createPreviewDiv(element, provider) {
	// Getting the full URL for later
	var linkURL = element.getAttribute("data-full-url");
	if (typeof findColumn(element).getAttribute === "function") {
		if (!findColumn(element).classList.contains("column-temp")) {
			var thumbSize = findColumn(element).getAttribute("data-media-preview-size");
		}
	}
	if (new RegExp("large|medium|small").test(thumbSize)) {
		if (provider == "toResize") {
			var suffixResize;
			switch (thumbSize) {
				case "small":
					suffixResize = 150
					break;
				case "medium":
					suffixResize = 280;
					break;
				case "large":
					suffixResize = 360;
					break;
			}
			var resizedURL = 'https://images4-focus-opensocial.googleusercontent.com/gadgets/proxy?url=' + encodeURIComponent(linkURL) + '&container=focus&resize_w=' + suffixResize + '&refresh=86400';
			continueCreatingThePreview(resizedURL, linkURL);
		} else if (provider == "dropbox") {
			var suffixDropbox;
			switch (thumbSize) {
				case "small":
					suffixDropbox = 150
					break;
				case "medium":
					suffixDropbox = 280;
					break;
				case "large":
					suffixDropbox = 360;
					break;
			}
			var dropboxURL = 'https://noembed.com/embed?url=' + encodeURIComponent(linkURL) + '&maxwidth=' + suffixDropbox;

			_ajax(dropboxURL, "GET", "json", null, function(data) {
				continueCreatingThePreview(data.media_url, data.media_url.replace("https://noembed.com/i/" + suffixDropbox + "/0/", ""));
			});

		} else if (provider == "imgur") {
			// Settings up some client-ID to "bypass" the request rate limite (12,500 req/day/client)
			var imgurClientIDs = ["c189a7be5a7a313", "180ce538ef0dc41"];

			function getClientID() {
				return imgurClientIDs[Math.floor(Math.random() * imgurClientIDs.length)];
			}
			var headers = {
				"Authorization": "Client-ID " + getClientID()
			};
			// Setting the right suffix depending of the user's option
			switch (thumbSize) {
				case "small":
					suffixImgur = "t"
					break;
				case "medium":
					suffixImgur = "m"
					break;
				case "large":
					suffixImgur = "l"
					break;
			}
			var imgurID = parseURL(linkURL).segments.pop();
			// Album
			if (linkURL._contains("imgur.com/a/")) {
				previewFromAnAlbum(imgurID);
			} else if (linkURL._contains("imgur.com/gallery/")) {
				var galleryURL = "https://api.imgur.com/3/gallery/image/" + imgurID;

				function onFailure(data) {
					previewFromAnAlbum(imgurID, "https://imgur.com/a/" + imgurID + "/embed");
				}

				function onSuccess(data)  {
					var thumbnailUrl = "https://i.imgur.com/" + data.data.id + suffixImgur + ".jpg";
					continueCreatingThePreview(thumbnailUrl, thumbnailUrl.replace(/[a-z].jpg/, ".jpg"));
				}

				_ajax(galleryURL, "GET", "json", headers, onSuccess, onFailure);
			} else {
				// Single image
				var imgurID = parseURL(linkURL).file.split(".").shift();
				continueCreatingThePreview("https://i.imgur.com/" + imgurID + suffixImgur + ".jpg", "https://i.imgur.com/" + imgurID + ".jpg");
			}

			function previewFromAnAlbum(albumID) {
				var albumURL = "https://api.imgur.com/3/album/" + albumID;
				_ajax(albumURL, "GET", "json", headers, function(data)  {
					var thumbnailUrl = "https://i.imgur.com/" + data.data.cover + suffixImgur + ".jpg";
					var albumIframe = '<iframe class="imgur-album" width="708" height="550" frameborder="0" src="https://imgur.com/a/' + albumID + '/embed"></iframe>';
					continueCreatingThePreview(thumbnailUrl, albumIframe, true);
				});
			}
		} else if (provider == "droplr") {
			// Depending of the thumbSize option we're getting d.pr/i/1234/small or d.pr/i/1234/medium (it seems like Droplr hasn't a "large" option)
			if (thumbSize == "small") {
				var suffixDroplr = thumbSize;
			} else {
				var suffixDroplr = "medium";
			}
			// Removing the last "/" if present and adding one+suffix
			var thumbnailUrl = linkURL.replace(/\/$/, "");
			var thumbnailUrl = thumbnailUrl + "/" + suffixDroplr;
			continueCreatingThePreview(thumbnailUrl, linkURL + "+");
		} else if (provider == "cloudApp") {
			var headers = {
				"Accept": "application/json"
			};
			_ajax(linkURL, "GET", "json", headers, function(data) {
				if (data.item_type == "image") {
					var thumbnailUrl = data.thumbnail_url;
					continueCreatingThePreview(thumbnailUrl, data.content_url);
				}
			});
		} else if (provider == "instagram") {
			var instagramID = parseURL(linkURL.replace(/\/$/, "")).segments.pop();
			switch (thumbSize) {
				case "small":
					suffixInstagram = "t"
					break;
				case "medium":
					suffixInstagram = "m"
					break;
				case "large":
					suffixInstagram = "l"
					break;
			}
			var instagramURL = "http://api.instagram.com/oembed?url=" + linkURL;

			_ajax(instagramURL, "GET", "json", null, function(data) {
				var finalURL = "http://instagr.am/p/" + instagramID + "/media/?size=" + suffixInstagram;
				if (!data.url._contains(".mp4")) {
					continueCreatingThePreview(finalURL, data.url.replace(/_[0-9].jpg$/g, "_8.jpg"));
				} else {
					var instaVideo = '<video class="instagram-video" width="400" height="400" controls><source src=' + data.url + ' type="video/mp4"></video>';
					continueCreatingThePreview(finalURL, instaVideo, true);
				}
			});

		} else if (provider == "flickr") {
			if (thumbSize == "large") maxWidth = 350;
			if (thumbSize == "medium") maxWidth = 280;
			if (thumbSize == "small") maxWidth = 150;
			var flickURL = encodeURIComponent(linkURL);
			flickURL = 'https://www.flickr.com/services/oembed/?url=' + flickURL + '&format=json&maxwidth=' + maxWidth;

			_ajax(flickURL, "GET", "json", null, function(data) {
				continueCreatingThePreview(data.url, data.url.replace(/_[a-z].jpg$/g, "_z.jpg"));
			});
		} else if (provider == "fivehundredpx") {
			var photoID = parseURL(linkURL).segments.pop();
			switch (thumbSize) {
				case "small":
					suffixFiveHundred = "2"
					break;
				case "medium":
					suffixFiveHundred = "3"
					break;
				case "large":
					suffixFiveHundred = "3"
					break;
			}
			var fivehundredURL = "https://api.500px.com/v1/photos/" + photoID + "?consumer_key=8EUWGvy6gL8yFLPbuF6A8SvbOIxSlVJzQCdWSGnm";

			_ajax(fivehundredURL, "GET", "json", null, function(data) {
				var picURL = data.photo.image_url.replace(/[0-9].jpg$/, suffixFiveHundred + ".jpg");
				var fullPicURL = data.photo.image_url;
				continueCreatingThePreview(picURL, fullPicURL);
			});
		} else if (provider == "tumblr") {
			// Using the appropriate suffix depending of the settings
			switch (thumbSize) {
				case "small":
					suffixTumblr = "250"
					break;
				case "medium":
					suffixTumblr = "250"
					break;
				case "large":
					suffixTumblr = "400"
					break;
			}
			// Getting the file extension of the URL for later
			var fileExtension = linkURL.split(".").pop();
			// Getting the original suffix (100,250,400,500)
			var rxp = new RegExp(/[0-9]*.[a-z]*$/);
			var tumblrSize = parseInt(rxp.exec(linkURL)[0].split(".")[0]);
			if (tumblrSize >= suffixTumblr) {
				var smallerThumb = linkURL.replace(tumblrSize + "." + fileExtension, suffixTumblr + "." + fileExtension);
				continueCreatingThePreview(smallerThumb, linkURL);
			} else {
				continueCreatingThePreview(linkURL, linkURL);
			}
		} else if (provider == "vimeo") {
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
			var vimeoURL = 'http://vimeo.com/api/oembed.json?maxwidth=' + suffixVimeo + '&url=http%3A//vimeo.com/' + vimeoID;

			_ajax(vimeoURL, "GET", "json", null, function(data) {
				var thumbnailVimeo = data.thumbnail_url;
				_ajax('http://vimeo.com/api/oembed.json?maxwidth=1024&url=http%3A//vimeo.com/' + vimeoID, "GET", "json", null, function(data) {
					continueCreatingThePreview(thumbnailVimeo, data.html, true);
				});
			});
		} else if (provider == "dailymotion") {
			var dailymotionID = parseURL(linkURL).segments[1];
			var dailymotionURL = 'https://api.dailymotion.com/video/' + dailymotionID + '?fields=thumbnail_240_url,thumbnail_360_url,thumbnail_180_url,embed_html';
			if (thumbSize == "large") {
				_ajax(dailymotionURL, "GET", "json", null, function(data) {
					continueCreatingThePreview(data.thumbnail_360_url, data.embed_html.replace("http://", "https://"), true);
				});

			} else if (thumbSize == "medium") {
				_ajax(dailymotionURL, "GET", "json", null, function(data) {
					continueCreatingThePreview(data.thumbnail_240_url, data.embed_html.replace("http://", "https://"), true);
				});
			} else if (thumbSize == "small") {
				_ajax(dailymotionURL, "GET", "json", null, function(data) {
					continueCreatingThePreview(data.thumbnail_180_url, data.embed_html.replace("http://", "https://"), true);
				});
			}
		} else if (provider == "deviantart") {
			var deviantURL = 'http://backend.deviantart.com/oembed?url=' + encodeURIComponent(linkURL);

			_ajax(deviantURL, "GET", "json", null, function(data) {
				if (data.type == "photo") {
					continueCreatingThePreview(data.thumbnail_url, data.url);
				}
			});
		} else if (provider == "img.ly") {
			var imglyID = parseURL(linkURL).file;
			if (thumbSize == "small") {
				var suffixImgly = "thumb";
			} else {
				var suffixImgly = thumbSize;
			}
			var finalImglyURL = "http://img.ly/show/" + suffixImgly + "/" + imglyID;
			continueCreatingThePreview(finalImglyURL, "http://img.ly/show/full/" + imglyID);
		} else if (provider == "dribbble") {
			var dribbbleID = parseURL(linkURL).file.split("-").shift();
			var dribbleURL = 'http://api.dribbble.com/shots/' + dribbbleID;

			_ajax(dribbleURL, "GET", "json", null, function(data) {
				continueCreatingThePreview(data.image_teaser_url, data.image_url);
			});
		} else if (provider == "yfrog") {
			var hashYfrog = parseURL(linkURL).file;
			switch (thumbSize) {
				case "small":
					suffixYfrog = "small";
					break;
				case "medium":
					suffixYfrog = "iphone";
					break;
				case "large":
					suffixYfrog = "medium";
					break;
			}
			continueCreatingThePreview("http://yfrog.com/" + hashYfrog + ":" + suffixYfrog, "http://yfrog.com/" + hashYfrog + ":medium");
		} else if (provider == "mobyto") {
			var mobyID = parseURL(linkURL).file;
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
			continueCreatingThePreview("http://moby.to/" + mobyID + ":" + sizeMobyto, "http://moby.to/" + mobyID + ":full");
		} else if (provider == "soundcloud") {
			var soundcloudURL = 'http://soundcloud.com/oembed?format=json&url=' + linkURL;

			_ajax(soundcloudURL, "GET", "json", null, function(data) {
				continueCreatingThePreview(data.thumbnail_url, data.html.replace('width="100%"', 'width="600"'), true);
			});
		} else if (provider == "bandcamp" ||  provider == "ted") {
			bandcampURL = encodeURIComponent(linkURL);
			bandcampURL = 'http://api.embed.ly/1/oembed?key=748757a075e44633b197feec69095c90&url=' + bandcampURL + '&format=json';

			_ajax(bandcampURL, "GET", "json", null, function(data) {
				var embed = data.html;
				var thumbnailBandcamp = data.thumbnail_url;
				continueCreatingThePreview(thumbnailBandcamp, embed, true);
			});
		}
	}

	function continueCreatingThePreview(thumbnailUrl, embed, isAnIframe) {
		var fullBleed = "";
		if (thumbSize == "large") {
			marginSuffix = "tm";
			fullBleed = "item-box-full-bleed";
		} else {
			marginSuffix = "vm";
		}
		var linkURL = element.getAttribute("data-full-url");
		// Creating the elements, replicating the same layout as TweetDeck's one
		var previewDiv = document.createElement("div");
		previewDiv.className = "js-media media-preview position-rel btd-preview " + provider + " " + fullBleed;

		var previewDivChild = document.createElement("div");
		previewDivChild.className = "js-media-preview-container position-rel margin-" + marginSuffix;
		var previewLink = document.createElement("a");
		previewLink.className = "js-media-image-link block med-link media-item media-size-" + thumbSize + "";
		// Little difference, using rel=url otherwhise TweetDeck will treat it as a "real" media preview, therefore "blocking" the click on it 
		previewLink.setAttribute("rel", "url");
		previewLink.href = linkURL;
		previewLink.setAttribute("target", "_blank");
		previewLink.setAttribute("data-tweetkey", element.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("data-key"));

		if (element.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("data-key") == null) {
			previewLink.setAttribute("data-tweetkey", element.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("data-key"));
		}

		// Applying our thumbnail as a background-image of the preview div
		previewLink.style.backgroundImage = "url(" + thumbnailUrl + ")";
		previewLink.setAttribute("data-provider", provider);

		if (embed) {
			previewLink.setAttribute("data-embed", embed);
		}

		if (isAnIframe) {
			previewLink.setAttribute("data-isembed", "true");
		}

		// Constructing our final div
		previewDivChild.appendChild(previewLink);
		previewDiv.appendChild(previewDivChild);

		// Adding it next to the <p> element, just before <footer> in a tweet
		if (thumbSize == "large") {
			var pElement = element.parentNode.parentNode.parentNode.parentNode.querySelector("div.js-tweet.tweet");
		} else {
			var pElement = element.parentNode.parentNode.querySelector("p.js-tweet-text");
		}

		if (pElement) {
			pElement.insertAdjacentElement("afterEnd", previewDiv);
			if (thumbSize == "large") {
				var triangle = document.createElement("span");
				triangle.className = "triangle";
				previewDiv.insertAdjacentElement("beforeEnd", triangle);
			}
		}

		createLightboxes();
		if (document.querySelectorAll(".btd-preview + .js-media.media-preview, .btd-preview + .item-box-full-bleed")) {
			for (var i = document.querySelectorAll(".btd-preview + .js-media.media-preview, .btd-preview + .item-box-full-bleed").length - 1; i >= 0; i--) {
				document.querySelectorAll(".btd-preview + .js-media.media-preview, .btd-preview + .item-box-full-bleed")[i].remove();
			};
		}
		emojiInElement(element.parentNode);
	}

}

function createLightboxes() {
	var noLightboxYet = document.querySelectorAll("section[class*=column-type] .btd-preview a:not(.lightbox-enabled)");
	for (var i = noLightboxYet.length - 1; i >= 0; i--) {
		noLightboxYet[i].addEventListener("click", lightboxFromTweet);
		noLightboxYet[i].classList.add("lightbox-enabled");
		noLightboxYet[i].setAttribute("rel", "");
	};
}

// Okay it's probably ugly because it's not very "flexible" but it's the only way I found to replicate the lightboxes efficiently
function lightboxFromTweet() {
	var linkLightbox = event.target,
		dataEmbed = linkLightbox.getAttribute("data-embed"),
		dataIsEmbed = linkLightbox.getAttribute("data-isembed"),
		dataProvider = linkLightbox.getAttribute("data-provider"),
		dataTweetKey = linkLightbox.getAttribute("data-tweetkey");

	openModal = document.getElementById("open-modal");
	openModal.innerHTML = '<div id="btd-modal-dismiss"></div><div class="js-mediatable ovl-block is-inverted-light"><div class="s-padded"><div class="js-modal-panel mdl s-full med-fullpanel"><a href="#" class="mdl-dismiss js-dismiss mdl-dismiss-media" rel="dismiss"><i class="icon icon-close"></i></a><div class="js-embeditem med-embeditem"><div class="l-table"><div class="l-cell"><div class="med-tray js-mediaembed"></div></div></div></div><div id="media-gallery-tray"></div><div class="js-media-tweet med-tweet"></div></div></div>';
	var jsMediaEmbed = openModal.querySelector(".js-mediaembed");
	if (dataEmbed != null) {
		// If we got an embed code
		if (dataIsEmbed != null) {
			jsMediaEmbed.innerHTML = dataEmbed + '<a class="med-origlink" href=' + linkLightbox.href + ' rel="url" target="_blank">View original</a><a class="js-media-flag-nsfw med-flaglink " href="#">Flag media</a><a class="js-media-flagged-nsfw med-flaglink is-hidden" href="https://support.twitter.com/articles/20069937" rel="url" target="_blank">Flagged (learn more)</a>';
			finishTheLightbox(dataTweetKey);
		} else {
			jsMediaEmbed.innerHTML = '<div class="js-media-preview-container position-rel margin-vm"> <a class="js-media-image-link block med-link media-item" rel="mediaPreview" target="_blank"> <img class="media-img" src=' + dataEmbed + ' alt="Media preview"></a></div><a class="med-origlink" rel="url" href=' + linkLightbox.href + ' target="_blank">View original</a><a class="js-media-flag-nsfw med-flaglink " href="#">Flag media</a><a class="js-media-flagged-nsfw med-flaglink is-hidden" href="https://support.twitter.com/articles/20069937" rel="url" target="_blank">Flagged (learn more)</a>';
			finishTheLightbox(dataTweetKey);
		}
	}

	function finishTheLightbox(dataTweetKey) {
		var originalTweet = document.querySelector("[data-key='" + dataTweetKey + "']");
		var mediaInModal = openModal.querySelector(".js-mediaembed :-webkit-any(img, iframe, video)");
		// Embed/Picture creating
		if (mediaInModal != null) {
			mediaInModal.onload = function() {
				var maxHeightForMedia = document.querySelector(".js-embeditem.med-embeditem").offsetHeight - (document.querySelector("a.med-origlink").offsetHeight) - 20;
				mediaInModal.style.maxHeight = maxHeightForMedia + "px";
				window.onresize = function() {
					maxHeightForMedia = document.querySelector(".js-embeditem.med-embeditem").offsetHeight - (document.querySelector("a.med-origlink").offsetHeight) - 20
					mediaInModal.style.maxHeight = maxHeightForMedia + "px";
				};
				openModal.querySelector(".med-embeditem").classList.add("is-loaded");
				openModal.querySelector(".med-tray.js-mediaembed").style.opacity = 1;
			}
		} else {
			openModal.querySelector(".med-embeditem").classList.add("is-loaded");
			openModal.querySelector(".med-tray.js-mediaembed").style.opacity = 1;
		}

		// Content tweaking
		if (openModal.querySelector(".instagram-video") != null) {
			openModal.querySelector(".instagram-video").style.height = document.querySelector(".js-embeditem.med-embeditem").offsetHeight - (document.querySelector("a.med-origlink").offsetHeight) - 20 + "px";
			openModal.querySelector(".instagram-video").style.width = document.querySelector(".js-embeditem.med-embeditem").offsetHeight - (document.querySelector("a.med-origlink").offsetHeight) - 20 + "px";
		}

		if (document.querySelector("iframe[src*='dailymotion.com']") != null) {
			document.querySelector("iframe[src*='dailymotion.com']").height = document.querySelector("iframe[src*='dailymotion.com']").height * 2;
			document.querySelector("iframe[src*='dailymotion.com']").width = document.querySelector("iframe[src*='dailymotion.com']").width * 2;
		}

		// Tweet "copying"
		openModal.querySelector(".js-media-tweet").innerHTML = originalTweet.innerHTML;

		if (openModal.querySelector(".js-media-tweet .activity-header") != null) {
			openModal.querySelector(".js-media-tweet .activity-header").remove();
		}
		if (openModal.querySelector(".js-media-tweet .feature-customtimelines") != null) {
			openModal.querySelector(".js-media-tweet .feature-customtimelines").remove();
		}
		if (openModal.querySelector(".js-media") != null) {
			openModal.querySelector(".js-media").remove();
		}
		if (openModal.querySelector(".js-tweet-actions.tweet-actions") != null) {
			openModal.querySelector(".js-tweet-actions.tweet-actions").classList.add("is-visible");
		}
		openModal.style.display = "block";
		for (var i = openModal.querySelectorAll("a[rel=dismiss], #btd-modal-dismiss").length - 1; i >= 0; i--) {
			openModal.querySelectorAll("a[rel=dismiss], #btd-modal-dismiss")[i].addEventListener("click", function() {
				openModal.style.display = "none";
				openModal.innerHTML = "";
			});
		};

		// Handling the buttons in tweet footer as intended

		// Favorite button
		openModal.querySelector("a[rel='favorite']").addEventListener("click", function() {
			// Faking the current tweet being favorited
			openModal.querySelector(".js-tweet.tweet").classList.toggle("is-favorite");
			event.target.classList.toggle("anim");
			event.target.classList.toggle("anim-slower");
			event.target.classList.toggle("anim-bounce-in");
			// Triggering click action on the "real" fav button so the tweet gets favorited.
			originalTweet.querySelector("a[rel='favorite']").click();
		});

		// Retweet button
		openModal.querySelector("a[rel='retweet']").addEventListener("click", function() {
			// Faking the current tweet being retweeted by triggering the click action on the original button. So tricky, very magic.
			originalTweet.querySelector("a[rel='retweet']").click();
		});

		// Favorite button
		openModal.querySelector("a[rel='reply']").addEventListener("click", function() {
			// Click on the RT button
			originalTweet.querySelector("a[rel='reply']").click();
			// Then click on the "pop-out" button in the inline-reply panel.
			setTimeout(function() {
				originalTweet.querySelector("button.js-inline-compose-pop").click();
				// And click on the dismiss div to close the lightboxe. And BAM ! You're replying to the tweet.
				document.getElementById("btd-modal-dismiss").click();
				originalTweet.querySelector("a[rel='reply']").classList.remove("is-selected");
			}, 0);
		});

		// Menu button
		openModal.querySelector("a[rel='actionsMenu']").addEventListener("click", function() {
			// Faking the current tweet being retweeted by triggering the click action on the original button. So tricky, very magic.
			setTimeout(function() {
				originalTweet.querySelector("a[rel='actionsMenu']").click();
			}, 0);
			setTimeout(function() {
				var originalMenu = originalTweet.querySelector(".dropdown-menu");
				originalMenu.classList.add("pos-t");
				openModal.querySelector("a[rel='actionsMenu']").insertAdjacentElement("afterEnd", originalMenu);
			}, 0);
			setTimeout(function() {
				for (var i = openModal.querySelectorAll("a[data-action='message'],a[data-action='mention']").length - 1; i >= 0; i--) {
					openModal.querySelectorAll("a[data-action='message'],a[data-action='mention']")[i].addEventListener("click", function() {
						openModal.style.display = "none";
						openModal.innerHTML = "";
					})
				};
			}, 0);
		});
	}
}

function timeIsNotRelative(element, mode) {
	if (element != null) {
		// Getting the timestamp of an item
		d = element.parentNode.getAttribute("data-time");
		// Creating a Date object with it
		td = new Date(parseInt(d));

		// Creating year/day/month/minutes/hours variables and applying the lead zeros if necessary
		var year = td.getFullYear();
		if (year < 10) year = "0" + year;
		var month = td.getMonth() + 1;
		if (month < 10) month = "0" + month;
		var minutes = td.getMinutes();
		if (minutes < 10) minutes = "0" + minutes;
		var hours = td.getHours();
		if (hours < 10) hours = "0" + hours;
		var day = td.getDate();
		if (day < 10) day = "0" + day;

		var dateString;

		function setDateString(mode) {
			if (mode == "absolute_us") {
				dateString = month + "/" + day + "/" + year + " " + hours + ":" + minutes;
			} else {
				dateString = day + "/" + month + "/" + year + " " + hours + ":" + minutes;
			}
		}
		if (options.full_after_24h == true) {
			now = new Date();
			difference = now - td;
			var msPerDay = 86400000;
			if (difference < msPerDay) dateString = hours + ":" + minutes;
			else setDateString(mode);
		} else {
			setDateString(mode);
		}
		// Changing the content of the "time > a" element with the absolute time
		element.innerHTML = dateString;
		element.classList.add("txt-mute");
	}
}

function nameDisplay(elements, mode) {
	if (mode == "username") {
		// If we just want the @username.
		for (var i = elements.length - 1; i >= 0; i--) {
			var currEl = elements[i];
			// If the username is NOT in a tweet (typically in a <p> element), do the thing
			if (currEl.parentNode.tagName != "P") {
				// Removing "http://twitter.com" and the last "/" in the link to get the @username
				var username = currEl.getAttribute("href").split("/")[3];

				// Placing the username in b.fullname if found or in span.username
				if (currEl.querySelector("b.fullname")) {
					currEl.querySelector("b.fullname").innerHTML = username;
				} else {
					currEl.innerHTML = username;
				}
			}
		};
	} else if (mode == "inverted") {
		// If we want the @username AND the full name, we'll have to swap them
		for (var i = elements.length - 1; i >= 0; i--) {
			var currEl = elements[i];
			// If the username is NOT in a tweet (typically in a <p> element), do the thing
			if (currEl.parentNode.tagName != "P") {
				// Removing "http://twitter.com" and the last "/" in the link to get the @username
				var username = currEl.getAttribute("href").split("/")[3];
				var BFullname = currEl.querySelector("b.fullname");
				if (BFullname) {
					var fullname = BFullname.innerHTML;
				}
				if (currEl.querySelector("span.username")) {
					// Don't ask me why, I have to apply the fullname twice in order to this to work
					currEl.querySelector("span.username").innerHTML = fullname;
					if (BFullname) {
						BFullname.innerHTML = username;
					} else {
						currEl.innerHTML = username;
					}
				} else {
					currEl.innerHTML = username;
					if (currEl.classList.contains('account-link')) {
						currEl.style.fontWeight = "bold";
					}
				}
			}
		};
	}
}

function useFullUrl(element) {
	if (typeof element.querySelector === "function") {
		// Pretty easy, getting the data-full-url content and applying it as href in the links. Bye bye t.co !
		var links = element.querySelectorAll("a[data-full-url]");
		for (var i = links.length - 1; i >= 0; i--) {
			fullLink = links[i].getAttribute("data-full-url");
			links[i].href = fullLink;
		};
	}
}