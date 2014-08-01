function AddPreview(target, finalURL, content, isHTML, size) {
	var dataThumbs = {
		"data_key": target.getAttribute("data-key"),
		"link_to_media": target.querySelector('p > a:last-of-type').href,
		"image": finalURL,
		"large_image": content
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
		target.querySelector('.js-tweet').insertAdjacentHTML("afterend", html);
	} else {
		target.querySelector('p.tweet-text').insertAdjacentHTML("afterend", html);
	}

	if (!isHTML) {
		createMediaModal(target.querySelector('.js-tweet'), dataThumbs.link_to_media, dataThumbs.large_image, false);
	} else {
		createMediaModal(target.querySelector('.js-tweet'), dataThumbs.link_to_media, content, true);
	}
}

function createMediaModal(sourceTweet, contentURL, content, isHTML) {

	if (sourceTweet.querySelector('[data-key]')) {
		var tweetKey = sourceTweet.querySelector('[data-key]').getAttribute('data-key');
	} else {
		var tweetKey = sourceTweet.parentNode.querySelector('[data-key]').getAttribute('data-key')
	}

	if (!isHTML) {
		var dataModal = {
			"link": contentURL,
			"large_image": content,
			"tweet_html": new Handlebars.SafeString(sourceTweet.outerHTML),
			"tweet_key": tweetKey
		};

		var tpl = Handlebars.compile(templates.media_lightbox_img);
	} else {
		var dataModal = {
			"link": contentURL,
			"content_html": new Handlebars.SafeString(content),
			"tweet_html": new Handlebars.SafeString(sourceTweet.outerHTML),
			"tweet_key": tweetKey
		};

		var tpl = Handlebars.compile(templates.media_lightbox_html);
	}

	var html = tpl(dataModal);

	if (sourceTweet.querySelector('a.js-media-image-link')) {
		var thumbLink = sourceTweet.querySelector('a.js-media-image-link');
	} else {
		var thumbLink = sourceTweet.parentNode.querySelector('a.js-media-image-link');
	}

	thumbLink.addEventListener('click', function(e) {
		document.getElementById('open-modal').style.display = "block";
		document.getElementById('open-modal').insertAdjacentHTML('afterbegin', html);

		if (document.querySelector('#open-modal .js-media[data-key]')) document.querySelector('#open-modal .js-media[data-key]').remove();
		ResizeMediaInModal();
		document.querySelector('#open-modal :-webkit-any(img, iframe, video)').onload = function(e) {
			document.querySelector("#open-modal .med-embeditem").classList.add("is-loaded");
		}
		document.querySelector('#open-modal ul.tweet-actions').classList.add('is-visible');

		document.querySelector('#open-modal a.mdl-dismiss').addEventListener('click', function() {
			CloseOpenModal(null, true)
		});


		// Reply button
		document.querySelector('#open-modal a[rel=reply]').addEventListener('click', function() {
			document.querySelector('article[data-key="' + tweetKey + '"] a[rel=reply]').click();
			setTimeout(function() {
				document.querySelector('article[data-key="' + tweetKey + '"] button.js-inline-compose-pop').click();
				document.querySelector('.js-reply-action.is-selected').classList.remove('is-selected');
			}, 0);
			CloseOpenModal(null, true)
		});

		// RT button
		document.querySelector('#open-modal a[rel=retweet]').addEventListener('click', function() {
			document.querySelector('article[data-key="' + tweetKey + '"] a[rel=retweet]').click();
			CloseOpenModal(null, true)
		});

		// Favorite button
		document.querySelector('#open-modal a[rel=favorite]').addEventListener('click', function() {
			document.querySelector('article[data-key="' + tweetKey + '"] a[rel=favorite]').click();
			document.querySelector('#open-modal .js-tweet').classList.toggle('is-favorite');
			document.querySelector('#open-modal a[rel=favorite]').classList.toggle('anim');
			document.querySelector('#open-modal a[rel=favorite]').classList.toggle('anim-slower');
			document.querySelector('#open-modal a[rel=favorite]').classList.toggle('anim-bounce-in');
		});

		// Menu button
		document.querySelector("#open-modal a[rel='actionsMenu']").addEventListener("click", function() {
			// Faking the current tweet being retweeted by triggering the click action on the original button. So tricky, very magic.
			setTimeout(function() {
				document.querySelector('article[data-key="' + tweetKey + '"] a[rel=actionsMenu]').click();
			}, 0);
			setTimeout(function() {
				var originalMenu = document.querySelector('article[data-key="' + tweetKey + '"] .dropdown-menu');
				originalMenu.classList.add("pos-t");
				document.querySelector("#open-modal a[rel='actionsMenu']").insertAdjacentElement("afterEnd", originalMenu);
			}, 0);
			setTimeout(function() {
				for (var i = document.querySelectorAll("#open-modal a[data-action='message'],a[data-action='mention']").length - 1; i >= 0; i--) {
					document.querySelectorAll("#open-modal a[data-action='message'],a[data-action='mention']")[i].addEventListener("click", function() {
						CloseOpenModal(null, true);
					})
				};
			}, 0);
		});
	});
}

function mediaPreviewSize() {
	var jsColumns = document.querySelectorAll(".js-column[data-column]");
	for (var i = jsColumns.length - 1; i >= 0; i--) {
		var col = jsColumns[i];
		var columnSize = TD.storage.columnController.get(col.getAttribute("data-column")).getMediaPreviewSize() || "medium";
		col.setAttribute("data-media-preview-size", columnSize);
	}
}