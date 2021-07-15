# Filters

TweetDeck uses mute Filters to hide unwanted content. BetterTweetDeck adds an advanced mute engine that enables developers/contributors to
add their filters to the client.

## How Filters work in TweetDeck

Every displayable object in TweetDeck runs through every filter that is set active globally or for specific columns.

So, in the function of your custom filter, you need to return `false` (or `t.positive` as an alternative) if something matches your filter. If your filter
returns `true`, it's assumed that this tweet doesn't match the current filter and is shown.

Due to the nature of filters (being applied to all visible objects in TweetDeck), it is recommended to keep filter functions as simple as possible since they
are run several times a second and are, as mentioned above, responsible for even showing posts in your timelines.

As a general rule of thumb: If everything disappears, there's something wrong with your filter.

## Steps

- You can find the advanced mute engine in `src/features/advancedMuteEngine.ts`
- There's an object `BTD.Filters` inside, which contains all custom filters
- Add a new key/value to this object to add more custom filters
  - You can use the following template for a new custom filter:
    ```js
    BTD_filter_key: {
      display: {
        global: true,
        actions: false,
      },
      options: {
        templateString: '{{screenName}}'
      },
      name: 'My Custom Filter',
      descriptor: 'something including',
      placeholder: 'write something here',
      function (t, e) {
        return true
      }
    }
    ```
  - **Important:** The key needs to start with `BTD`; otherwise, this filter won't be evaluated
  - `display` controls where the filter will be visible to the user
    - `global` will display filters in the 'Mute' settings menu list
    - `actions` will display filters in the action dropdown on tweets and profiles
  - `options` contains additional options for filters
    - `templateString` allows to change the filter value used in `display.actions` filters (default: `{{screenName}}`)
  - `name` is the name of the filter displayed in the Mute settings dropdown
  - `descriptor` is shown before the filter value in the active mute list (e.g. "keyword 'what I mute'")
  - `placeholder` is the placeholder shown in the 'Matching' input in the Mute settings menu
  - `function` is the evaluation function of the custom filter; it has two parameters
    - `t` is a reference to the Filter executing this evaluation
    - `e` is a reference to the filter target (usually a `TwitterStatus`)
    - The function needs to return a boolean value
