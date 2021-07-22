# Contributor guidelines

First of all, thanks for taking the time to contribute!

**Tables of contents**

- [Contributor guidelines](#contributor-guidelines)
- [Goal of the project](#goal-of-the-project)
- [Project's principles](#projects-principles)
- [Building the project locally](#building-the-project-locally)
  - [Loading the extension into your browser](#loading-the-extension-into-your-browser)
- [Technical details](#technical-details)
  - [Project structure](#project-structure)
  - [About the config](#about-the-config)
- [Coding guidelines](#coding-guidelines)
  - [General guidelines](#general-guidelines)
  - [TypeScript](#typescript)
    - [Naming conventions](#naming-conventions)
    - [Avoid `default` exports](#avoid-default-exports)
    - [Use `async/await`](#use-asyncawait)
    - [Use enums](#use-enums)
    - [Ok, I'm done. What do I do now?](#ok-im-done-what-do-i-do-now)

# Goal of the project

Better TweetDeck's goal is to improve TweetDeck by:

- adding features that brings it to parity with other Twitter clients
- adding features that Twitter will likely never add

However, it is **not** made to:

- fix TweetDeck's bugs. Most of the technical regressions are almost impossible for a 3rd party extension to fix.
- add anything that tracks, spies, and exposes users to ads.
- add features that work around or violate Twitter's terms of service.

# Project's principles

TweetDeck is a complicated piece of software, and Better TweetDeck isn't simple either. This is why when I add new features to Better TweetDeck, I try to stick to a few principles:

- Keep it simple. This applies to both the code behind a feature and the feature itself.
- Be as defensive as possible. Writing a browser extension is like trying to shoot a moving target, so it's helpful to try to write the code in such a way that it doesn't entirely fall apart if TweetDeck changes something overnight.

# Building the project locally

** First-time installation**

1. Install [git](https://git-scm.com/)
2. Install [node.js](https://nodejs.org/en/) (version >= 15)
3. **[Fork](https://github.com/eramdam/BetterTweetDeck/fork)** this repository
4. Clone the project
5. Run `npm install` in the repository's folder

**Build commands**

Below, `<browser>` can be one of those values:

- `firefox`: for Firefox
- `firefox-beta`: is only used on CI to build a private, nightly version of the extension
- `chrome`: for Edge/Chrome
- `safari`: for Safari

`npm run start:<browser>` will clean `dist/`, build Better TweetDeck in development mode and start a watch task that will rebuild the extension change changes files

`npm run build:<browser>` will clean `dist/` and build Better TweetDeck in development mode and stop

`npm run build:prod:<browser>` will clean `dist/` and build Better TweetDeck in production mode and stop

Check the [section below](#loading-the-extension-into-your-browser) when it comes to loading the extension.

**Lint and test commands**

`npm run fix` will run `eslint --fix` and fix various code style/formatting issues if possible

`npm run lint` will run `eslint` and report various code style/formatting issues

`npm run typecheck` will run TypeScript's type-checking and exit

`npm run typecheck:watch` will run TypeScript's type-checking in watch mode

**Misc commands**

`npm run run:firefox` will open a Firefox instance with the extension loaded and updated when the content of `dist/` changes

`npm run release` will build the extension for all browsers to prepare for a new release

`npm run update-xcode` will change the XCode files to reflect the current version number

`npm run pack:safari` will update the XCode files and build the project for Safari

## Loading the extension into your browser

**Chrome/Edge**

1. Go to `Menu->More tools->Extensions` and tick the `Developer Mode` checkbox.
2. Click `Load unpacked` extension and select the `/dist/` folder.
3. Any time you make changes, you must go back to the `Menu->More tools->Extensions` page and Reload the extension.

**Firefox**

1. Go to `about:debugging` and tick the `Enable add-on debugging` checkbox.
2. Click `Load Temporary Add-on` and select `/dist/manifest.json` (not the /dist folder).
3. Any time you make changes, you must go back to the `about:debugging` page and Reload the extension.

Alternatively, you can use `npm run run:firefox` to open a particular instance of Firefox that reloads when the content of `dist/` changes.

# Technical details

The project uses [TypeScript](https://www.typescriptlang.org/) for most of the code. The UI of the settings page and of (some of) the UI injected into TweetDeck use [React](https://reactjs.org/).

## Project structure

**Top-level files and folders**

- `artifacts/`: release files are generated into this folder
- `config/`: configuration files picked up by Webpack at build time
- `definitions/`: contains custom TypeScript definitions for packages that don't have any
- `dist/`: build output
- `package-lock.json`
- `safari/`: contains the XCode project necessary to build the extension for Safari
- `src/`: Source code
- `tools/`: various scripts and definitions of the manifest files
- `tsconfig.json`: TypeScript configuration file
- `webpack/`: [Webpack](https://webpack.js.org/) related files
- `webpack.config.js`: [Webpack](https://webpack.js.org/) configuration file

**Rundown of `src/`**

- `_locales/`: contains localization files
- `assets/`: images and icon files are usually inline as data-URI by Webpack
- `components/`: contains React/DOM components
- `features/`: contains all the code of the features injected into TweetDeck
- `helpers/`: contains utility code to deal with various aspects of Better TweetDeck. **Code in those folders should be stateless**
- `services/`: the stateful cousin of `helpers/`.
- `types/`: contains useful typings for deal with Better TweetDeck/Twitter stuff

## About the config

The Webpack configuration uses the [Define](https://webpack.js.org/plugins/define-plugin/) plugin to expose secrets and configuration variables. They are available through `BtdConfig` in `src/defineConfig.ts`.

**DO NOT COMMIT YOUR CONFIGURATION FILE. DO NOT COMMIT API KEYS OR SECRET**.

# Coding guidelines

## General guidelines

I won't discuss the formatting style because ESLint and Prettier will take care of that when you commit your changes.

However, I will go over a few "best practices" I try to stick to when writing code for Better TweetDeck:

- Comment your code. Don't write comments on every line, but if you write code that is a bit complex/weird, leave a comment.
- Keep it simple. There's no need to be overly clever; the most straightforward solution might be the best one.
- Do not abbreviate variable and function names. TypeScript has excellent completion, so take advantage of it.
- TypeScript allows us to use modern features of JavaScript, so don't feel shy about using them!

## TypeScript

### Naming conventions

**Avoid abbreviations**

TypeScript gives use good autocompletion, meaning typing the full name of symbols is rarely needed. You can therefore avoid abbreviations that make the code harder to read.

```ts
// Bad
class HttpSvc {}

// Good
class HttpService {}
```

**Types**

In order to tell them apart from Js variables, types names should use PascalCase, avoid any prefix/suffix denoting the kind of the type such as `I` for interfaces.

```ts
// Bad
interface myObject {}
interface ImyObject {}
type fooType = {};
enum actionsEnum {}

// Good
interface MyObject {}
type Foo = {};
enum Actions {}
```

### Avoid `default` exports

To make refactoring and auto importing easier, always use named exports.

```ts
// Bad
import Stuff from './stuff';

// Good
import {Stuff} from './stuff;
```

### Use `async/await`

`async/await` really simplifies writing asynchronous code. It sometimes gets more verbose, but it really makes it easier to reason above async code.

```ts
// Bad
function myRequest() {
  return new Promise((resolve) => resolve(1));
}

myRequest().then((res) => console.log({res}));

// Better
async function myRequest() {
  return 1;
}

const result = await myRequest();
```

### Use enums

Enums are a very nice feature of TypeScript. I tend to use them instead of string literals for constants that are re-used or given by an API.

```ts
// Bad
const action = api.action;

switch (action) {
  case 'foo': {}
  case 'bar': {}
  default: {}
}

// Better
enum Actions {
  FOO = 'foo'
  BAR = 'bar'
}
const action = api.action;

switch (action) {
  case Actions.FOO: {}
  case Actions.BAR: {}
  default: {}
}
```

### Ok, I'm done. What do I do now?

Awesome! I'm sure your feature or bugfix is amazing :tada:

- **Commit your changes** to your feature branch
- **Test your feature/bugfix locally** by building the extension given above and be sure it works the way it should.
- **[Submit a Pull Request](https://github.com/eramdam/BetterTweetDeck/compare)** if your changes are done and working
- **Wait for feedback** on your Pull Request and make changes if necessary
- **Enjoy the heartwarming feeling of your feature being merged**
