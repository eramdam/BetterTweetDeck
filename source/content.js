	var options;
	chrome.extension.sendRequest({}, function(response) {
		setAllTheSettings(response);
	});

	function setAllTheSettings(response) {
		options = response;
		document.body.addEventListener("DOMNodeInserted", eventDispatcher);
		if(options.circled_avatars == "true") {
			document.body.classList.add("btd-circle-avatars");
		}
	}

	function eventDispatcher() {
		if(event.relatedNode.className.indexOf("txt-mute") != -1 && options.timestamp != "relative") {
			timeIsNotRelative(event.relatedNode, options.timestamp);
		} else if(event.target.className && event.target.className.indexOf("stream-item") != -1) {
			if(options.timestamp != "relative") {
				if(event.target.querySelector("time")){
					timeIsNotRelative(event.target.querySelector("time > *"), options.timestamp);
				}
			}

			nameDisplay(event.target.querySelectorAll("a[rel='user']:not(.item-img)"), options.name_display);
			
			if(options.url_redirection == "true"){
				useFullUrl(event.target);
			}
			
		}
	}

	function timeIsNotRelative(element, mode) {
		d = element.parentNode.getAttribute("data-time");
		td = new Date(parseInt(d));
		year = td.getFullYear();
		if(year < 10) year = "0"+year;
		month = td.getMonth()+1;
		if(month < 10) month = "0"+month;
		minutes = td.getMinutes();
		if(minutes < 10) minutes = "0"+minutes;
		hours = td.getHours();
		if(hours < 10) hours = "0"+hours;
		day = td.getDate();
		if(day < 10) day = "0"+day;
		if(mode == "absolute_us"){
			dateString =  month+"/"+day+"/"+year+" "+hours+":"+minutes;
		} else {
			dateString =  day+"/"+month+"/"+year+" "+hours+":"+minutes;
		}
		element.innerHTML = dateString;
		element.classList.add("txt-mute");
	}

	function nameDisplay(elements, mode) {
		if(mode == "username"){
			// Username, now there's the fun !
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
		} else if(mode == "fullname") {
			for (var i = document.querySelectorAll(".username").length - 1; i >= 0; i--) {
			// Ignoring the elements argument because I'm lazy and it works so, hey ?
			document.querySelectorAll(".username")[i].remove();
			};
		} 

		// Both. Okay now that's funny because we're not doing anything, that's the default layout, eh !
	}

	function useFullUrl(element) {
		links = element.querySelectorAll("a[data-full-url]");
		for (var i = links.length - 1; i >= 0; i--) {
			fullLink = links[i].getAttribute("data-full-url");
			links[i].href = fullLink;
		};
	}

	// The thumbnail list will be updated on scroll
	