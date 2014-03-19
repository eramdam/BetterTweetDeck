// SAMPLE
this.manifest = {
    "name": "BetterTweetDeck",
    "icon": "icon.png",
    "settings": [
        {
            "tab": "General",
            "group": "Info",
            "name": "informations",
            "type": "description",
            "text": "<div class=notification></div><div class=alert>Don't forget to reload any TweetDeck tab after applying your settings <br /> <span>This extension <u>only</u> works with <a href='http://tweetdeck.twitter.com'>http://tweetdeck.twitter.com</a> not with the \"TweetDeck\" Chrome application !</span></div>"
        },
        {
            "tab": "General",
            "group": "Time formatting",
            "name": "timestamp",
            "type": "popupButton",
            "label": "Time should be:",
            "options": {
                "values": [
                    {
                        "value": "relative",
                        "text": "Relative (1m, 2h, 3d...)"
                    },
                    {
                        "value": "absolute",
                        "text": "Absolute (dd/mm/yy hh:mm)"
                    },
                    {
                        "value": "absolute_us",
                        "text": "Absolute 'US Style' (mm/dd/yy hh:mm)"
                    }
                ],
            },
        },
        {
            "tab":"General",
            "group":"Time formatting",
            "name":"full_after_24h",
            "type":"checkbox",
            "label":"Display full-time (dd/mm/yy hh:mm) only after 24h"
        },
        {
            "tab": "General",
            "group": "Users",
            "name": "name_display",
            "type": "popupButton",
            "label": "Display name/username as:",
            "options": {
                "values": [
                    {
                        "value": "both",
                        "text": "Full Name @username"
                    },
                    {
                        "value": "inverted",
                        "text": "@Username Full Name"
                    },
                    {
                        "value": "username",
                        "text": "Username only"
                    },
                    {
                        "value": "fullname",
                        "text": "Fullname only"
                    }
                ],
            },
        },
        {
            "tab": "General",
            "group": "Users",
            "name": "typeahead_display_username_only",
            "type": "checkbox",
            "label": "Only display the username in the <a href='http://f.cl.ly/items/0Q0I1t2k441639363V35/BehaYurCUAATDU8.png'>mention helper</a>"
        },
        {
            "tab": "General",
            "group": "Users",
            "name": "circled_avatars",
            "type": "checkbox",
            "label": "Display rounded avatars (it's fancy!)"
        },
        {
            "tab": "General",
            "group": "Appearance",
            "name": "reduced_padding",
            "type": "checkbox",
            "label": "Columns take less space"
        },
        {
            "tab": "General",
            "group": "Appearance",
            "name": "no_columns_icons",
            "type": "checkbox",
            "label": "No icons in column headers",
        },
        {
            "tab": "General",
            "group": "Appearance",
            "name": "grayscale_notification_icons",
            "type": "checkbox",
            "label": "Icons in Notification column should be in grayscales"
        },
        {
            "tab": "General",
            "group": "Content",
            "name": "url_redirection",
            "type": "checkbox",
            "label": "Remove t.co redirection"
        },
        {
            "tab": "General",
            "group": "Appearance",
            "name": "yt_rm_button",
            "type": "checkbox",
            "label": "Hide play button on YouTube previews"
        },
        {
            "tab": "General",
            "group": "Content",
            "name": "only_one_thumbnails",
            "type": "checkbox",
            "label": "Display only one thumbnail per tweet"
        },
        {
            "tab": "General",
            "group": "Content",
            "name": "thumbnails",
            "type": "description",
            "text": "<span class='thumbnails setting label'>Display thumbnails from</span>"
        },
        {
            "tab": "General",
            "group": "Content",
            "name": "img_preview_500px",
            "type": "checkbox",
            "label": "<span class='tb'></span>500px"
        },
        {
            "tab": "General",
            "group": "Content",
            "name": "img_preview_cloud",
            "type": "checkbox",
            "label": "<span class='tb'></span>CloudApp"
        },
        {
            "tab": "General",
            "group": "Content",
            "name": "img_preview_droplr",
            "type": "checkbox",
            "label": "<span class='tb'></span>Droplr"
        },
        {
            "tab": "General",
            "group": "Content",
            "name": "img_preview_dailymotion",
            "type": "checkbox",
            "label": "<span class='tb'></span>Dailymotion"
        },
        {
            "tab": "General",
            "group": "Content",
            "name": "img_preview_flickr",
            "type": "checkbox",
            "label": "<span class='tb'></span>Flickr"
        },
        {
            "tab": "General",
            "group": "Content",
            "name": "img_preview_imgur",
            "type": "checkbox",
            "label": "<span class='tb'></span>Imgur"
        },
        {
            "tab": "General",
            "group": "Content",
            "name": "img_preview_instagram",
            "type": "checkbox",
            "label": "<span class='tb'></span>Instagram"
        },
        {
            "tab": "General",
            "group": "Content",
            "name": "img_preview_tumblr",
            "type": "checkbox",
            "label": "<span class='tb'></span>Tumblr"
        },
        {
            "tab": "General",
            "group": "Content",
            "name": "img_preview_vimeo",
            "type": "checkbox",
            "label": "<span class='tb'></span>Vimeo"
        }
    ]
};
