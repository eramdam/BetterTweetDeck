function useFullURL(element) {
	if (typeof element.querySelector === "function") {
		// Pretty easy, getting the data-full-url content and applying it as href in the links. Bye bye t.co !
		var links = element.querySelectorAll("a[data-full-url], a.prf-siteurl[href*='t.co']");
		for (var i = links.length - 1; i >= 0; i--) {
			var fullLink = links[i].getAttribute("data-full-url") || "http://" + links[i].innerText;
			links[i].href = fullLink;
		};
	}
}