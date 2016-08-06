# Better TweetDeck 3.0

Adds some nice options on [TweetDeck](http://tweetdeck.twitter.com) to provide a better experience on the webapp when used on Chrome, Opera and soon Firefox/Edge!

# Installation

## Chrome

Navigate to https://chrome.google.com/webstore/detail/bettertweetdeck-3/micblkellenpbfapmcpcfhcoeohhnpob and click "Add to Chrome" :tada:

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
