:tada: 3.0.16 :tada:
===============
- [Fix] Fix a bug where tweet actions would not work on custom modals.
- [Fix] Fix a bug where icons of accounts in Compose panel would be mis-placed.
- [Fix] Fix a bug where usernames would wrongly gets changed in some edge cases.
- [Improvement] Made some improvements to the way BTD stores its settings to handle future Edge/Firefox ports properly.
- [Improvement] Revert back the gradient on the modal's background.

3.0.15
===============
- [Feature] Added a setting to "stop" GIFs in profile pictures in columns
- [Fix] Gfycat embed players were too small, it's now fixed
- [Fix] Twitch clips should now actually work
- [Improvement] Username formatting should be more reliable/more performant
- [Improvement] The "no bg" background of modal now has a black to transparent gradient for improve readability

3.0.14
===============
- [Fix] Slimmer scrollbars are bigger and it's now an option

3.0.13
===============
- [Fix] GIFs should not stop anymore when the option "Stop gif autoplay" is unchecked
- [Fix] Streamable embed players were too small and mis-placed, it's now fixed
- [Improvement] The option "hide links relative to thumbnails" should work more reliably
- [Improvement] Better French translation (Thanks [LeoColomb](https://github.com/LeoColomb))
- [Improvement] Verified badge is better positioned (Thanks [LeoColomb](https://github.com/LeoColomb))
- [Feature] Twitch clips (clips.twitch.tv) are now supported ![](https://static-cdn.jtvnw.net/emoticons/v1/41/1.0)

3.0.12
===============
- [Fix] Verified badges should display correctly when relevant
- [Fix] Bring back the like/RT indicator on tweets because TweetDeck killed it
- [Improvement] Verified badges should display in modals and in the DM columns

3.0.11
===============
- [Fix] Choice of activating a provider or not is correctly taken into account in settings
- [Improvement] Universal preview is re-enabled by default
- [Improvement] The code don't use Embed.ly anymore

3.0.7 => 3.0.10
===============
- [Improvement] Removal of "tabs" permissions
- [Improvement] More reliable way of showing verified badges
- [Fix] Fix flashing of tweets
- [Fix] Links won't be hidden if a column has its media size on "off"
- [Fix] Modal should not have a scrollbar anymore
- [Improvement] The code don't rely on Embed.ly anymore for most services (except Giphy, cloudapp, bandcamp and twitch)

3.0.5
===============
- [Improvement] Option to hide bg of modals

3.0.3
===============
- [Fix] Share item is correctly added or not
- [Improvement] Settings button is back in TD
- [Improvement] Settings to hide scrollbars or not

3.0.1
===============
- [Fix] The play glyph is aligned on the "play icon"
- [Fix] Modal previews open for tweets in notifications
- [Fix] The "bubble" in minimal mode actually depends on the "show context" setting
- [Improvement] Another "save" button has been added in options page

3.0.0 Codename "Half-Life 3"
===============
- [Meta] Completely re-written in ES2015 with modules for a more maintainable code
- [Meta] Faster than 2.x, more reliable and nicer on resources
- [Feature] Modals/thumbnails work in DMs
- [Feature] Stop the autoplay of GIFs
- [Feature] Verified badge in the columns
- [Feature] Updated Minimal theme for dark/white + more reliable support of it
- [Feature] Can change hearts back to stars
- [Feature] Emoji picker now has a search and diversity support
- [Feature] Every thumbnail is powered by [Embed.ly](http://embed.ly/) and added thumbnails providers:
  - Gfycat
  - Giphy
  - Mixcloud
  - Skitch
  - Spotify
  - Streamable
  - TinyGrab
  - Twitch
  - Vidme
  - youtu.be
- [Feature] Custom format for timestamps
- [Feature] Bigger emojis in tweets
