Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}

var DefaultSettings = {
	"timestamp": "absolute",
	"full_after_24h": false,
	"name_display": "both",
	"typeahead_display_username_only": true,
	"circled_avatars": true,
	"no_columns_icons": true,
	"yt_rm_button": true,
	"small_icons_compose": true,
	"grayscale_notification_icons": false,
	"url_redirection": true,
	"blurred_modals": true,
	"only_one_thumbnails": true,
	"minimal_mode": true,
	"flash_tweets": "mentions",
	"providers": {
		"500px": true,
		"bandcamp": true,
		"cloudapp": true,
		"dailymotion": true,
		"deviantart": true,
		"dribbble": true,
		"droplr": true,
		"flickr": true,
		"imgly": true,
		"imgur": true,
		"instagram": true,
		"mobyto": true,
		"soundcloud": true,
		"ted": true,
		"toresize": true,
		"tumblr": true,
		"vimeo": true,
		"yfrog": true,
	}
};

var currentOptions;

chrome.storage.sync.get("BTD", function(obj) {
	if (obj.BTD !== undefined) {
		currentOptions = obj.BTD;
		var reApply = false;

		for (var setting in DefaultSettings) {
			if (currentOptions[setting] == undefined) {
				console.debug("Defining",setting,"to default value", DefaultSettings[setting]);
				currentOptions[setting] = DefaultSettings[setting];
				reApply = true;
			}
		}

		for (var provider in DefaultSettings["providers"]) {
			if (currentOptions["providers"][provider] == undefined) {
				console.log("Adding", provider, "as a new provider with value", DefaultSettings["providers"][provider]);
				currentOptions["providers"][provider] = DefaultSettings["providers"][provider];
				reApply = true;
			}
		}

		for (var setting in currentOptions) {
			if (DefaultSettings[setting] == undefined) {
				console.log("Deleting",setting);
				delete currentOptions[setting];
				reApply = true;
			}
		}

		for (var setting in currentOptions["providers"]) {
			if (DefaultSettings["providers"][setting] == undefined) {
				delete currentOptions["providers"][setting];
				reApply = true;
			}
		}

		if (reApply === true) {
			chrome.storage.sync.set({"BTDOptions": currentOptions}, function() {
				console.log("Options updated!");
				console.log(currentOptions);
			});
		}
	} else {
		chrome.storage.sync.set({"BTD": DefaultSettings}, function() {
			console.log("Default options set");
		})
	}

	
});