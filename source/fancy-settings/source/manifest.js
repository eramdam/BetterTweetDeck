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
            "text": "<strong>Don't forget to reload any TweetDeck tab after applying your settings</strong>"
        },
        {
            "tab": "General",
            "group": "Appearance",
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
            "tab": "General",
            "group": "Appearance",
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
            "group": "Appearance",
            "name": "circled_avatars",
            "type": "popupButton",
            "label": "Display rounded avatars (it's fancy!):",
            "options": {
                "values": [
                    {
                        "value": false,
                        "text": "No"
                    },
                    {
                        "value": true,
                        "text": "Yes"
                    }
                ],
            },
        },
        {
            "tab": "General",
            "group": "Appearance",
            "name": "fading_pictures",
            "type": "popupButton",
            "label": "Fading profile pictures when not hovered (less distraction) :",
            "options": {
                "values": [
                    {
                        "value": false,
                        "text": "No"
                    },
                    {
                        "value": true,
                        "text": "Yes"
                    }
                ],
            },
        },
        {
            "tab": "General",
            "group": "Appearance",
            "name": "reduced_padding",
            "type": "popupButton",
            "label": "Columns take less space :",
            "options": {
                "values": [
                    {
                        "value": false,
                        "text": "No"
                    },
                    {
                        "value": true,
                        "text": "Yes"
                    }
                ],
            },
        },
        {
            "tab": "General",
            "group": "Appearance",
            "name": "no_columns_icons",
            "type": "popupButton",
            "label": "Display icons in column headers :",
            "options": {
                "values": [
                    {
                        "value": true,
                        "text": "No"
                    },
                    {
                        "value": false,
                        "text": "Yes"
                    }
                ],
            },
        },
        {
            "tab": "General",
            "group": "Behaviour",
            "name": "url_redirection",
            "type": "popupButton",
            "label": "Remove t.co redirection:",
            "options": {
                "values": [
                    {
                        "value": false,
                        "text": "No"
                    },
                    {
                        "value": true,
                        "text": "Yes"
                    }
                ],
            },
        },
        {
            "tab": "General",
            "group": "Behaviour",
            "name": "img_preview",
            "type": "popupButton",
            "label": "Display non-Twitter preview images (Supports <b>Imgur</b> and <b>Droplr</b>):",
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
