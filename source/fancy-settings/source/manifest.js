// SAMPLE
this.manifest = {
    "name": "My Extension",
    "icon": "icon.png",
    "settings": [
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
            "label": "Display non-Twitter preview images (Imgur only at the moment):",
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
        }
    ]
};
