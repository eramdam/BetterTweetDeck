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
            "text": "<div class=notification></div><div class=alert>Don't forget to reload any TweetDeck tab after applying your settings</div>"
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
            "label": "In the <a href='http://f.cl.ly/items/0Q0I1t2k441639363V35/BehaYurCUAATDU8.png'>mention helper</a> display the username only"
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
            "label": "Display icons in column headers",
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
            "group": "Content",
            "name": "img_preview",
            "type": "popupButton",
            "label": "<span class=new></span> Size of non-Twitter thumbnails displayed",
            "options": {
                "values": [
                    {
                        "value": false,
                        "text": "No"
                    },
                    {
                        "value": "small",
                        "text": "Small"
                    },
                    {
                        "value": "medium",
                        "text": "Medium"
                    },
                    {
                        "value": "large",
                        "text": "Large"
                    }
                ],
            },
        },
        {
            "tab": "General",
            "group": "Content",
            "name": "img_preview_imgur",
            "type": "checkbox",
            "label": "<span class=new></span> Display previews from <b>Imgur</b>"
        },
        {
            "tab": "General",
            "group": "Content",
            "name": "img_preview_droplr",
            "type": "checkbox",
            "label": "<span class=new></span> Display previews from <b>Droplr</b>"
        },
        {
            "tab": "General",
            "group": "Content",
            "name": "img_preview_instagram",
            "type": "checkbox",
            "label": "<span class=new></span> Display previews from <b>Instagram</b>"
        },
        {
            "tab": "General",
            "group": "Content",
            "name": "img_preview_flickr",
            "type": "checkbox",
            "label": "<span class=new></span> Display previews from <b>Flickr</b>"
        },
        {
            "tab": "General",
            "group": "Content",
            "name": "img_preview_500px",
            "type": "checkbox",
            "label": "<span class=new></span> Display previews from <b>500px</b>"
        },
        {
            "tab": "General",
            "group": "Content",
            "name": "img_preview_cloud",
            "type": "checkbox",
            "label": "<span class=new></span> Display previews from <b>CloudApp</b>"
        },
        {
            "tab": "General",
            "group": "Content",
            "name": "yt_rm_button",
            "type": "checkbox",
            "label": "<span class=new></span> Hide play button on YouTube previews"
        },
        {
            "tab": "About",
            "group": "About",
            "name": "about",
            "type": "description",
            "text": "Thanks for using this extension ! This extension is free, but development takes time, so if you found it useful and want to help me you can give a little money or help me developing it !<ul><li><a href='https://github.com/eramdam/BetterTweetDeck'>BetterTweetDeck on Github</a></li><li><a href='http://twitter.com/Eramdam'>Follow me on Twitter !</a></li></ul>"
        },
        {
            "tab": "About",
            "group": "Donation",
            "name": "donate",
            "type": "description",
            "text": "<form action='https://www.paypal.com/cgi-bin/webscr' method='post' target='_top'><input type='hidden' name='cmd' value='_s-xclick'><input type='hidden' name='hosted_button_id' value='RRY2KKZLNBJDG'><input type='image' src='https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif' border='0' name='submit' alt='PayPal - The safer, easier way to pay online!'><img alt='' border='0' src='https://www.paypalobjects.com/fr_FR/i/scr/pixel.gif' width='1' height='1'></form>"
        }
    ]
};
