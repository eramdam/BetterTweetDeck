"use strict";

(function() {
	var settings = {
		"timestamp": "absolute",
		"full_after_24h": false,
		"name_display": "username",
		"typeahead_display_username_only": false,
		"circled_avatars": true,
		"no_columns_icons": true,
		"yt_rm_button": true,
		"small_icons_compose": true,
		"grayscale_notification_icons": false,
		"grayscale_notification_icons": true,
		"url_redirection": true,
		"img_preview_500px": true,
		"img_preview_bandcamp": true,
		"img_preview_cloud": true,
		"img_preview_dailymotion": true,
		"img_preview_deviantart": true,
		"img_preview_dribbble": true,
		"img_preview_droplr": true,
		"img_preview_dropbox": true,
		"img_preview_flickr": true,
		"img_preview_imgly": true,
		"img_preview_imgur": true,
		"img_preview_instagram": true,
		"img_preview_mobyto": true,
		"img_preview_soundcloud": true,
		"img_preview_tumblr": true,
		"img_preview_ted": true,
		"img_preview_vimeo": true,
		"img_preview_yfrog": true,
		"blurred_modals": true,
		"only_one_thumbnails": true,
		"minimal_mode": false,
		"flash_tweets": "false"
	};


	var readyTD = new MutationObserver(function(mutations) {
		for (var i = mutations.length - 1; i >= 0; i--) {
			if (mutations[i].target.tagName === "DIV" && mutations[i].target.style.display === "none") {
				readyTD.disconnect();
				ClassAdders();
				document.querySelector('.js-app-columns').addEventListener("DOMNodeInserted", ColumnsObserver);
				document.querySelector('#open-modal').addEventListener("DOMNodeInserted", OpenModalObserver);
			}
		}
	});

	readyTD.observe(document.querySelector(".js-app-loading"), {
		attributes: true
	});

	//= include timeIsNotRelative.js
	//= include nameDisplay.js
	//= include useFullURL.js
	
	function ClassAdders() {
		var bodyClasses = document.body.classList;
		bodyClasses.add("btd-name_display-"+settings.name_display);

		if (settings.circled_avatars) bodyClasses.add('btd-circled_avatars');
		if (settings.no_columns_icons) bodyClasses.add('btd-no_columns_icons');
		if (settings.yt_rm_button) bodyClasses.add('btd-yt_rm_button');
		if (settings.small_icons_compose) bodyClasses.add('btd-small_icons_compose');
		if (settings.grayscale_notification_icons) bodyClasses.add('btd-grayscale_notification_icons');
		console.log(document.body.className);
	}

	function ColumnsObserver(event) {
		var target = event.target;

		if (settings.url_redirection) {
			useFullURL(target);
		}

		if (target.tagName === "ARTICLE") {
			if (settings.timestamp != "relative") {
				timeIsNotRelative(target.querySelector('[datetime]'), settings.timestamp);
			}

			if (settings.name_display == "inverted" || settings.name_display == "username") {
				nameDisplay(target);
			}
		} else if (target.nodeName === "#text" && event.relatedNode.className.indexOf("txt-small") != -1) {
			if (settings.timestamp != "relative") {
				timeIsNotRelative(event.relatedNode.parentNode, "")
			}
		}
	}

	function OpenModalObserver(event) {
		var target = event.target;

		if (settings.url_redirection) {
			useFullURL(target);
		}
	}

})();