**This document is still a work in progress, feel free to ask questions!**

:thumbsup: :tada: :raised_hands: First, thanks for taking the time to contribute! :thumbsup: :tada: :raised_hands:

The following is a set of guidelines to contribute to Better TweetDeck so the project can stay clean and focused


#### Table Of Contents


# What should I know before?

## Background

I started Better TweetDeck as a little side project for myself then decided to release it to the world and it has now a whooping 20K+ users! On a technical standpoint the project went through a lof of iterations but version 3 marked a huge progress in terms of "good practices" and "cleanliness" of the project's code.

## Focus of the project

Better TweetDeck **is** made to:
- add features to improve someone's experience on TweetDeck
- improve some minor design issues of TweetDeck
- that's basically it!


Better TweetDeck **is not** made to:
- add full-featured themes, the "Minimal mode" is the one and only ""theme"" present in the extension. That is not definitive and could maybe chance but is unlikely
- fix TweetDeck's bugs. TweetDeck's team has to do some work too, this project is not meant to fix their technical regressions
- track, spy, put ads to users or whatever against users' privacy

## Project structure

##### Files and folders

- `config/`: configuration files with API keys and debug flags
- `dist/`: build output
- `meta/`: contains the description of the extension for the stores and other repo-related files
- `src/`: source code
- `tools/`: various scripts and useful files for the build process
- `.babelrc`: [Babel](https://babeljs.io/) configuration file
- `.eslint*`: [ESLint](http://eslint.org/) configuration files
- `CHANGELOG.md`: self-explanatory
- `CONTRIBUTING.md`: YOU ARE HERE !
- `gulpfile.babel.js`: [Gulp](http://gulpjs.com/) build script
- `LICENSE`: license file
- `package.json`: package info, dependencies
- `README.md`: self-explanatory

##### Rundown of `src/`

- `_locales`: localizations files
- `css/**/*.css`: styles files
- `emojis/`: emojis-related files (list of emojis, sprite sheet and icon)
- `icons/`: icons of the extension
- `js/`: all BTD code
- `js/inject.js`: gets injected on TweetDeck's page, and allows communication between content script (`content.js`) and TweetDeck
- `js/background.js`: background script
- `js/content.js`: content script
- `js/util/`: BTD utilities
- `options/`: settings code
- `manifest.json`: project manifest


# How Can I Contribute?

## Reporting Bugs

This section guides you through the process of reporting bugs :bug:.

#### Before Submitting A Bug Report

- **Check if the bug occurs without Better TweetDeck being enabled**, TweetDeck as a software is not exempt of weird things and bugs. If it happens without BTD then it's [not the focus](#focus-of-the-project)
- **Check if the bug occurs if ONLY Better TweetDeck is enabled**, sometimes other extensions modify the content of your pages, or you could also have [ModernDeck](https://github.com/dangeredwolf/ModernDeck) or [Tweeten](tweeten.xyz) installed. Since BTD's footprint is very minimal, it's more of their responsibility to fix that. **Unless BTD explicitely breaks something on those extensions**
- **Tweets not arriving, mentions being delayed or DMs being buggy are never Better TweetDeck's fault**, TweetDeck often endure slowdowns and outage even though they're terrible at communicating about it. BTD can't do anything about this, sorry :pensive:
- **Search the [existing issues](https://github.com/issues?page=2&q=is%3Aissue+repo%3Aeramdam%2Fbettertweetdeck&utf8=%E2%9C%93)**, maybe it has already been reported and you can comment to help the issue being fixed faster!

#### How Do I Submit A (Good) Bug Report?

Explain the problem and include details to help the contributors (usually me) fix the issue:

- **Usse a clear and descriptive title** for the issue so the problem is clear
- **Describe exact steps** to reproduce the issue. When listing steps, **don't just say what you did, but also how you did it**. These infos are more important than you might think.
- **Provide specific examples**, if a tweet is not correctly displayed or similar, add a link to it. If a thumbnail doesn't show even though it should not, link the media URL. If you copy/paste a console output, use the [<details> element](https://gist.github.com/ericclemmons/b146fe5da72ca1f706b2ef72a20ac39d) for a cleaner issue body

Provide some context:

- **Did the issue start happening recently** or was it always an issue?
- **Are you up-to-date?** What version of the extension have you currently installed?
- **What are your settings?** You can easily copy/paste [**Debug infos**](meta/debug-infos.png) in your issue
