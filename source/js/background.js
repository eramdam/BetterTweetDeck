if (!settings) {
	var settings = new Store("settings", {
		"timestamp": "absolute",
		"full_after_24h": false,
		"name_display": "both",
		"typeahead_display_username_only": false,
		"circled_avatars": false,
		"no_columns_icons": false,
		"yt_rm_button": true,
		"small_icons_compose": true,
		"grayscale_notification_icons": false,
		"url_redirection": true,
		"img_preview_500px": true,
		"img_preview_bandcamp": true,
		"img_preview_cloud": true,
		"img_preview_dailymotion": true,
		"img_preview_deviantart": true,
		"img_preview_dribbble": true,
		"img_preview_droplr": true,
		"img_preview_dropbox": true,
		"img_preview_flickr": true,
		"img_preview_imgly": true,
		"img_preview_imgur": true,
		"img_preview_instagram": true,
		"img_preview_mobyto": true,
		"img_preview_soundcloud": true,
		"img_preview_tumblr": true,
		"img_preview_ted": true,
		"img_preview_vimeo": true,
		"img_preview_yfrog": true,
		"blurred_modals": true,
		"only_one_thumbnails": true,
		"minimal_mode": false
	});
}

chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
		sendResponse(settings.toObject());
	}
);

function onInstall() {
	chrome.tabs.create({
		url: "fancy-settings/source/index.html?welcome"
	});
}

function onUpdate() {
	chrome.tabs.create({
		url: "fancy-settings/source/index.html?update"
	});
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
		onInstall();
	} else {
		if (!(prevVersion.split(".")[0] == currVersion.split(".")[0] && prevVersion.split(".")[1] == currVersion.split(".")[1])) {
			onUpdate();
		}
	}
	localStorage['version'] = currVersion;
}

const TWEETDECK_WEB_URL = 'https://tweetdeck.twitter.com';

/**
 * Step 2: Collate a list of all the open tabs.
 */
function gatherTabs(urls, itemInfos) {
    var allTheTabs = [];
    var windowsChecked = 0;

    // First get all the windows...
    chrome.windows.getAll(function (windows) {
        for (var i = 0; i < windows.length; i++) {
            // ... and then all their tabs.
            chrome.tabs.getAllInWindow(windows[i].id, function (tabs) {
                windowsChecked++;
                allTheTabs = allTheTabs.concat(tabs);

                if (windowsChecked === windows.length) {
                    // We have all the tabs! Search for a TweetDeck...
                    openApp(urls, allTheTabs, itemInfos);
                }
            });

        }
    });
}

/**
 * Step 3: Jump to TweetDeck tab or open a new one.
 */

function composeTweet() {
	jQuery(document).trigger("uiComposeTweet", { text: itemInfos.text + " " + itemInfos.url});
}

function openApp(urls, tabs, itemInfos) {
    // Search urls in priority order...
    for (var i = 0; i < urls.length; i++) {
        var url = urls[i];
        
        // Search tabs...
        for (var j = 0; j < tabs.length; j++) {
            var tab = tabs[j];
            if (tab.url.indexOf(url) === 0) {
                // Found it!
                var tabId = tab.id;
                chrome.windows.update(tab.windowId, {focused :  true});
                chrome.tabs.update(tabId, {selected :  true, active: true, highlighted: true}, function() {
                	var text = itemInfos.text;
                	var url = itemInfos.url;
                	chrome.tabs.sendRequest(tabId, {text: text, url: url})
                });
                return;
            }
        }
    }

    // Didn't find it! Open a new one!
    chrome.tabs.create({ url : urls[0] });
};

var clickHandler = function(info, tab) {
	var text;
	var url;

	if (info.selectionText) {
		text = info.selectionText.substr(0,99);
	} else {
		text = tab.title.substr(0,99);
	}

	if (info.linkUrl) {
		url = info.linkUrl
	} else {
		url = info.pageUrl;
	}

	if(info.mediaType === "image") {
		url = info.srcUrl;
		text = "";
	}

	gatherTabs([TWEETDECK_WEB_URL], {"text": text, "url": url});
};

chrome.contextMenus.create({
	"title": "Share on (Better) TweetDeck",
	"contexts": ["page", "selection", "image", "link"],
	"onclick": clickHandler
});



