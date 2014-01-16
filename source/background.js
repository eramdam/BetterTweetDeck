if(!settings) {
	var settings = new Store("settings", {
	"timestamp": "relative",
	"name_display": "both",
	"url_redirection": true,
	"circled_avatars": false
	});
}

chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
		// chrome.pageAction.show(sender.tab.id);
		sendResponse(settings.toObject());
	}
);