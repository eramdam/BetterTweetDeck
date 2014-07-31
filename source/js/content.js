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

				document.querySelector('#open-modal').addEventListener("DOMNodeInserted", InsertOpenModalObserver);
				document.querySelector('#open-modal').addEventListener('DOMNodeRemoved', RemoveOpenModalObserver);

				document.querySelector('.js-modals-container').addEventListener("DOMNodeInserted", InsertOpenModalObserver);
				document.querySelector('.js-modals-container').addEventListener("DOMNodeRemoved", RemoveOpenModalObserver);

				document.querySelector('#settings-modal').addEventListener("DOMNodeInserted", SettingsModalObserver);

				addEmojiPanel();
			}
		}
	});

	readyTD.observe(document.querySelector(".js-app-loading"), {
		attributes: true
	});

	//= include usefulFunctions.js
	//= include timeIsNotRelative.js
	//= include nameDisplay.js
	//= include useFullURL.js
	//= include buildingEmojiComposer.js

	function ThemeDetecter() {
		console.debug("Detecting theme!");
		var activatedTheme = document.querySelector('link[rel=stylesheet][href*=app]:not([disabled])').title;
		console.debug("Theme detected :", activatedTheme);
		if (!document.body.classList.contains('btd-dark-theme') && !document.body.classList.contains('btd-light-theme')) {
			document.body.classList.add('btd-' + activatedTheme + '-theme');
		} else {
			document.body.className = document.body.className.replace(/btd-(dark|light)-theme/g, 'btd-' + activatedTheme + '-theme');
		}
	}

	function addEmojiPanel() {
		var emojiURL = chrome.extension.getURL("emojis/emoji-popover.html");
		_ajax(emojiURL, "GET", null, null, function(data) {
			buildingEmojiComposer(data)
		});
	}

	function ClassAdders() {
		var bodyClasses = document.body.classList;
		bodyClasses.add("btd-name_display-" + settings.name_display);

		if (settings.circled_avatars) bodyClasses.add('btd-circled_avatars');
		if (settings.no_columns_icons) bodyClasses.add('btd-no_columns_icons');
		if (settings.yt_rm_button) bodyClasses.add('btd-yt_rm_button');
		if (settings.small_icons_compose) bodyClasses.add('btd-small_icons_compose');
		if (settings.only_one_thumbnails) bodyClasses.add('btd-only_one_thumbnail');
		if (settings.grayscale_notification_icons) bodyClasses.add('btd-grayscale_notification_icons');
		if (settings.typeahead_display_username_only) bodyClasses.add('btd-typeahead_display_username_only');
		if (settings.blurred_modals) bodyClasses.add('btd-blurred_modals');
		if (settings.flash_tweets != "false") {
			bodyClasses.add('btd-flash_tweets');
			bodyClasses.add('flash-' + settings.flash_tweets);
		}
		if (settings.minimal_mode) {
			bodyClasses.add('btd-minimal_mode');
			ThemeDetecter();
		}

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

	function InsertOpenModalObserver(event) {
		var target = event.target;
		if (target.nodeName != "#text") {
			if (settings.url_redirection) {
				useFullURL(target);
			}

			document.body.classList.add('btd-open-modal-on');

			var openModalBackPanel = document.querySelector('#open-modal .med-fullpanel');

			if (openModalBackPanel) {
				openModalBackPanel.addEventListener('click', function() {
					if (document.querySelector('a.mdl-dismiss')) document.querySelector('a.mdl-dismiss').click();
				});
			}

			if (settings.timestamp != "relative") {
				timeIsNotRelative(target.querySelector('[datetime]'), settings.timestamp);
			}

			if (settings.name_display == "inverted" || settings.name_display == "username") {
				nameDisplay(target);
			}
		}
	}

	function RemoveOpenModalObserver(event) {
		document.body.classList.remove('btd-open-modal-on');
	}

	function SettingsModalObserver(event) {
		// When an event whose relatedNode contains "frm" as class occurs happen, we assume form controls are inserted so we continue
		if (event.relatedNode.className.indexOf('frm') != -1 && settings.minimal_mode) {

			for (var i = 0; i < document.querySelectorAll('input[name=theme]').length; i++) {
				document.querySelectorAll('input[name=theme]')[i].addEventListener('click', ThemeDetecter);
			};

		}
	}

})();