"use strict";

(function() {
	var readyTD = new MutationObserver(function(mutations) {
		for (var i = mutations.length - 1; i >= 0; i--) {
			if(mutations[i].target.tagName === "DIV" && mutations[i].target.style.display === "none") {
				console.log("TD ready!");
				readyTD.disconnect();
			}
		};
	});

	readyTD.observe(document.querySelector(".js-app-loading"), {attributes: true});
})();