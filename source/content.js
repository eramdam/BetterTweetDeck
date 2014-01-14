(function betterTweetDeck() {
	// function updateDownloadLinks(event) {
	// 	if (event.target.classList && event.target.classList.contains("thumbnail") && !updating) {
	// 		updating = true;
	// 		addDownloadLinks();
	// 	}
	// };

	function eventDispatcher() {
		if(event.relatedNode.className.indexOf("txt-mute") != -1) {
			timeIsNotRelative(event.relatedNode);
		}else if(event.target.className.indexOf("stream-item") != -1) {
			timeIsNotRelative(event.target.querySelector("time > *"));
			fullNameToUsername(event.target.querySelectorAll("a[rel='user']"));
			useFullUrl(event.target);
		}	
	}

	function timeIsNotRelative(element) {
		d = element.parentNode.getAttribute("data-time");
		td = new Date(parseInt(d));
		year = td.getFullYear();
		month = td.getMonth()+1;
		minutes = td.getMinutes();
		if(minutes < 10) minutes = "0"+minutes;
		hours = td.getHours();
		if(hours < 10) hours = "0"+hours;
		day = td.getDate();
		if(day < 10) day = "0"+day;
		dateString =  day+"/"+month+"/"+year+" "+hours+":"+minutes;
		element.innerHTML = dateString;
		element.classList.add("txt-mute");
	}

	function fullNameToUsername(elements) {
		for (var i = elements.length - 1; i >= 0; i--) {
			if(elements[i].parentNode.tagName != "P") {
				username = elements[i].getAttribute("href").replace(/http(|s):\/\/twitter.com\//,"").replace(/\//g,"");
				if(elements[i].querySelector("b.fullname")){
					elements[i].querySelector("b.fullname").innerHTML = username;
				}else {
					elements[i].innerHTML = username;
				}
				if(elements[i].querySelector("span.username"))
					elements[i].querySelector("span.username").remove();
			}
		};
	}

	function useFullUrl(element) {
		links = element.querySelectorAll("a[data-full-url]");
		for (var i = links.length - 1; i >= 0; i--) {
			fullLink = links[i].getAttribute("data-full-url");
			links[i].href = fullLink;
		};
	}

	// The thumbnail list will be updated on scroll
	document.body.addEventListener("DOMNodeInserted", eventDispatcher);
	document.body.classList.add("btd-circle-avatars");
}());