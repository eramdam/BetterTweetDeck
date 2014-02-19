var options;
chrome.extension.sendRequest({}, function(response) {
	setAllTheSettings(response);
});

function setAllTheSettings(response) {
	options = response;
	// Handling the old true/false strings in options
	for(var key in options) {
		if(options.hasOwnProperty(key)) {
			if(options[key] == "true") options[key] = true;
			if(options[key] == "false") options[key] = false;
		}
	}
	bodyClasses = document.body.classList;
	doneTheStuff = false;
	document.body.addEventListener("DOMNodeInserted", eventDispatcher);
	if(options.circled_avatars == true) {
		bodyClasses.add("btd-circle-avatars");
	}
	if(options.reduced_padding == true) {
		bodyClasses.add("btd-reduced-padding");
	}
	if(options.no_columns_icons == true) {
		bodyClasses.add("btd-no-columns-icons");
	}
	if(options.grayscale_notification_icons == true) {
		bodyClasses.add("btd-grayscale-notification-icons");
	}
	if(options.only_one_thumbnails == true) {
		bodyClasses.add("btd-one-thumbnail");
	}
}

// console.log(window.TD.storage.columnController.get("c1391979750742s76").getMediaPreviewSize());

function eventDispatcher() {
	function mediaPreviewSize() {
		for (var i = document.querySelectorAll(".js-column[data-column]").length - 1; i >= 0; i--) {
			var col = document.querySelectorAll(".js-column[data-column]")[i];
			var columnSize = TD.storage.columnController.get(col.getAttribute("data-column")).getMediaPreviewSize();
			col.setAttribute("data-media-preview-size",columnSize);
		};
	}

	function findColumn(childObj) {
	    var testObj = childObj.parentNode;
	    var count = 1;
	    while(!testObj.classList.contains("js-column")) {
	        testObj = testObj.parentNode;
	        count++;
	    }
	    // now you have the object you are looking for - do something with it
	    return testObj;
	}

	// Change data-media-preview-size when small/medium/large are clicked
	for (var i = 0; i < document.querySelectorAll(".column a[data-value]:not(.is-selected)").length; i++) {
		document.querySelectorAll(".column a[data-value]:not(.is-selected)")[i].addEventListener("click", function() {
			findColumn(event.target).setAttribute("data-media-preview-size",event.target.parentNode.getAttribute("data-value"));
		});
	};

	// If the event.target is the text (TweetDeck updates timestamp at regular intervals) then we can get the .txt-mute element and tweak it in real-time
	if(event.relatedNode.className.indexOf("txt-mute") != -1 && options.timestamp != "relative") {
		timeIsNotRelative(event.relatedNode, options.timestamp);
	} 
	// If it's not a .txt-mute element, it must be a tweet or something similar, let's check it !
	else if(event.target.className && event.target.className.indexOf("stream-item") != -1) {
		if(document.querySelectorAll(".js-column").length > 0) {
			if(!doneTheStuff) {
				doneTheStuff = true;
				injectScript(mediaPreviewSize);
			}
		}
		// Applying the timestamp
		if(options.timestamp != "relative") {
			if(event.target.querySelector("time")){
				timeIsNotRelative(event.target.querySelector("time > *"), options.timestamp);
			}
		}

		// Tweaking the name displaying
		nameDisplay(event.target.querySelectorAll("a[rel='user']:not(.item-img)"), options.name_display);
		
		// If asked, removing t.co links
		if(options.url_redirection == true){
			useFullUrl(event.target);
		}

		// If asked, creating the non-pic.twitter image previews
		var links = event.target.querySelectorAll("p > a[data-full-url]");
		if(links.length > 0) {
		var isDetail = links[0].parentNode.parentNode.querySelectorAll(".js-cards-container").length != 0;
		var imgURL = links[0].getAttribute("data-full-url");
			if((imgURL.indexOf("imgur.com/") != -1 && imgURL.indexOf("/?q") == -1) && options.img_preview_imgur == true){
				createPreviewDiv(links[0],"imgur");
			} else if(imgURL.indexOf("d.pr/i") != -1 && options.img_preview_droplr == true) {
				if(isDetail == false) createPreviewDiv(links[0],"droplr");
			} else if(imgURL.indexOf("cl.ly/") != -1 && options.img_preview_cloud == true) {
				if(isDetail == false) createPreviewDiv(links[0],"cloudApp");
			} else if(imgURL.indexOf("instagram.com/") != -1 && options.img_preview_instagram == true) {
				createPreviewDiv(links[0],"instagram");
			} else if((imgURL.indexOf("flic.kr/") != -1 || imgURL.indexOf("flickr.com/") != -1) && options.img_preview_flickr == true){
				if(isDetail == false) createPreviewDiv(links[0],"flickr")
			} else if(imgURL.indexOf("500px.com/") != -1 && options.img_preview_500px == true) {
				if(isDetail == false) createPreviewDiv(links[0],"fivehundredpx");
			} else if(imgURL.indexOf("media.tumblr.com/") != -1 && options.img_preview_tumblr == true) {
				createPreviewDiv(links[0],"tumblr");
			} else if(new RegExp("vimeo.com\/[0-9]*$").test(imgURL) && options.img_preview_vimeo == true) {
				createPreviewDiv(links[0],"vimeo");
			} else if(imgURL.indexOf("dailymotion.com/video/") != -1 && options.img_preview_dailymotion == true) {
				createPreviewDiv(links[0],"dailymotion");
			}
		}

		if(options.yt_rm_button == true) {
			var preview = event.target.querySelectorAll("div.video-overlay.icon-with-bg-round");

			if(preview != null) {
				for (var i = preview.length - 1; i >= 0; i--) {
					preview[i].remove();
				};
			}
		}
	} else if(event.relatedNode.classList.contains("typeahead")) {
		if(options.typeahead_display_username_only == true) {
			for (var i = event.relatedNode.querySelectorAll("strong.fullname").length - 1; i >= 0; i--) {
				event.relatedNode.querySelectorAll("strong.fullname")[i].remove();
			};
			for (var i = event.relatedNode.querySelectorAll("span.username").length - 1; i >= 0; i--) {
				event.relatedNode.querySelectorAll("span.username")[i].style.fontWeight= "bold";
				event.relatedNode.querySelectorAll("span.username")[i].classList.add("fullname");
				event.relatedNode.querySelectorAll("span.username")[i].classList.remove("username");
			};
		}
	} else if(event.relatedNode.id == "actions-modal") {
		event.target.classList.remove("s-fluid");
		event.target.style.height = "auto";
	}
}

