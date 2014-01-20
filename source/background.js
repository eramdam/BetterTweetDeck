if(!settings) {
	var settings = new Store("settings", {
	"timestamp": "relative",
	"name_display": "both",
	"url_redirection": "true",
	"circled_avatars": "true",
	"img_preview": "small",
	"fading_pictures": "true",
	"reduced_padding": "true",
	"no_columns_icons": "true"
	});
}

chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
		sendResponse(settings.toObject());
	}
);