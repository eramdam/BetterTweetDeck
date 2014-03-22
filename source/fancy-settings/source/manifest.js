// SAMPLE
var locale = function(string) { return i18n.get(string)};
var settingsTitle = locale("settingsTitle");
this.manifest = {
    "name": "BetterTweetDeck",
    "icon": "icon.png",
    "settings": [
        {
            "tab": settingsTitle,
            "group": locale("groupInfo"),
            "name": "informations",
            "type": "description",
            "text": locale("warning")
        },
        {
            "tab": settingsTitle,
            "group": locale("groupTimeFormatting"),
            "name": "timestamp",
            "type": "popupButton",
            "label": locale("timeShouldBe"),
            "options": {
                "values": [
                    {
                        "value": "relative",
                        "text": locale("timeRelative")
                    },
                    {
                        "value": "absolute",
                        "text": locale("timeAbsolute")
                    },
                    {
                        "value": "absolute_us",
                        "text": locale("timeAbsoluteUS")
                    }
                ],
            },
        },
        {
            "tab":settingsTitle,
            "group":locale("groupTimeFormatting"),
            "name":"full_after_24h",
            "type":"checkbox",
            "label": locale("absoluteAfter24h")
        },
        {
            "tab": settingsTitle,
            "group": locale("groupUsers"),
            "name": "name_display",
            "type": "popupButton",
            "label": locale("usernamesFullnames"),
            "options": {
                "values": [
                    {
                        "value": "both",
                        "text": locale("bothNames")
                    },
                    {
                        "value": "inverted",
                        "text": locale("invertedNames")
                    },
                    {
                        "value": "username",
                        "text": locale("usernameOnly")
                    },
                    {
                        "value": "fullname",
                        "text": locale("fullnameOnly")
                    }
                ],
            },
        },
        {
            "tab": settingsTitle,
            "group": locale("groupUsers"),
            "name": "typeahead_display_username_only",
            "type": "checkbox",
            "label": locale("typeahead")
        },
        {
            "tab": settingsTitle,
            "group": locale("groupUsers"),
            "name": "circled_avatars",
            "type": "checkbox",
            "label": locale("circleAvatars")
        },
        {
            "tab": settingsTitle,
            "group": locale("groupAppearance"),
            "name": "reduced_padding",
            "type": "checkbox",
            "label": locale("narrowColumns")
        },
        {
            "tab": settingsTitle,
            "group": locale("groupAppearance"),
            "name": "no_columns_icons",
            "type": "checkbox",
            "label": locale("noColumnsIcons")
        },
        {
            "tab": settingsTitle,
            "group": locale("groupAppearance"),
            "name": "grayscale_notification_icons",
            "type": "checkbox",
            "label": locale("grayscaleIcons")
        },
        {
            "tab": settingsTitle,
            "group": locale("groupContent"),
            "name": "url_redirection",
            "type": "checkbox",
            "label": locale("tcoRemoval")
        },
        {
            "tab": settingsTitle,
            "group": locale("groupAppearance"),
            "name": "yt_rm_button",
            "type": "checkbox",
            "label": locale("playButtonYT")
        },
        {
            "tab": settingsTitle,
            "group": locale("groupAppearance"),
            "name": "blurred_modals",
            "type": "checkbox",
            "label": locale("noBgModals")
        },
        {
            "tab": settingsTitle,
            "group": locale("groupContent"),
            "name": "only_one_thumbnails",
            "type": "checkbox",
            "label": locale("oneThumbPerTweet")
        },
        {
            "tab": settingsTitle,
            "group": locale("groupContent"),
            "name": "thumbnails",
            "type": "description",
            "text": locale("thumbnailsfrom")
        },
        {
            "tab": settingsTitle,
            "group": locale("groupContent"),
            "name": "img_preview_500px",
            "type": "checkbox",
            "label": "<span class='tb'></span>500px"
        },
        {
            "tab": settingsTitle,
            "group": locale("groupContent"),
            "name": "img_preview_cloud",
            "type": "checkbox",
            "label": "<span class='tb'></span>CloudApp"
        },
        {
            "tab": settingsTitle,
            "group": locale("groupContent"),
            "name": "img_preview_dailymotion",
            "type": "checkbox",
            "label": "<span class='tb'></span>Dailymotion"
        },
        {
            "tab": settingsTitle,
            "group": locale("groupContent"),
            "name": "img_preview_deviantart",
            "type": "checkbox",
            "label": "<span class='tb'></span>DeviantArt"
        },
        {
            "tab": settingsTitle,
            "group": locale("groupContent"),
            "name": "img_preview_dribbble",
            "type": "checkbox",
            "label": "<span class='tb'></span>Dribbble"
        },
        {
            "tab": settingsTitle,
            "group": locale("groupContent"),
            "name": "img_preview_droplr",
            "type": "checkbox",
            "label": "<span class='tb'></span>Droplr"
        },
        {
            "tab": settingsTitle,
            "group": locale("groupContent"),
            "name": "img_preview_flickr",
            "type": "checkbox",
            "label": "<span class='tb'></span>Flickr"
        },
        {
            "tab": settingsTitle,
            "group": locale("groupContent"),
            "name": "img_preview_imgur",
            "type": "checkbox",
            "label": "<span class='tb'></span>Imgur"
        },
        {
            "tab": settingsTitle,
            "group": locale("groupContent"),
            "name": "img_preview_imgly",
            "type": "checkbox",
            "label": "<span class='tb'></span>Img.ly"
        },
        {
            "tab": settingsTitle,
            "group": locale("groupContent"),
            "name": "img_preview_instagram",
            "type": "checkbox",
            "label": "<span class='tb'></span>Instagram"
        },
        {
            "tab": settingsTitle,
            "group": locale("groupContent"),
            "name": "img_preview_mobyto",
            "type": "checkbox",
            "label": "<span class='tb'></span>Moby.to"
        },
        {
            "tab": settingsTitle,
            "group": locale("groupContent"),
            "name": "img_preview_tumblr",
            "type": "checkbox",
            "label": "<span class='tb'></span>Tumblr"
        },
        {
            "tab": settingsTitle,
            "group": locale("groupContent"),
            "name": "img_preview_vimeo",
            "type": "checkbox",
            "label": "<span class='tb'></span>Vimeo"
        },
        {
            "tab": settingsTitle,
            "group": locale("groupContent"),
            "name": "img_preview_yfrog",
            "type": "checkbox",
            "label": "<span class='tb'></span>yFrog"
        }
    ]
};
