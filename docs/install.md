# BetterTweetDeck Installation Guide

## Simple

The easiest and most practical way to install BetterTweetDeck is downloading it from App Stores:

* [Chrome Web Store](https://chrome.google.com/webstore/detail/bettertweetdeck-3/micblkellenpbfapmcpcfhcoeohhnpob)
* [Opera Addons](https://addons.opera.com/en/extensions/details/bettertweetdeck/)

## For Developers

If you want to contribute to the extension or just build it yourself, you need to follow these steps:

* Make sure to have the latest version of [Node.js](https://nodejs.org/en/download/) installed
* Clone this repository and open a command line in that directory
* `npm install -g gulp && npm install` to get all required dependencies
* `npm start` to build the project and watch for file changes
* Open the [Chrome Extension page](chrome://extensions)/[Opera Extension page](opera://extensions), enable Developer mode and load the `dist/` folder as unpacked extension