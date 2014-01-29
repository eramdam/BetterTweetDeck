if(!settings) {
	var settings = new Store("settings", {
	"timestamp": "absolute",
	"name_display": "username",
	"url_redirection": "true",
	"circled_avatars": "true",
	"img_preview": "small",
	"reduced_padding": "true",
	"no_columns_icons": "true"
	});
}

chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
		sendResponse(settings.toObject());
	}
);