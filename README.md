[![Travis](https://img.shields.io/travis/eramdam/BetterTweetDeck.svg)](https://travis-ci.org/eramdam/BetterTweetDeck/)

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/micblkellenpbfapmcpcfhcoeohhnpob.svg)](https://chrome.google.com/webstore/detail/bettertweetdeck-3/micblkellenpbfapmcpcfhcoeohhnpob) [![Chrome Web Store](https://img.shields.io/chrome-web-store/d/micblkellenpbfapmcpcfhcoeohhnpob.svg)](https://chrome.google.com/webstore/detail/bettertweetdeck-3/micblkellenpbfapmcpcfhcoeohhnpob)

![](https://img.shields.io/twitter/follow/bettertdeck.svg?style=social&label=Follow) [![](https://img.shields.io/badge/patreon-donate-yellow.svg)](https://www.patreon.com/eramdam) [![](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=XK9SQ6ZDE9UF2&lc=US&item_name=Damien%20Erambert&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted)


# Better TweetDeck 3.0

Adds some nice options on [TweetDeck](http://tweetdeck.twitter.com) to provide a better experience on the webapp when used on Chrome, Opera and soon Firefox/Edge!

# Installation

## Chrome

Navigate to https://chrome.google.com/webstore/detail/bettertweetdeck-3/micblkellenpbfapmcpcfhcoeohhnpob and click "Add to Chrome" :tada:

## Opera

Navigate to https://addons.opera.com/en/extensions/details/bettertweetdeck/ and click "Add to Opera" :tada:

# Contributing & helping

Issues and Pull Requests are welcome!

Follow these steps to build/edit the project. You will need:

+ Node v6 / npm v3
+ gulp

Then follow this workflow:

+ `npm install`
+ `npm run start`, this will launch the default `gulp` task with `NODE_ENV` set to `dev`

Drop the `dist/` folder into `chrome://extensions` and start hacking!

## Configuration

You will need to add a `dev.js` file in the `config/` folder populated with an Embed.ly key for the thumbnails to work.
