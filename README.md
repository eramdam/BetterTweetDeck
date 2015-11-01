# Better TweetDeck³

This is the 3.0 branch for Better TweetDeck. Like the 2.0 version it's a rewrite-from-scratch.

# Why? A rewrite _again_ ?!

Yep. 2.0 was faster and more efficient than 1.0 but the codebase is messy. And there was too much DOM dependant code.

# Goals for 3.0

- Try to hook the BTD content script to as much TweetDeck's events as possible. Resulting in a (virtually) event-driven BetterTweetDeck. Which is awesome for performances and maintainability.
- Thanks to the first point I can reduce the amount of `DOMNodeInserted` listeners. And that's a relief because they were awful to maintain anyway
- Use ES6/7/2015 as much as we can. Chrome supports a lot of its features but the project will be using [Babel](http://babeljs.io) and [Babelify](https://github.com/babel/babelify) to handle the new `import` clauses.

# Progress of 3.0

- [x] Hook on "new stuff in TD" event
- [x] Hook on timestamp event of TD, delete the original and use my own
- [ ] Create thumbnails with arbitrary content
- [ ] Create tweets' modal with arbitrary content

# Ok that's cool, what about features?

For now, there won't be new features. But I have some of them in mind:

- [ ] Advanced muting engine (imagine using regex like on Tweetbot or mute hashtag based on user's and stuff like that)
- [ ] Maybe a "I don't want to see this tweet" feature, who knows