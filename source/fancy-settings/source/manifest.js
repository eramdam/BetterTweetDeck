// SAMPLE
var locale = function(string) {
    return i18n.get(string)
};
var settingsTitle = locale("settingsTitle");
this.manifest = {
    "name": "BetterTweetDeck",
    "icon": "icon.png",
    "settings": [{
        "tab": locale("tabGeneral"),
        "group": locale("groupInfo"),
        "name": "informations",
        "type": "description",
        "text": locale("warning")
    }, {
        "tab": locale("tabDisplay"),
        "group": "Aperçu",
        "name": "preview",
        "type": "description",
        "text": "<div class='tweet-preview'><div class=picture></div> <div class=name></div> <div class=timestamp></div></div>"
    }, {
        "tab": locale("tabDisplay"),
        "group": locale("groupTimeFormatting"),
        "name": "timestamp",
        "type": "radioButtons",
        "label": locale("timeShouldBe"),
        "options": [{
            "value": "relative",
            "text": locale("timeRelative")
        }, {
            "value": "absolute",
            "text": locale("timeAbsolute")
        }, {
            "value": "absolute_us",
            "text": locale("timeAbsoluteUS")
        }],
        "default": "relative"
    }, {
        "tab": locale("tabDisplay"),
        "group": locale("groupTimeFormatting"),
        "name": "full_after_24h",
        "type": "checkbox",
        "label": locale("absoluteAfter24h")
    }, {
        "tab": locale("tabDisplay"),
        "group": locale("groupUsers"),
        "name": "name_display",
        "type": "radioButtons",
        "label": locale("usernamesFullnames"),
        "options": [{
            "value": "both",
            "text": locale("bothNames")
        }, {
            "value": "inverted",
            "text": locale("invertedNames")
        }, {
            "value": "username",
            "text": locale("usernameOnly")
        }, {
            "value": "fullname",
            "text": locale("fullnameOnly")
        }],
        "default": "both"
    }, {
        "tab": locale("tabDisplay"),
        "group": locale("groupUsers"),
        "name": "typeahead_display_username_only",
        "type": "checkbox",
        "label": locale("typeahead")
    }, {
        "tab": locale("tabDisplay"),
        "group": locale("groupUsers"),
        "name": "circled_avatars",
        "type": "checkbox",
        "label": locale("circleAvatars")
    }, {
        "tab": locale("tabGeneral"),
        "group": locale("groupAppearance"),
        "name": "minimal_mode",
        "type": "checkbox",
        "label": "<span class=new></span>" + locale("minimalMode")
    }, {
        "tab": locale("tabGeneral"),
        "group": locale("groupAppearance"),
        "name": "no_columns_icons",
        "type": "checkbox",
        "label": locale("noColumnsIcons")
    }, {
        "tab": locale("tabGeneral"),
        "group": locale("groupAppearance"),
        "name": "small_icons_compose",
        "type": "checkbox",
        "label": locale("smallIconsCompose")
    }, {
        "tab": locale("tabGeneral"),
        "group": locale("groupAppearance"),
        "name": "grayscale_notification_icons",
        "type": "checkbox",
        "label": locale("grayscaleIcons")
    }, {
        "tab": locale("tabGeneral"),
        "group": locale("groupContent"),
        "name": "url_redirection",
        "type": "checkbox",
        "label": locale("tcoRemoval")
    }, {
        "tab": locale("tabGeneral"),
        "group": locale("groupAppearance"),
        "name": "yt_rm_button",
        "type": "checkbox",
        "label": locale("playButtonYT")
    }, {
        "tab": locale("tabGeneral"),
        "group": locale("groupAppearance"),
        "name": "blurred_modals",
        "type": "checkbox",
        "label": locale("noBgModals")
    }, {
        "tab": locale("tabGeneral"),
        "group": locale("groupContent"),
        "name": "only_one_thumbnails",
        "type": "checkbox",
        "label": locale("oneThumbPerTweet")
    }, {
        "tab": locale("tabGeneral"),
        "group": locale("groupContent"),
        "name": "thumbnails",
        "type": "description",
        "text": locale("thumbnailsfrom")
    }, {
        "tab": locale("tabGeneral"),
        "group": locale("groupContent"),
        "name": "img_preview_500px",
        "type": "checkbox",
        "label": "<span class='tb'></span>500px"
    }, {
        "tab": locale("tabGeneral"),
        "group": locale("groupContent"),
        "name": "img_preview_bandcamp",
        "type": "checkbox",
        "label": "<span class='tb'></span>Bandcamp"
    }, {
        "tab": locale("tabGeneral"),
        "group": locale("groupContent"),
        "name": "img_preview_cloud",
        "type": "checkbox",
        "label": "<span class='tb'></span>CloudApp"
    }, {
        "tab": locale("tabGeneral"),
        "group": locale("groupContent"),
        "name": "img_preview_dailymotion",
        "type": "checkbox",
        "label": "<span class='tb'></span>Dailymotion"
    }, {
        "tab": locale("tabGeneral"),
        "group": locale("groupContent"),
        "name": "img_preview_deviantart",
        "type": "checkbox",
        "label": "<span class='tb'></span>DeviantArt"
    }, {
        "tab": locale("tabGeneral"),
        "group": locale("groupContent"),
        "name": "img_preview_dribbble",
        "type": "checkbox",
        "label": "<span class='tb'></span>Dribbble"
    }, {
        "tab": locale("tabGeneral"),
        "group": locale("groupContent"),
        "name": "img_preview_dropbox",
        "type": "checkbox",
        "label": "<span class='tb'></span>Dropbox"
    }, {
        "tab": locale("tabGeneral"),
        "group": locale("groupContent"),
        "name": "img_preview_droplr",
        "type": "checkbox",
        "label": "<span class='tb'></span>Droplr"
    }, {
        "tab": locale("tabGeneral"),
        "group": locale("groupContent"),
        "name": "img_preview_flickr",
        "type": "checkbox",
        "label": "<span class='tb'></span>Flickr"
    }, {
        "tab": locale("tabGeneral"),
        "group": locale("groupContent"),
        "name": "img_preview_imgur",
        "type": "checkbox",
        "label": "<span class='tb'></span>Imgur"
    }, {
        "tab": locale("tabGeneral"),
        "group": locale("groupContent"),
        "name": "img_preview_imgly",
        "type": "checkbox",
        "label": "<span class='tb'></span>Img.ly"
    }, {
        "tab": locale("tabGeneral"),
        "group": locale("groupContent"),
        "name": "img_preview_instagram",
        "type": "checkbox",
        "label": "<span class='tb'></span>Instagram"
    }, {
        "tab": locale("tabGeneral"),
        "group": locale("groupContent"),
        "name": "img_preview_mobyto",
        "type": "checkbox",
        "label": "<span class='tb'></span>Moby.to"
    }, {
        "tab": locale("tabGeneral"),
        "group": locale("groupContent"),
        "name": "img_preview_soundcloud",
        "type": "checkbox",
        "label": "<span class='tb'></span>SoundCloud"
    }, {
        "tab": locale("tabGeneral"),
        "group": locale("groupContent"),
        "name": "img_preview_tumblr",
        "type": "checkbox",
        "label": "<span class='tb'></span>Tumblr"
    }, {
        "tab": locale("tabGeneral"),
        "group": locale("groupContent"),
        "name": "img_preview_vimeo",
        "type": "checkbox",
        "label": "<span class='tb'></span>Vimeo"
    }, {
        "tab": locale("tabGeneral"),
        "group": locale("groupContent"),
        "name": "img_preview_yfrog",
        "type": "checkbox",
        "label": "<span class='tb'></span>yFrog"
    }]
};