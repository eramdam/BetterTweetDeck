**This document is still a work in progress, feel free to ask questions!**

:thumbsup: :tada: :raised_hands: First, thanks for taking the time to contribute! :thumbsup: :tada: :raised_hands:

The following is a set of guidelines to contribute to Better TweetDeck so the project can stay clean and focused

**Table of Contents**

* [What should I know before?](#what-should-i-know-before)
  * [Background](#background)
  * [Focus of the project](#focus-of-the-project)
  * [Project structure](#project-structure) - [Files and folders](#files-and-folders) - [Rundown of `src/`](#rundown-of-src)
* [How Can I Contribute?](#how-can-i-contribute)
  * [Contributing by actually coding](#contributing-by-actually-coding)
    * [Setup](#setup)
    * [Getting started](#getting-started)
      * [The npm scripts](#the-npm-scripts)
      * [Actually building the project](#actually-building-the-project)
    * [About the config](#about-the-config)
    * [Ok I'm done, what do I do now?](#ok-im-done-what-do-i-do-now)
  * [Reporting Bugs](#reporting-bugs)
    * [Before Submitting A Bug Report](#before-submitting-a-bug-report)
    * [How Do I Submit A (Good) Bug Report?](#how-do-i-submit-a-good-bug-report)

# What should I know before?

## Background

I started Better TweetDeck as a little side project for myself then decided to release it to the world and it has now a whooping 20K+ users! On a technical standpoint the project went through a lof of iterations but version 3 marked a huge progress in terms of "good practices" and "cleanliness" of the project's code.

## Focus of the project

Better TweetDeck **is** made to:

* add features to improve someone's experience on TweetDeck
* improve some minor design issues of TweetDeck
* that's basically it!

Better TweetDeck **is not** made to:

* add full-featured themes, the "Minimal mode" is the one and only ""theme"" present in the extension. That is not definitive and could maybe chance but is unlikely
* fix TweetDeck's bugs. TweetDeck's team has to do some work too, this project is not meant to fix their technical regressions
* track, spy, put ads to users or whatever against users' privacy

## Project structure

##### Files and folders

* `config/`: configuration files with API keys and debug flags
* `dist/`: build output (useful for dev)
* `artifacts/`: location of zip files/.crx/.nex files used for release
* `meta/`: contains the description of the extension for the stores and other repo-related files
* `src/`: source code
* `tools/`: various scripts and useful files for the build process
* `.babelrc`: [Babel](https://babeljs.io/) configuration file
* `.eslint*`: [ESLint](http://eslint.org/) configuration files
* `CHANGELOG.md`: self-explanatory
* `CONTRIBUTING.md`: YOU ARE HERE !
* `webpack.config.babel.js`: [Webpack](https://webpack.js.org/) configuration
* `LICENSE`: license file
* `package.json`: package info, dependencies
* `README.md`: self-explanatory

##### Rundown of `src/`

* `_locales`: localizations files
* `css/**/*.css`: styles files
* `emojis/`: emojis-related files (list of emojis, sprite sheet and icon)
* `icons/`: icons of the extension
* `js/`: all BTD code
* `js/inject.js`: gets injected on TweetDeck's page, and allows communication between content script (`content.js`) and TweetDeck
* `js/background.js`: background script
* `js/content.js`: content script
* `js/util/`: BTD utilities
* `options/`: settings code
* `manifest.json`: project manifest

# How Can I Contribute?

## Contributing by actually coding

### Setup

You will need [NodeJS](https://nodejs.org/en/) (**The more recent the better**). Fire up your favorite Terminal emulator and do the followings:

* **[Fork](https://github.com/eramdam/BetterTweetDeck/fork)** this repository
* Clone the project
* Run `npm install`

### Getting started

#### The npm scripts

The [package.json](https://github.com/eramdam/BetterTweetDeck/blob/master/package.json) file contains various scripts.

Some scripts have `<browser>` in their name or arguments. As of now, two browsers (or rather three actually) are supported:

* Google Chrome / Opera, by using the **`chrome`** target
* Firefox by using the **`firefox`** target

Here is a run-down of all the scripts:

* `start -- <browser>`: builds up the project once, then watches for modifications while using the **`dev`** config and the defined target (see above)
* `build -- <browser>` builds the extension in **`dev`** mode against the defined target
* `build:prod -- <browser>`: builds the extension in **`prod`** mode against the defined target
* `pack:<browser>` packages the extension for the given target: - `chrome` will make a `.crx` and a `.nex` file with a private key - `firefox` will use `web-ext` to make a zip file that has to be submitted to Mozilla Add-ons
* `release` builds and packages the extension for **all** the targets
* `test` Runs the link task from the Gulpfile and tries to run `release`. This is run on [Travis](https://travis-ci.org/eramdam/BetterTweetDeck) at every push and on every pull requests. If a given pull request doesn't pass this task, it won't be accepted.
* `fix` Will run [prettier-eslint](https://github.com/prettier/prettier-eslint) and [prettier-stylelint](https://github.com/hugomrdias/prettier-stylelint) over the whole repository. **You should not need to run this as the precommit hook will do that for you**
* `precommit` Runs [lint-staged](https://github.com/okonet/lint-staged) over the files to be committed. The `lint-staged` configuration currentlys runs `prettyer-stylelint` on CSS files and `prettier-eslint + eslint` over JS files.

#### Actually building the project

Now that you know what's available in your hands, let's get started. On a typical workflow you would

* Run `npm run start` to build/watch the project
* Open the `chrome://extensions` page
* Drag and drop the `dist/` file in there, you installed the local version of Better TweetDeck!
* Now [hack](http://i.giphy.com/l0HlvFUHvDB16UOwU.gif)!

### About the config

This project is using [config](https://npmjs.org/package/config) and [config-browserify](https://npmjs.org/package/config-browserify) to handle configuration.
You will have to fill a `dev.js` using the [default.js](https://github.com/eramdam/BetterTweetDeck/blob/master/config/default.js) file as an example.

**DO NOT COMMIT YOUR CONFIGURATION FILE. DO NOT COMMIT API KEYS AND/OR SECRET**.

### Ok I'm done, what do I do now?

Awesome! I'm sure your feature and/or bugfix is amazing :tada:

* **Commit your changes** to your feature branch
* **Test your feature/bugfix locally** by building the extension given above and be sure it works the way it is intended to
* **[Submit a Pull Request](https://github.com/eramdam/BetterTweetDeck/compare)** if your changes are done and working
* **Wait for feedback** on your Pull Request and make changes if necessary
* **Enjoy the heartwarming feeling of your feature being merged**

## Reporting Bugs

This section guides you through the process of reporting bugs :bug:.

#### Before Submitting A Bug Report

* **Check if the bug occurs without Better TweetDeck being enabled**, TweetDeck as a software is not exempt of weird things and bugs. If it happens without BTD then it's [not the focus](#focus-of-the-project)
* **Check if the bug occurs if ONLY Better TweetDeck is enabled**, sometimes other extensions modify the content of your pages, or you could also have [ModernDeck](https://github.com/dangeredwolf/ModernDeck) or [Tweeten](tweeten.xyz) installed. Since BTD's footprint is very minimal, it's more of their responsibility to fix that. **Unless BTD explicitely breaks something on those extensions**
* **Tweets not arriving, mentions being delayed or DMs being buggy are never Better TweetDeck's fault**, TweetDeck often endure slowdowns and outage even though they're terrible at communicating about it. BTD can't do anything about this, sorry :pensive:
* **Search the [existing issues](https://github.com/issues?page=2&q=is%3Aissue+repo%3Aeramdam%2Fbettertweetdeck&utf8=%E2%9C%93)**, maybe it has already been reported and you can comment to help the issue being fixed faster!

#### How Do I Submit A (Good) Bug Report?

Explain the problem and include details to help the contributors (usually me) fix the issue:

* **Use a clear and descriptive title** for the issue so the problem is clear
* **Describe exact steps** to reproduce the issue. When listing steps, **don't just say what you did, but also how you did it**. These infos are more important than you might think.
* **Provide specific examples**, if a tweet is not correctly displayed or similar, add a link to it. If a thumbnail doesn't show even though it should not, link the media URL. If you copy/paste a console output, use the [<details> element](https://gist.github.com/ericclemmons/b146fe5da72ca1f706b2ef72a20ac39d) for a cleaner issue body

Provide some context:

* **Did the issue start happening recently** or was it always an issue?
* **Are you up-to-date?** What version of the extension have you currently installed?
* **What are your settings?** You can easily copy/paste [**Debug infos**](meta/debug-infos.png) in your issue