function createPreviewDiv(element, provider) {
	function findColumn(childObj) {
	    var testObj = childObj.parentNode;
	    var count = 1;
	    while(testObj.classList && !testObj.classList.contains("js-column")) {
	        testObj = testObj.parentNode;
	        count++;
	    }
	    // now you have the object you are looking for - do something with it
	    return testObj;
	}
	// Getting the full URL for later
	var linkURL = element.getAttribute("data-full-url");
	if(typeof findColumn(element).getAttribute === "function") {
		var thumbSize = findColumn(element).getAttribute("data-media-preview-size");
	}
	if(thumbSize == "large" || thumbSize == "medium" || thumbSize == "small") {
			if(provider == "imgur") {
			// Settings up some client-ID to "bypass" the request rate limite (12,500 req/day/client)
			var imgurClientIDs = ["c189a7be5a7a313","180ce538ef0dc41"];
			function getClientID() {
				return imgurClientIDs[Math.floor(Math.random() * imgurClientIDs.length)];
			}
			// Setting the right suffix depending of the user's option
			if(thumbSize == "small") suffixImgur = "t";
			if(thumbSize == "medium") suffixImgur = "m";
			if(thumbSize == "large") suffixImgur = "l";
			var imgurID = linkURL.split("#")[0].split("/")[4];
			// Album
			if(linkURL.indexOf("imgur.com/a/") != -1) {
				previewFromAnAlbum(imgurID);
			} else if(linkURL.indexOf("imgur.com/gallery/") != -1) {
				$.ajax({
					// Sidenote, even if Imgur got different models for album and gallery, they share the same API url so, why bother ?
					url: "https://api.imgur.com/3/gallery/image/"+imgurID,
					type: 'GET',
					dataType: 'json',
					// Plz don't steal this data, anyone can create an Imgur app so be fair !
					headers: {"Authorization": "Client-ID "+getClientID()}
				})
				.done(function(data) {
					// Gallery/image
					var thumbnailUrl = "https://i.imgur.com/"+data.data.id+suffixImgur+".jpg";
					continueCreatingThePreview(thumbnailUrl,thumbnailUrl.replace(/[a-z].jpg/,".jpg"));
				})
				.fail(function() {
					// Gallery/Album
					console.log("Better TweetDeck: Gallery isn't a image!");
					previewFromAnAlbum(imgurID,"https://imgur.com/a/"+imgurID+"/embed");
				});
			} else {
				// Single image
				var imgurID = linkURL.split("#")[0].split("/")[3].split(".")[0];
				continueCreatingThePreview("https://i.imgur.com/"+imgurID+suffixImgur+".jpg","https://i.imgur.com/"+imgurID+".jpg");
			}

			function previewFromAnAlbum(albumID) {
				$.ajax({
					// Sidenote, even if Imgur got different models for album and gallery, they share the same API url so, why bother ?
					url: "https://api.imgur.com/3/album/"+albumID,
					type: 'GET',
					dataType: 'json',
					// Plz don't steal this data, anyone can create an Imgur app so be fair !
					headers: {"Authorization": "Client-ID "+getClientID()}
				})
				.done(function(data) {
					// Make the thumbnail URL with suffix and the ID of the first images in the album/gallery
					var thumbnailUrl = "https://i.imgur.com/"+data.data.cover+suffixImgur+".jpg";
					continueCreatingThePreview(thumbnailUrl,"https://imgur.com/a/"+albumID+"/embed",true);
				});
			}
		} else if(provider == "droplr") {
			// Depending of the thumbSize option we're getting d.pr/i/1234/small or d.pr/i/1234/medium (it seems like Droplr hasn't a "large" option)
			if(thumbSize == "small") {
				var suffixDroplr = thumbSize;
			} else {
				var suffixDroplr = "medium";
			}
			// Removing the last "/" if present and adding one+suffix
			var thumbnailUrl = linkURL.replace(/\/$/,"");
			var thumbnailUrl = thumbnailUrl+"/"+suffixDroplr;
			continueCreatingThePreview(thumbnailUrl, linkURL+"+");
		} else if(provider == "cloudApp") {
			$.ajax({
				url: linkURL,
				type: 'GET',
				dataType: 'json',
				headers: {"Accept": "application/json"}
			})
			.done(function(data) {
				
				if(data.item_type == "image"){
					var thumbnailUrl = data.thumbnail_url;
					continueCreatingThePreview(thumbnailUrl, data.content_url);
				}
			});
		} else if(provider == "instagram") {
			var instagramID = linkURL.replace(/\/$/,"").split("/").pop();
			if(thumbSize == "large") suffixInstagram = "l";
			if(thumbSize == "medium") suffixInstagram = "m";
			if(thumbSize == "small") suffixInstagram = "t";
			continueCreatingThePreview("http://instagr.am/p/"+instagramID+"/media/?size="+suffixInstagram);
			
		} else if(provider == "flickr") {
			if(thumbSize == "large") maxWidth = 800;
			if(thumbSize == "medium") maxWidth = 500;
			if(thumbSize == "small") maxWidth = 300;
			var flickUrl = linkURL.replace(":","%3A");
			$.ajax({
				url: 'https://www.flickr.com/services/oembed/?url='+flickUrl+'&format=json&maxwidth='+maxWidth,
				type: 'GET',
				dataType: "json"
			})
			.done(function(data) {
				continueCreatingThePreview(data.url);
			});
		} else if(provider == "fivehundredpx") {
			var photoID = linkURL.replace(/http(|s):\/\/500px.com\/photo\//,"");
			if(thumbSize == "large") suffixFiveHundred = "4";
			if(thumbSize == "medium") suffixFiveHundred = "3";
			if(thumbSize == "small") suffixFiveHundred = "2";
			$.ajax({
				// Don't steal my consumer key, please !
				url: "https://api.500px.com/v1/photos/"+photoID+"?consumer_key=8EUWGvy6gL8yFLPbuF6A8SvbOIxSlVJzQCdWSGnm",
				type: 'GET',
				dataType: "json"
			})
			.done(function(data) {
				var picURL = data.photo.image_url.replace(/[0-9].jpg$/,suffixFiveHundred+".jpg");
				var fullPicURL = data.photo.image_url;
				continueCreatingThePreview(picURL,fullPicURL);
			});
		} else if(provider == "tumblr") {
			// Using the appropriate suffix depending of the settings
			if(thumbSize == "large") suffixTumblr = "500";
			if(thumbSize == "medium") suffixTumblr = "400";
			if(thumbSize == "small") suffixTumblr = "250";
			// Getting the file extension of the URL for later
			var fileExtension = linkURL.split(".").pop();
			// splitting by the "_" characted to remove the suffix
			var splittedURL = linkURL.split("_");
			// Building the new URL
			var thumbnailUrl = splittedURL[0]+"_"+splittedURL[1]+"_"+suffixTumblr+"."+fileExtension;
			var fullImgUrl = splittedURL[0]+"_"+splittedURL[1]+"_640."+fileExtension;
			continueCreatingThePreview(thumbnailUrl, fullImgUrl);
		} else if(provider == "vimeo") {
			var suffixVimeo;
			if(thumbSize == "large") suffixVimeo = "640";
			if(thumbSize == "medium") suffixVimeo = "200";
			if(thumbSize == "small") suffixVimeo = "100";
			var vimeoID = linkURL.split("/").pop();
			$.ajax({
				url: 'http://vimeo.com/api/oembed.json?url=http%3A//vimeo.com/'+vimeoID,
				type: 'GET',
				dataType: 'json'
			})
			.done(function(data) {
				continueCreatingThePreview(data.thumbnail_url.replace(/_[0-9]*.jpg$/,"_")+suffixVimeo+".jpg",data.html,true);
			});
		} else if(provider == "dailymotion") {
			var dailymotionID = linkURL.replace(/\/$/,"").split("/")[4]
			if(thumbSize == "large") {
				$.ajax({
					url: 'https://api.dailymotion.com/video/'+dailymotionID+"?fields=thumbnail_480_url,embed_html",
					type: 'GET',
					dataType: 'json'
				})
				.done(function(data) {
					continueCreatingThePreview(data.thumbnail_480_url,data.embed_html.replace("http://","https://"),true);
				});
				
			}
			if(thumbSize == "medium") {
				$.ajax({
					url: 'https://api.dailymotion.com/video/'+dailymotionID+"?fields=thumbnail_240_url,embed_html",
					type: 'GET',
					dataType: 'json'
				})
				.done(function(data) {
					continueCreatingThePreview(data.thumbnail_240_url,data.embed_html,true);
				});
				
			}
			if(thumbSize == "small") {
				$.ajax({
					url: 'https://api.dailymotion.com/video/'+dailymotionID+"?fields=thumbnail_180_url,embed_html",
					type: 'GET',
					dataType: 'json'
				})
				.done(function(data) {
					continueCreatingThePreview(data.thumbnail_180_url,data.embed_html,true);
				});
				
			}
		}
	}

	function continueCreatingThePreview(thumbnailUrl, embed, isAnIframe) {
		var fullBleed = "";
		if(thumbSize == "large") {
			marginSuffix = "tm";
			fullBleed = "item-box-full-bleed";
		} else {
			marginSuffix = "vm";
		}
		var linkURL = element.getAttribute("data-full-url");
		// Creating the elements, replicating the same layout as TweetDeck's one
		var previewDiv = document.createElement("div");
		previewDiv.className = "js-media media-preview position-rel btd-preview "+provider+" "+fullBleed;

		var previewDivChild = document.createElement("div");
		previewDivChild.className = "js-media-preview-container position-rel margin-"+marginSuffix;
		var previewLink = document.createElement("a");
		previewLink.className = "js-media-image-link block med-link media-item media-size-"+thumbSize+"";
		// Little difference, using rel=url otherwhise TweetDeck will treat it as a "real" media preview, therefore "blocking" the click on it 
		// previewLink.setAttribute("rel","url");
		previewLink.href = linkURL;
		previewLink.setAttribute("target","_blank");
		previewLink.setAttribute("data-tweetkey",element.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("data-key"));
		// Applying our thumbnail as a background-image of the preview div
		previewLink.style.backgroundImage = "url("+thumbnailUrl+")";
		previewLink.setAttribute("data-provider",provider);

		if(embed){
			previewLink.setAttribute("data-embed",embed);
		}

		if(isAnIframe) {
			previewLink.setAttribute("data-isembed","true");
		}

		// Constructing our final div
		previewDivChild.appendChild(previewLink);
		previewDiv.appendChild(previewDivChild);

		// Adding it next to the <p> element, just before <footer> in a tweet
		// console.log(previewDiv);
		if(thumbSize == "large") {
			var pElement = element.parentNode.parentNode.parentNode.parentNode.querySelector("div.js-tweet.tweet");
		} else {
			var pElement = element.parentNode.parentNode.querySelector("p.js-tweet-text");
		}

		if(pElement) {
			pElement.insertAdjacentElement("afterEnd", previewDiv);
			if(thumbSize == "large") {
				var triangle = document.createElement("span");
				triangle.className = "triangle";
				previewDiv.insertAdjacentElement("beforeEnd",triangle);
			}
		}
		createLightboxes();
	}
}

function createLightboxes() {
	var noLightboxYet = document.querySelectorAll(".btd-preview a:not(.lightbox-enabled)");
	for (var i = noLightboxYet.length - 1; i >= 0; i--) {
		noLightboxYet[i].addEventListener("click", lightboxFromTweet);
		noLightboxYet[i].classList.add("lightbox-enabled");
	};
}

function lightboxFromTweet() {
	var linkLightbox = event.target;
	var dataEmbed = linkLightbox.getAttribute("data-embed");
	var dataIsEmbed = linkLightbox.getAttribute("data-isembed");
	var dataProvider = linkLightbox.getAttribute("data-provider");
	var dataTweetKey = linkLightbox.getAttribute("data-tweetkey");
	openModal = document.getElementById("open-modal");
	openModal.innerHTML = '<div id="btd-modal-dismiss"></div><div class="js-mediatable ovl-block is-inverted-light"><div class="s-padded"><div class="js-modal-panel mdl s-full med-fullpanel"><a href="#" class="mdl-dismiss js-dismiss mdl-dismiss-media" rel="dismiss"><i class="icon icon-close"></i></a><div class="js-embeditem med-embeditem"><div class="l-table"><div class="l-cell"><div class="med-tray js-mediaembed"></div></div></div></div><div id="media-gallery-tray"></div><div class="js-media-tweet med-tweet"></div></div></div>';
	// If we didn't get the embed stuff go get it !
	if(dataProvider == "instagram") {
		$.ajax({
			url: 'http://api.instagram.com/oembed?url='+linkLightbox.href,
			type: 'GET',
			dataType: 'json'
		})
		.done(function(data) {
			if(data.url.indexOf(".mp4") != -1) {
				var instaVideo = '<video width="640" height="640" controls><source src='+data.url+' type="video/mp4"></video>';
				openModal.querySelector(".js-mediaembed").innerHTML = instaVideo+'<a class="med-origlink" href='+linkLightbox.href+' rel="url" target="_blank">View original</a><a class="js-media-flag-nsfw med-flaglink " href="#">Flag media</a><a class="js-media-flagged-nsfw med-flaglink is-hidden" href="https://support.twitter.com/articles/20069937" rel="url" target="_blank">Flagged (learn more)</a>';
			} else {
				openModal.querySelector(".js-mediaembed").innerHTML = '<div class="js-media-preview-container position-rel margin-vm"> <a class="js-media-image-link block med-link media-item" rel="mediaPreview" target="_blank"> <img class="media-img" src='+data.url+' alt="Media preview" style="max-width: 708px;"></a></div><a class="med-origlink" rel="url" href='+linkLightbox.href+' target="_blank">View original</a><a class="js-media-flag-nsfw med-flaglink " href="#">Flag media</a><a class="js-media-flagged-nsfw med-flaglink is-hidden" href="https://support.twitter.com/articles/20069937" rel="url" target="_blank">Flagged (learn more)</a>';
			}
		});
		
	} else if(dataProvider == "imgur" && dataIsEmbed != null) {
		openModal.querySelector(".js-mediaembed").innerHTML = '<iframe class="imgur-album" width="708" height="550" frameborder="0" src='+dataEmbed+'></iframe><a class="med-origlink" href='+linkLightbox.href+' rel="url" target="_blank">View original</a><a class="js-media-flag-nsfw med-flaglink " href="#">Flag media</a><a class="js-media-flagged-nsfw med-flaglink is-hidden" href="https://support.twitter.com/articles/20069937" rel="url" target="_blank">Flagged (learn more)</a>';
	} else {
		// If we already got the embed URL/code
		if(dataEmbed != null) {
			// If we code an embed code
			if(dataIsEmbed != null) {
				openModal.querySelector(".js-mediaembed").innerHTML = dataEmbed+'<a class="med-origlink" href='+linkLightbox.href+' rel="url" target="_blank">View original</a><a class="js-media-flag-nsfw med-flaglink " href="#">Flag media</a><a class="js-media-flagged-nsfw med-flaglink is-hidden" href="https://support.twitter.com/articles/20069937" rel="url" target="_blank">Flagged (learn more)</a>';
			} else {
				openModal.querySelector(".js-mediaembed").innerHTML = '<div class="js-media-preview-container position-rel margin-vm"> <a class="js-media-image-link block med-link media-item" rel="mediaPreview" target="_blank"> <img class="media-img" src='+dataEmbed+' alt="Media preview" style="max-width: 708px;"></a></div><a class="med-origlink" rel="url" href='+linkLightbox.href+' target="_blank">View original</a><a class="js-media-flag-nsfw med-flaglink " href="#">Flag media</a><a class="js-media-flagged-nsfw med-flaglink is-hidden" href="https://support.twitter.com/articles/20069937" rel="url" target="_blank">Flagged (learn more)</a>';
			}
		}
	}
	finishTheLightbox(dataTweetKey);
	function finishTheLightbox(dataTweetKey) {
		if(openModal.querySelector(".js-mediaembed :-webkit-any(img, iframe, audio)") != null) {
			openModal.querySelector(".js-mediaembed :-webkit-any(img, iframe, audio)").onload = function() {
				openModal.querySelector(".med-embeditem").classList.add("is-loaded");
				openModal.querySelector(".med-tray.js-mediaembed").style.opacity = 1;
			}
		} else {
			openModal.querySelector(".med-tray.js-mediaembed").style.opacity = 1;
			openModal.querySelector(".med-embeditem").classList.add("is-loaded");
		}
		
		openModal.querySelector(".js-media-tweet").innerHTML = document.querySelector("[data-key='"+dataTweetKey+"']").innerHTML;
		if(openModal.querySelector(".js-media-tweet .activity-header") != null) {
			openModal.querySelector(".js-media-tweet .activity-header").remove();
		}
		if(openModal.querySelector(".js-media-tweet .feature-customtimelines") != null) {
			openModal.querySelector(".js-media-tweet .feature-customtimelines").remove();
		}
		if(openModal.querySelector(".js-media") != null) {
			openModal.querySelector(".js-media").remove();
		}
		if(openModal.querySelector(".js-tweet-actions.tweet-actions") != null) {
			openModal.querySelector(".js-tweet-actions.tweet-actions").classList.add("is-visible");
		}
		openModal.style.display = "block";
		for (var i = openModal.querySelectorAll("a[rel=dismiss], #btd-modal-dismiss").length - 1; i >= 0; i--) {
			openModal.querySelectorAll("a[rel=dismiss], #btd-modal-dismiss")[i].addEventListener("click", function() {
				openModal.style.display = "none";
				openModal.innerHTML = "";
			});
		};
	}
}

function timeIsNotRelative(element, mode) {
	// Getting the timestamp of an item
	d = element.parentNode.getAttribute("data-time");
	// Creating a Date object with it
	td = new Date(parseInt(d));
	if(options.full_after_24h == true) {
		now = new Date();
		difference = now - td;
	    var msPerMinute = 60 * 1000;
	    var msPerHour = msPerMinute * 60;
	    var msPerDay = msPerHour * 24;
	}



	// Creating year/day/month/minutes/hours variables and applying the lead zeros if necessary
	var year = td.getFullYear();
	if(year < 10) year = "0"+year;
	var month = td.getMonth()+1;
	if(month < 10) month = "0"+month;
	var minutes = td.getMinutes();
	if(minutes < 10) minutes = "0"+minutes;
	var hours = td.getHours();
	if(hours < 10) hours = "0"+hours;
	var day = td.getDate();
	if(day < 10) day = "0"+day;

	var dateString;
	// Handling "US" date format
	if(options.full_after_24h == true && difference < msPerDay) {
		dateString = hours+":"+minutes;
	} else {
		if(mode == "absolute_us"){
			dateString =  month+"/"+day+"/"+year+" "+hours+":"+minutes;
		} else {
			dateString =  day+"/"+month+"/"+year+" "+hours+":"+minutes;
		}
	}
	// Changing the content of the "time > a" element with the absolute time
	element.innerHTML = dateString;
	element.classList.add("txt-mute");
}

function nameDisplay(elements, mode) {
	if(mode == "username"){
		// If we just want the @username.
		for (var i = elements.length - 1; i >= 0; i--) {
			// If the username is NOT in a tweet (typically in a <p> element), do the thing
			if(elements[i].parentNode.tagName != "P") {
				// Removing "http://twitter.com" and the last "/" in the link to get the @username
				var username = elements[i].getAttribute("href").replace(/http(|s):\/\/twitter.com\//,"").replace(/\//g,"");

				// Placing the username in b.fullname if found or in span.username
				if(elements[i].querySelector("b.fullname")){
					elements[i].querySelector("b.fullname").innerHTML = username;
				} else {
					elements[i].innerHTML = username;
				}
				if(elements[i].querySelector("span.username")){
					elements[i].querySelector("span.username").remove();
				}
			}
		};
	} else if(mode == "fullname") {
		// If we just want the fullname, basically we exterminate the usernames
		for (var i = document.querySelectorAll(".username").length - 1; i >= 0; i--) {
		// Ignoring the elements argument because I'm lazy and it works so, hey ?
		document.querySelectorAll(".username")[i].remove();
		};
	} else if(mode == "inverted") {
		// If we want the @username AND the full name, we'll have to swap them
		for (var i = elements.length - 1; i >= 0; i--) {
			// If the username is NOT in a tweet (typically in a <p> element), do the thing
			if(elements[i].parentNode.tagName != "P") {
				// Removing "http://twitter.com" and the last "/" in the link to get the @username
				var username = elements[i].getAttribute("href").split("/").pop();
				if(elements[i].querySelector("b.fullname")) {
					var fullname = elements[i].querySelector("b.fullname").innerHTML;
				}
				if(elements[i].querySelector("span.username")) {
					elements[i].querySelector("span.username span.at").remove();
					// Don't ask me why, I have to apply the fullname twice in order to this to work
					elements[i].querySelector("span.username").innerHTML = fullname;
					elements[i].querySelector("span.username").innerHTML = fullname;
					if(elements[i].querySelector("b.fullname")) {
						elements[i].querySelector("b.fullname").innerHTML = username;
					} else {
						elements[i].innerHTML = username;

					}
				} else {
					elements[i].innerHTML = username;
					if(elements[i].classList.contains('account-link')) {
						elements[i].style.fontWeight = "bold";
					}
				}
				
			}
		};
	}
}

function useFullUrl(element) {
	// Pretty easy, getting the data-full-url content and applying it as href in the links. Bye bye t.co !
	var links = element.querySelectorAll("a[data-full-url]");
	for (var i = links.length - 1; i >= 0; i--) {
		fullLink = links[i].getAttribute("data-full-url");
		links[i].href = fullLink;
	};
}