if(!settings) {
	var settings = new Store("settings", {
	"timestamp": "relative",
	"name_display": "both",
	"url_redirection": "true",
	"circled_avatars": "false",
	"img_preview": "small",
	"reduced_padding": "true",
	"no_columns_icons": "false",
	"full_after_24h": "false",
	"typeahead_display_username_only": "false",
	"grayscale_notification_icons": "false"
	});
}

chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
		sendResponse(settings.toObject());
	}
);