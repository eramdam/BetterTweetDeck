# Better TweetDeck³

This is the 3.0 branch for Better TweetDeck. Like the 2.0 version it's a rewrite-from-scratch.

# What? A rewrite _again_ ?!

Yep. 2.0 was faster and more efficient than 1.0 but the codebase was messy. And there was too much DOM dependant code.

# Goals for 3.0

- Try to hook the BTD content script to as much TweetDeck's events as possible. Resulting in a (virtually) event-driven BetterTweetDeck. Which is awesome for performances and maintainability.
- Thanks to the first point I can reduce the amount of `DOMNodeInserted` listeners. And that's a relief because they were awful to maintain anyway
- Use ES2015 as much as I can. Chrome supports a lot of its features but the project will be using [Babel](http://babeljs.io) and [Babelify](https://github.com/babel/babelify) to handle the new `module` syntax.
- Reduce the JS files' size as much as possible by using ES2015 features

# Progress of 3.0

- [x] Hook on "new stuff in TD" event
- [x] Hook on timestamp event of TD, delete the original and use my own
- [x] Create thumbnails with arbitrary content
- [x] Create tweets' modal with arbitrary content
  - [x] with images
  - [x] with iframes/embeds
- [x] Being able to change timestamps
- [x] Being able to change avatar style
- [x] Being able to change username/name display
    - [x] In the columns
    - [x] In the auto-complete dropdown
- [x] Revamp the minimal mode
    - [x] Being able to change dynamically the minimal-flavored theme depending on the current theme
- [x] Hide the "play" btn
- [x] Hide icons in columns + restore a little badge next to headers for "new stuff"
- [x] Smaller icons in the composer
- [x] Notifications icons in grayscale
- [x] Detect RTL and apply RTL style to them
- [x] Remove the t.co redirection
- [x] Restore the emoji panel
- [x] Add the "Share on BTD" contextual item
- [x] Do an options page
    - [ ] Restore the i18n support
    - [x] Make it more maintainable than the previous one
- [x] Make the extension run on Firefox


# Ok that's cool, what about features?

For now, there won't be new features. But I have some of them in mind:

- **Not for 3.0 ?** [ ] Advanced muting engine (imagine using regex like on Tweetbot or mute hashtag based on user's and stuff like that)
  - [ ] Could use a custom format with import/export of config for easy sharing of mute and stuff
  - [ ] Maybe a "I don't want to see this tweet" feature, who knows
- [x] Replace different APIs by Embed.ly to simplify the code **a lot**
- [x] Be able to pause GIFs automatically
- [x] Display the verified badge in the columns
- [ ] **Maybe** Display a little flag depending on the _supposed_ language of the tweet ?
- [ ] **Not for 3.0** Display a little avatar next to contacts in the "All accounts" messages column so you know easily with which account a thread began with

# Firefox and Edge ports

## Firefox

Firefox should be supported from Firefox 48, which is planned for [August](https://wiki.mozilla.org/RapidRelease/Calendar). At the time these lines are written, [BTD3 runs fine on Firefox!](https://twitter.com/BetterTDeck/status/731742829836304384)

## Edge

Preview version of Edge has [extensions support](https://blogs.windows.com/msedgedev/2016/03/17/preview-extensions/). Most of the [WebExtensions APIs](https://developer.microsoft.com/en-us/microsoft-edge/platform/documentation/extensions/extension-api-roadmap/) seems **not** to be implemented.     
Better TweetDeck needs **storage** and optionally **contextMenus** to be supported. As soon as Edge stable gets released with extensions support this summer, I will work on this port.
