# Better TweetDeck³

This is the 3.0 branch for Better TweetDeck. Like the 2.0 version it's a rewrite-from-scratch.

# Why? A rewrite _again_ ?!

Yep. 2.0 was faster and more efficient than 1.0 but the codebase was messy. And there was too much DOM dependant code.

# Goals for 3.0

- Try to hook the BTD content script to as much TweetDeck's events as possible. Resulting in a (virtually) event-driven BetterTweetDeck. Which is awesome for performances and maintainability.
- Thanks to the first point I can reduce the amount of `DOMNodeInserted` listeners. And that's a relief because they were awful to maintain anyway
- Use ES2015 as much as I can. Chrome supports a lot of its features but the project will be using [Babel](http://babeljs.io) and [Babelify](https://github.com/babel/babelify) to handle the new `module` syntax.

# Progress of 3.0

- [ ] Hook on "new stuff in TD" event
- [x] Hook on timestamp event of TD, delete the original and use my own
- [ ] Restore the i18n support
- [ ] Create thumbnails with arbitrary content
- [ ] Create tweets' modal with arbitrary content
- [ ] Being able to change timestamps
- [ ] Being able to change avatar style
- [ ] Being able to change username/name display
    - [ ] In the columns
    - [ ] In the auto-complete dropdown
- [ ] Revamp the minimal mode
- [ ] Being able to change dynamically the minimal-flavored theme depending on the current theme
- [ ] Hide the "play" btn
- [ ] Hide icons in columns + restore a little badge next to headers for "new stuff"
- [ ] Smaller icons in the composer
- [ ] Notifications icons in grayscale
- [ ] Detect RTL and apply RTL style to them
- [ ] Remove the t.co redirection
- [ ] Add the "Share on BTD" contextual item
- [ ] Do an options page
    - [ ] Make it more maintanable than the previous one

# Ok that's cool, what about features?

For now, there won't be new features. But I have some of them in mind:

- [ ] Advanced muting engine (imagine using regex like on Tweetbot or mute hashtag based on user's and stuff like that)
- [ ] Maybe a "I don't want to see this tweet" feature, who knows
- [ ] Replace different APIs by Embed.ly to simplify the code **a lot**
- [ ] *Probably too big for one man* Translate the UI of TweetDeck ?
- [ ] Display a little flag depending on the _supposed_ language of the tweet ?