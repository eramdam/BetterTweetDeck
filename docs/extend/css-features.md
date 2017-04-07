# Extend BetterTweetDeck with CSS Features

CSS Features are tweaks to TweetDeck entirely possible through CSS, either improving the user experience or reverting
recently made changes to the interface requested by the community.

**Notice:** Please remember that BetterTweetDeck is not here to completely change up the interface of TweetDeck. If your
ideas include overhauling the entire interface this extension is not suited for this. Consider writing an userstyle or
your own extension!

## Steps

* If you have your idea, play around with it using the Inspector first, to see if it is actually possible
* Add an option for your feature to the `css` key in [src/js/background.js](https://github.com/eramdam/BetterTweetDeck/blob/master/src/js/background.js)
  * _Keep it short, but descriptive. If you can't describe it it 2-3 words it is probably too complex!_
  * Use underscores for spaces!
* Add your feature in a CSS file to [src/css/features](https://github.com/eramdam/BetterTweetDeck/blob/master/src/css/features)
  * Name the CSS file like your feature key, but this time use dashes instead of underscores for the file name!
  * Add the class `.btd__{your feature key}` (as written as in the options key, with underscores) in front of your CSS selectors
* Import the created CSS file into [src/css/index.css](https://github.com/eramdam/BetterTweetDeck/blob/master/src/css/index.css)
* Add another checkbox to make your feature selectable to [src/options/options.html](https://github.com/eramdam/BetterTweetDeck/blob/master/src/options/options.html)
  * Find the appropriate section to add your feature, mostly it's the `General` section.
  * Add your feature option to the end of the list with following markup:
    ```
      <li>
        <input type="checkbox" name="css.{your feature key}" id="{your feature key}">
        <label for="{your feature key}" data-lang="{your feature language key}" data-new-feat >Description of my cool new feature</label>
      </li>
    ```
* Add a locale for your feature description to [src/_locales/en/messages.json](https://github.com/eramdam/BetterTweetDeck/blob/master/src/_locales/en/messages.json)
  * Use following markup:
    ```
      "css_{your feature key}": { "message": "Description of my cool new feature" }
    ```
  * Don't forget to add your language key you added here to the `data-lang` attribute specified above!
* Rebuild the extension, reload TweetDeck, open BetterTweetDecks options and enable your feature!