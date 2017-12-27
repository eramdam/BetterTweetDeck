# Filters

Mute Filters are used by TweetDeck to hide unwanted content. BetterTweetDeck adds an advanced mute engine which enables developers/contributors to
add their own filters to the client.

## How Filters work in TweetDeck

Every displayable object in TweetDeck runs through every filter that is set active globally or for specific columns. In order that a tweet/interaction
is shown, it needs to `pass` filters. If a tweet passes, it's shown. Simple as that.

So, in the function of your custom filter, you need to return `false` (or `t.positive` as an alternative) if something matches your filter. If your filter
returns `true` it's assumed that this tweet doesn't match the current filter and is shown.

## Steps

* You can find the advanced mute engine in `src/js/util/ame.js`
* There's an object `BTD.Filters` inside, which contains all custom filters
* Add a new key/value to this object to add more custom filters
  * You can use following template for a new custom filter:  
    ```js
    'BTD_filter_key': {
      dropdown: true,
      name: 'My Custom Filter',
      descriptor: 'something including',
      function: function (t, e) {
        return true
      }
    }
    ```
  * **Important:** The key needs to start with `BTD` otherwise this filter won't be evaluated
  * If `dropdown` is set to `true`, users can set this filter in the Mute settings menu
  * `name` is the name of the filter displayed in the Mute settings dropdown
  * `descriptor` is shown before the filter value in the active mute list (e.g. "keyword 'what I mute'")
  * `function` is the evaluation function of the custom filter, it has two parameters
    * `t` is a reference of the Filter executing this evaluation
    * `e` is a reference of the filter target (usually a `TwitterStatus`)
    * The function needs to return a boolean value
