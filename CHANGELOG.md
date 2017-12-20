:tada: 3.5.1 :tada:
===============
- [Bugfix] Some categories buttons were not working in the emoji picker. This should be fixed.

3.5
===============
- [Feature] You can now add GIFs directly from [Giphy](https://giphy.com/) and [Tenor](https://tenor.com) from the composer. Click the `GIF` button in there and 💥
- [Feature] You can now add emojis in the composer even more easily using `:shortcodes:` like on Discord/Slack/GitHub.
- [Feature] The emoji picker now displays a small preview of the emoji currently hovered, showing its `:shortcode:`
- [Improvement] The emoji picker should have slightly better performances
- [Improvement] The emoji picker now has a larger scrollbar and displays more emoji in the same space
- [Bugfix] Instagram embeds should work again
- [Bugfix] GIFs were not opening in fullscreen properly when they were in quoted tweets. That should work now.
- [Bugfix] When truncating the text for sharing, BTD now takes account of the new character limit

3.4.10
===============
- [Bugfix] The "icons in compose panel are smaller" was not properly fixed after 3.4.9. Should be good now.
- That's all (again)

3.4.9
===============
- [Bugfix] All of the CSS tweaks should work properly (minimal theme, modal background, verified icon, stars, etc..)
- That's all folks ¯\(ツ)/¯


3.4.8
===============
<ul>
  <li data-info-setting="interface/character_count">[Feature] You can display the character count as a number again instead of the circle-loading-thing (thanks <a href="https://github.com/pixeldesu">@pixeldesu</a> <a href="https://github.com/eramdam/BetterTweetDeck/pull/263">#263</a>)</li>
  <li>[Improvement] [Bugfix] Due to performance reasons, Better TweetDeck will NOT change timestamps, load thumbnails and stickers inside DMs anymore as it was slowing down the DM conversations too much.</li>
  <li>[Bugfix] Fixes to the French translations (thanks <a href="https://github.com/viki53">@viki53</a> <a href="https://github.com/eramdam/BetterTweetDeck/pull/252">#252</a>)</li>
  <li>[Improvement] The Japanese translation has been updated (thanks <a href="https://github.com/shuuji3">@shuuji3</a> <a href="https://github.com/eramdam/BetterTweetDeck/pull/259">#259</a>)</li>
</ul>



3.4.7
===============
<ul>
  <li data-info-setting="content/edit_item">[Feature] You can enable an "Edit" item in tweets' menu (see the settings for specifics) (thanks <a href="https://github.com/EntranceJew">@EntranceJew</a> <a href="https://github.com/eramdam/BetterTweetDeck/pull/230">#230</a>)</li>
  <li data-info-setting="interface/pause_scroll_on_hover">[Feature] You can pause the scrolling of columns when hovering them (thanks <a href="https://github.com/EntranceJew">@EntranceJew</a> <a href="https://github.com/eramdam/BetterTweetDeck/pull/212">#212</a>)</li>
  <li data-info-setting="interface/collapse_columns_pause">[Feature] You can configure the feed behaviour when collapsing columns (thanks <a href="https://github.com/EntranceJew">@EntranceJew</a> <a href="https://github.com/eramdam/BetterTweetDeck/pull/239">#239</a>)</li>
  <li data-info-setting="interface/make_search_columns_first">[Feature] You can put the search columns **before** the first column (thanks <a href="https://github.com/chylex">@chylex</a> <a href="https://github.com/eramdam/BetterTweetDeck/pull/219">#219</a>)</li>
  <li>[Meta] The Japanese translation has been updated (thanks <a href="https://github.com/shuuji3">@shuuji3</a> <a href="https://github.com/eramdam/BetterTweetDeck/pull/236">#236</a>)</li>
  <li>[Bugfix] Minor bugfixes</li>
</ul>

3.4.6
===============
<ul>
  <li data-info-setting="content/mute_source">[Feature] You can add a `Mute <source>` item in tweets menu. Useful to mute tweets from specific apps!</li>
  <li data-info-setting="interface/clear_column_action">[Feature] You can add a clear button ( :droplet: )  in columns' header (thanks <a href="https://github.com/EntranceJew">@EntranceJew</a> <a href="https://github.com/eramdam/BetterTweetDeck/pull/224">#224</a>)</li>
  <li data-info-setting="interface/collapse_columns">[Feature] You can add a "collapse" button ( :heavy_minus_sign: )  in columns' header (thanks <a href="https://github.com/EntranceJew">@EntranceJew</a> <a href="https://github.com/eramdam/BetterTweetDeck/pull/208">#208</a>)</li>
  <li data-info-setting="content/download_filename_format">[Feature] You can specify the format of the filename when downloading a GIF/image. (thanks <a href="https://github.com/EntranceJew">@EntranceJew</a> <a href="https://github.com/eramdam/BetterTweetDeck/pull/204">#204</a>)</li>
  <li data-info-setting="content/ctrl_changes_interactions">[Feature] You can make it so holding <kbd>Ctrl</kbd> (or <kbd>Cmd</kbd> on Mac) while interacting with a tweet (liking, retweeting, download/hotliking its media) makes you follow the author of said tweet. (thanks <a href="https://github.com/EntranceJew">@EntranceJew</a> <a href="https://github.com/eramdam/BetterTweetDeck/pull/206">#206</a>)</li>
  <li>[Improvement] Some internal changes have been made so Better TweetDeck is (hopefully) more reliable and fast. Are concerned: timestamps, removal of the t.co redirection among others.</li>
  <li>[Improvement] I've tweaked the way the old replies are displayed in tweets, this should be more on-par with the old behavior.</li>
  <li>[Improvement] GIFs downloaded off a retweet should have the proper username in their filename (thanks <a href="https://github.com/EntranceJew">@EntranceJew</a> <a href="https://github.com/eramdam/BetterTweetDeck/pull/203">#203</a>)</li>
  <li>[Bugfix] A few visual bugs have been fixed.</li>
</ul>

3.4.3
===============
- [Meta] **PLEASE READ IF YOU USE BTD ON FIREFOX**: Due to Mozilla's policy about 3rd party code in add-ons I had to remove the Instagram-related code from the Firefox build. It's annoying, but don't blame me, I'm just following the rules. I'll be working on an alternative but it's not as easy as it sounds.
- [Bugfix] The custom column width setting should work like it did before.
- [Bugfix] Some thumbnails were not showing on Firefox

3.4.1/3.4.2
===============
<ul>
  <li>[Feature] [Bugfix] Rejoice, old replies are back! Due to technical limitations, this only affects the display in columns though.</li>
  <li data-info-setting="content/hotlink_item">[Feature] You can add a shortcut to copy the links of all media in a tweet (thanks to [@EntranceJew](https://github.com/EntranceJew) ([#190](https://github.com/eramdam/BetterTweetDeck/pull/190)))</li>
  <li data-info-setting="content/download_item">[Feature] You can add a shortcut to download all the media in a tweet (thanks to [@EntranceJew](https://github.com/EntranceJew) ([#190](https://github.com/eramdam/BetterTweetDeck/pull/190)))</li>
  <li>[Bugfix] The dropdown menus in dark theme should be legible again</li>
  <li>[Bugfix] Gfycat thumbnails now use the official oEmbed endpoint. So they should work correctly now.</li>
  <li>[Improvement] Some changes have been made under the hood to improve performances and security. Kudos to the Mozilla review team for advices!</li>
  <li>[Bugfix] Removed strict check on the custom column width value</li>
</ul>

3.4
===============
<ul>
  <li data-info-setting="content/update_title_on_notifications">[Feature] You can update the title of TweetDeck's tab when there are unread tweets/DMs</li>
  <li data-info-setting="content/mute_hashtags">[Feature] You can mute #hashtags right from the tweet menu (toggable in the settings) (thanks to [@pixeldesu](https://github.com/pixeldesu)) ([#180](https://github.com/eramdam/BetterTweetDeck/pull/180))</li>
  <li data-info-setting="content/regex_filter">[Feature] You can use [JavaScript regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) as mute filters (thanks to [@pixeldesu](https://github.com/pixeldesu) ([#179](https://github.com/eramdam/BetterTweetDeck/pull/179))</li>
  <li data-info-setting="interface/system_fonts">[Feature] You can now choose to use the default font of your OS inside TweetDeck's UI! (thanks to [@pixeldesu](https://github.com/pixeldesu)) ([#176](https://github.com/eramdam/BetterTweetDeck/pull/176))</li>
  <li data-info-setting="tweetsDisplay/bigger_emojis">[Bugfix] With the related settings, emojis were made bigger everywhere in TweetDeck and not just in tweets. This is fixed.</li>
  <li>[Improvement] [Bugfix] Usernames and verified badges should not disappear randomly anymore. BTD should be WAY ligther/faster thanks to that :racehorse: [more technical details](https://github.com/eramdam/BetterTweetDeck/pull/178)</li>
  <li>[Improvement] [Bugfix] When "Show Verified badges above avatars" settings was enabled, verified badges were hidden inside quoted tweets and tweets that were the target of a like/retweet. They should be displayed correctly now.</li>
  <li data-info-setting="content/favstar_item">[Improvement] You can disable the "Show in Favstar" item in tweets' menu in the Content section</li>
  <li>[Improvement] The settings button is better integrated inside of TweetDeck's UI (thanks to [@LeoColomb](https://github.com/LeoColomb)) ([#177](https://github.com/eramdam/BetterTweetDeck/pull/177))</li>
</ul>

3.3.10
===============
- [Meta] TweetDeck now has its [own poll indicator](https://twitter.com/TweetDeck/status/877536207034568704) so I can remove mine :grin:
- [Feature] The action menu on a tweet now has a "Show on Favstar" item
- [Improvement] The way we apply some hacks should be less error-prone now (thanks to [@pixeldesu](https://github.com/pixeldesu)) ([#173](https://github.com/eramdam/BetterTweetDeck/pull/173))


3.3.9
===============
- [Meta] A banner is displayed when BTD has been updated for better visibility
- [Bugfix] The stars icons are correctly changed with the new TweetDeck design
- [Bugfix] The verified icons are correctly displayed with the new TweetDeck design (thanks to [@LeoColomb](https://github.com/LeoColomb)) ([#165](https://github.com/eramdam/BetterTweetDeck/pull/165))
- [Bugfix] [Improvement] Some icons now use the official TweetDeck iconfont (thanks to [@LeoColomb](https://github.com/LeoColomb)) ([#167](https://github.com/eramdam/BetterTweetDeck/pull/167))

3.3.8
===============
- [Bugfix] The settings page was broken on Firefox because of a mistake on my side. It's fixed
- [Meta] Changed mentions of "Chrome" in the locales to "browser"


3.3.7
===============
- [Meta] [Improvement] The "don't autoplay GIFs" feature has been removed now that [TweetDeck has that feature now](https://twitter.com/TweetDeck/status/861997926587019264)
- [Meta] [Feature] The sharing feature now requires your explicit permission before working. See the "Share" section on the left to learn more.
- [Bugfix] There was some focusing issues on Opera/Chrome. This should be fixed now

3.3.6
===============
- [Bugfix] The previous fix for the Google search link issue (see 3.3.5) was not reliable enough. That should be better now.
- [Bugfix] There was a bug with small thumbnails showing a 2nd play icon. This should be fixed.
- [Feature] The emoji picker has been updated (Unicode 8/9)
- [Feature] [Stickers](https://blog.twitter.com/official/en_us/a/2016/introducing-stickers-on-twitter.html) sent in Direct Messages from Twitter apps are displayed now.

3.3.5
===============
- [Meta] **Removed the old search setting**. TweetDeck killed the hack, sorry, RIP :sob:
- [Bugfix] Fix the bug that opened a Google search view when clicking on videos in the timeline (Related to a new TweetDeck feature)
- [Bugfix] Tweet field will be re-focused when you alt-tab after having it focused already (thanks to [@knu](https://github.com/knu)) ([#152](https://github.com/eramdam/BetterTweetDeck/pull/152))
- [Bugfix] Videos/iframe should (hopefully) be correctly resized in full screen previews

3.3.4 
===============
- [Feature] Tweets with a poll will now have a "poll" indicator below them in the columns
- [Bugfix] Spotify was not working anymore. This should be fixed.
- [Bugfix] There was some weird issues with the Instagram embed script. It's now bundled w/ the extension to improve reliability.

3.3.3
===============
- [Bugfix] The "download as GIF" link under GIF fullscreen previews is back. Sorry about that.

3.3.2
=============== 
- [Feature] You can revert to the old search! (thanks to [@pixeldesu](https://github.com/pixeldesu)) ([#144](https://github.com/eramdam/BetterTweetDeck/pull/144))
- [Improvement] Instagram fullscreen previews should work properly now
- [Bugfix] Video/iFrame-based modals should resize properly now
- [Bugfix] Re-position the Settings button
- [Bugfix] The RT/likes indicator should now re-appear
- [Bugfix] Some timestamps were not replaced/updated. This should be fixed
- [Bugfix] The verified icon should be correctly displayed again now
- [Bugfix] Some usernames were not handled, specifically in Activity columns. This should be alright now.

3.3.1
=============== 
- [Feature] You can revert this nasty reply change thing (you know what I mean)
- [Feature] You can now hide the RT/Like indicator on top of tweets
- [Bugfix] BTD was trying to find thumbnails on Twitch chat links, I made the regex stricter so this should not happen anymore
- [Bugfix] Instagram multi-video/multi-pictures posts were not correctly handled, it's now working fine
- [Bugfix] Other minor bugfixes

3.3
=============== 
- [Feature] Rejoice, the day finally came, GIFs can be viewed in fullscreen! :boom:
- [Feature] Party hard, you can download GIFs from the fullscreen preview in one-click! :tada:
- [Feature] You can choose the source of the thumbnails as a small badge on top of them (see the "Content" section)
- [Feature] Added support for WorldCosplay (thanks to [@shuuji3](https://github.com/shuuji3)) ([#127](https://github.com/eramdam/BetterTweetDeck/pull/127))
- [Feature] Added support for Google+ photo albums (thanks to [@shuuji3](https://github.com/shuuji3)) ([#126](https://github.com/eramdam/BetterTweetDeck/pull/126))
- [Feature] Added support for Photozou photo albums (thanks to [@shuuji3](https://github.com/shuuji3)) ([#125](https://github.com/eramdam/BetterTweetDeck/pull/125))
- [Feature] Added support for Gyazo photo albums (thanks to [@shuuji3](https://github.com/shuuji3)) ([#124](https://github.com/eramdam/BetterTweetDeck/pull/124))
- [Improvement] You can now paste images in replies and DMs 
- [Improvement] Fullscreen previews are larger on smaller screens (thanks to [@d4rky-pl](https://github.com/d4rky-pl)) ([#128](https://github.com/eramdam/BetterTweetDeck/pull/128))
- [Improvement] When inverted the usernames now correctly display the emojis with Twitter's assets
- [Improvement] Made some changes under the hood so the core of Better TweetDeck is more reliable and a bit faster
- [Bugfix] Images in modals should correctly auto-resize now
- [Bugfix] Giphy thumbnails should work again (they changed their API recently)
- [Bugfix] Better TweetDeck was trying to fetch Bandcamp thumbnails for URLs like `https://bandcamp.com/<username>`, it should not happen anymore
- [Meta] Removed the code that adjust the text direction automatically as TweetDeck handles that on their own now
- [Meta] Removed the support of Pixiv as their API changed, breaking the current one

3.2.2
=============== 
- [Feature] Added support for TINAMI (thanks to [@shuuji3](https://github.com/shuuji3)) ([#117](https://github.com/eramdam/BetterTweetDeck/pull/117))
- [Feature] Added support for Nicoseiga (thanks to [@shuuji3](https://github.com/shuuji3)) ([#120](https://github.com/eramdam/BetterTweetDeck/pull/120))
- [Improvement] Renamed "show verified badges" to "show verified badges on top of avatar" to fit TweetDeck's update on Feb 7th 2017


3.2.1
=============== 
- [Meta] Added some donating alternatives #Resist 
- [Bugfix] Fixed the settings dump section of the options page (thanks to [@pixeldesu](https://github.com/pixeldesu)) ([#115](https://github.com/eramdam/BetterTweetDeck/pull/115))
- [Bugfix] Fixed the "red stars on hover" bug (☭)


3.2
=============== 
- [Meta] The changelog page now has some sweet looking pills :pill:
- [Feature] Added support for Pixiv and Twipple! (thanks to [@shuuji3](https://github.com/shuuji3)) ([#113](https://github.com/eramdam/BetterTweetDeck/pull/113))
- [Bugfix] Re-unify square/rounded avatars everywhere in TweetDeck's UI following last TweetDeck update
- [Bugfix] Patched some code to avoid various JS crashes :bug: 

3.1
===============
- [Feature] Better TweetDeck now speaks Japanese! :jp: (thanks to [@shuuji3](https://github.com/shuuji3)) ([#111](https://github.com/eramdam/BetterTweetDeck/pull/111))
- [Feature] You can now paste images inside the tweet composer!           
  - :rotating_light: **Due to a browser limitation, it will not work with GIFs** :rotating_light:
- [Bugfix] Verified badges in mentions should display correctly (as of 29/12/2016)
- [Bugfix] Various little crashes (that were not disrupting the UI but still annoying me)

3.0.23
===============
- [Bugfix] Fix a glitch with verified badges on "XXX added you to a list" notifications

3.0.22
===============
- [Bugfix] Fix some UI shenanigans because of last TweetDeck update (6th December 2016)


3.0.21
===============
- [Feature] You can now collapse read DMs in the Messages column for a cleaner look and more privacy (GG [@pixeldesu](https://github.com/pixeldesu)) ([#105](https://github.com/eramdam/BetterTweetDeck/pull/105))
- [Bugfix] Fix a bug where valid "thumbnails" URLs would not get a preview because of the search query ([#104](https://github.com/eramdam/BetterTweetDeck/issues/104))


3.0.20
===============
- [Bugfix] Fix display of verified badge because of TweetDeck update on 9th of October 2016 FOR REAL THIS TIME
- [Bugfix] Gfycat iframes in modals should be correctly resized now (due to technical weirdness on Gfycat end, they won't resize dynamically though)
- [Bugfix] Fixing the display of avatars in conversations because TweetDeck still didn't fix it smh
- [Improvement] BTD changes the usernames correctly inside quoted tweets inside retweets and inside the "in reply to" block inside quoted tweets
- [Improvement] The "in reply to" part in quoted tweets is a little darker than the rest so it doesn't blend too much while in Dark + Minimal mode

3.0.19
===============
- [Bugfix] Remove the heart button animation when the stars are displayed
- [Bugfix] Slim scrollbars are also slim in detailed tweet view
- [Bugfix] Fix display of verified badge because of TweetDeck update on 9th of October 2016
- [Bugfix] Images/iframes in modals should be correctly resized now
- [Improvement] Desaturate some colors in minimal + dark mode

3.0.18
===============
- [Feature] You can specify a custom width for columns using any CSS value
- [Bugfix] The verified icon won't display on top on the "like" icon. Even though a heart should always be checked. :white_check_mark: :heart:
- [Bugfix] The "replace hearts by stars" feature is fixed after TweetDeck broke it.
- [Bugfix] The Esc key should close the lightboxes


3.0.17
===============
- [Bugfix] Horizontal scrollbars are also thin when "slim scrollbars" is enabled ([#96](https://github.com/eramdam/BetterTweetDeck/issues/96))
- [Bugfix] Dribbble/Imgur thumbnails work again
- [Bugfix] [Improvement] Hide the link related to a thumbnail only if it ends the tweet ([#97](https://github.com/eramdam/BetterTweetDeck/issues/97))

3.0.16
===============
- [Bugfix] Fix a bug where tweet actions would not work on custom modals.
- [Bugfix] Fix a bug where icons of accounts in Compose panel would be mis-placed.
- [Bugfix] Fix a bug where usernames would wrongly gets changed in some edge cases.
- [Improvement] Made some improvements to the way BTD stores its settings to handle future Edge/Firefox ports properly.
- [Improvement] Revert back the gradient on the modal's background.

3.0.15
===============
- [Feature] Added a setting to "stop" GIFs in profile pictures in columns
- [Bugfix] Gfycat embed players were too small, it's now fixed
- [Bugfix] Twitch clips should now actually work
- [Improvement] Username formatting should be more reliable/more performant
- [Improvement] The "no bg" background of modal now has a black to transparent gradient for improve readability

3.0.14
===============
- [Bugfix] Slimmer scrollbars are bigger and it's now an option

3.0.13
===============
- [Bugfix] GIFs should not stop anymore when the option "Stop gif autoplay" is unchecked
- [Bugfix] Streamable embed players were too small and mis-placed, it's now fixed
- [Improvement] The option "hide links relative to thumbnails" should work more reliably
- [Improvement] Better French translation (Thanks [LeoColomb](https://github.com/LeoColomb))
- [Improvement] Verified badge is better positioned (Thanks [LeoColomb](https://github.com/LeoColomb))
- [Feature] Twitch clips (clips.twitch.tv) are now supported ![](https://static-cdn.jtvnw.net/emoticons/v1/41/1.0)

3.0.12
===============
- [Bugfix] Verified badges should display correctly when relevant
- [Bugfix] Bring back the like/RT indicator on tweets because TweetDeck killed it
- [Improvement] Verified badges should display in modals and in the DM columns

3.0.11
===============
- [Bugfix] Choice of activating a provider or not is correctly taken into account in settings
- [Improvement] Universal preview is re-enabled by default
- [Improvement] The code don't use Embed.ly anymore

3.0.7 => 3.0.10
===============
- [Improvement] Removal of "tabs" permissions
- [Improvement] More reliable way of showing verified badges
- [Bugfix] Fix flashing of tweets
- [Bugfix] Links won't be hidden if a column has its media size on "off"
- [Bugfix] Modal should not have a scrollbar anymore
- [Improvement] The code don't rely on Embed.ly anymore for most services (except Giphy, cloudapp, bandcamp and twitch)

3.0.5
===============
- [Improvement] Option to hide bg of modals

3.0.3
===============
- [Bugfix] Share item is correctly added or not
- [Improvement] Settings button is back in TD
- [Improvement] Settings to hide scrollbars or not

3.0.1
===============
- [Bugfix] The play glyph is aligned on the "play icon"
- [Bugfix] Modal previews open for tweets in notifications
- [Bugfix] The "bubble" in minimal mode actually depends on the "show context" setting
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
