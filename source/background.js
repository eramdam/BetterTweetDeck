if(!settings) {
	var settings = new Store("settings", {
	"timestamp": "relative",
	"name_display": "both",
	"url_redirection": true,
	"circled_avatars": false,
	"img_preview": "small"
	});
}

chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
		sendResponse(settings.toObject());
	}
);