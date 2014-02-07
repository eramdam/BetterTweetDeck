if(!settings) {
	var settings = new Store("settings", {
	"timestamp": "relative",
	"name_display": "both",
	"url_redirection": true,
	"circled_avatars": false,
	"img_preview": "small",
	"img_preview_imgur": true,
	"img_preview_droplr": true,
	"img_preview_instagram": true,
	"img_preview_flickr": true,
	"img_preview_500px": true,
	"img_preview_cloud": true,
	"reduced_padding": true,
	"no_columns_icons": false,
	"full_after_24h": "false",
	"typeahead_display_username_only": false,
	"grayscale_notification_icons": false,
	"yt_rm_button": true
	});
}

chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
		sendResponse(settings.toObject());
	}
);
function onInstall() {
chrome.tabs.create({url: "fancy-settings/source/index.html"});
}

function onUpdate() {
// chrome.tabs.create({url: "update.html"});
chrome.tabs.create({url: "fancy-settings/source/index.html?update"});
}

function getVersion() {
var details = chrome.app.getDetails();
return details.version;
}

// Check if the version has changed.
var currVersion = getVersion();
var prevVersion = localStorage['version']
if (currVersion != prevVersion) {
// Check if we just installed this extension.
if (typeof prevVersion == 'undefined') {
  //onInstall();
} else {
  onUpdate();
}
localStorage['version'] = currVersion;
}