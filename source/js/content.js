"use strict";

(function() {
	var readyTD = new MutationObserver(function(mutations) {
		for (var i = mutations.length - 1; i >= 0; i--) {
			if (mutations[i].target.tagName === "DIV" && mutations[i].target.style.display === "none") {
				readyTD.disconnect();
				document.querySelector('.js-app-columns').addEventListener("DOMNodeInserted", columnObserver);
			}
		}
	});

	readyTD.observe(document.querySelector(".js-app-loading"), {
		attributes: true
	});

	//= include timeIsNotRelative.js
	//= include nameDisplay.js

	function columnObserver(event) {
		var target = event.target;
		if (target.tagName === "ARTICLE") {
			timeIsNotRelative(target.querySelector('[datetime]'), "");
			
			nameDisplay(target,"username");
		} else if (target.nodeName === "#text" && event.relatedNode.className.indexOf("txt-small") != -1) {
			timeIsNotRelative(event.relatedNode.parentNode, "")
		}
	}

})();