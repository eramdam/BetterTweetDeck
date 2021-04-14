import * as t from 'io-ts';

import {BTDAvatarShapes} from '../features/changeAvatarShape';
import {BTDScrollbarsMode} from '../features/changeScrollbars';
import {BTDTimestampFormats} from '../features/changeTimestampFormat';
import {BTDTweetActionsPosition} from '../features/changeTweetActions';
import {BetterTweetDeckAccentColors, BetterTweetDeckThemes} from '../features/themeTweaks';
import {BTDUsernameFormat} from '../features/usernameDisplay';
import {isFirefox} from '../helpers/browserHelpers';
import {makeEnumRuntimeType, withDefault} from '../helpers/runtimeTypeHelpers';

export const RBetterTweetDeckSettings = t.type({
  /** Used to show a banner prompting the user to follow @BetterTDeck */
  needsToShowFollowPrompt: withDefault(t.boolean, true),

  /** Are used to track the version of the user and show a banner upon updates */
  installedVersion: withDefault(t.string, '4.0.0'),
  needsToShowUpdateBanner: withDefault(t.boolean, false),

  /** Alters the timestamp display in tweets */
  timestampShortFormat: withDefault(t.string, ''),
  timestampFullFormat: withDefault(t.string, ''),
  timestampStyle: withDefault(
    makeEnumRuntimeType<BTDTimestampFormats>(BTDTimestampFormats),
    BTDTimestampFormats.RELATIVE
  ),

  alwaysShowNumberOfCharactersLeft: withDefault(t.boolean, false),

  /** Show tweet cards in columns. */
  showCardsInsideColumns: withDefault(t.boolean, true),
  showCardsInSmallMediaColumns: withDefault(t.boolean, true),

  /** Make emoji bigger in tweets. */
  biggerEmoji: withDefault(t.boolean, true),
  /** Show emoji picker. */
  showEmojiPicker: withDefault(t.boolean, true),
  enableEmojiCompletion: withDefault(t.boolean, true),
  showGifPicker: withDefault(t.boolean, true),

  /** Save tweeted hashtags. */
  saveTweetedHashtags: withDefault(t.boolean, false),

  /** Add search columns at top of the list. */
  addSearchColumnsFirst: withDefault(t.boolean, false),

  /** Render image overlays à la Twitter Web. */
  useModernFullscreenImage: withDefault(t.boolean, true),

  /** Pauses scrolling of columns when mouse hovers over theme */
  pauseColumnScrollingOnHover: withDefault(t.boolean, false),

  /** Display single images using their original aspect ratio. */
  useOriginalAspectRatioForSingleImages: withDefault(t.boolean, false),

  /** Display single images using their original aspect ratio. (quoted tweets) */
  useOriginalAspectRatioForSingleImagesInQuotedTweets: withDefault(t.boolean, true),

  /** Switches between the full timestamp in tweets after 24h */
  fullTimestampAfterDay: withDefault(t.boolean, false),

  /** Uses full links instead of t.co links */
  removeRedirectionOnLinks: withDefault(t.boolean, true),

  /** Shows a clear (💧) button in the header of columns */
  showClearButtonInColumnsHeader: withDefault(t.boolean, false),

  /** Shows a collapse (➖/➕) button in the header of columns */
  showCollapseButtonInColumnsHeader: withDefault(t.boolean, false),

  /** Shows a remove (X) button in the header of columns */
  showRemoveButtonInColumnsHeader: withDefault(t.boolean, false),

  /** Hide icons in the columns' header */
  hideColumnIcons: withDefault(t.boolean, false),

  /** Make buttons in composer smaller */
  smallComposerButtons: withDefault(t.boolean, false),

  /** Choose the shape of avatars in columns */
  avatarsShape: withDefault(
    makeEnumRuntimeType<BTDAvatarShapes>(BTDAvatarShapes),
    BTDAvatarShapes.CIRCLE
  ),

  /** Whether to make scrollbars slim or to hide them entirely */
  scrollbarsMode: withDefault(
    makeEnumRuntimeType<BTDScrollbarsMode>(BTDScrollbarsMode),
    BTDScrollbarsMode.DEFAULT
  ),

  /** Put badges (translator/verified) on top of user avatars rather than next to names. */
  badgesOnTopOfAvatars: withDefault(t.boolean, true),

  /** Where to show tweet actions. */
  tweetActionsPosition: withDefault(
    makeEnumRuntimeType<BTDTweetActionsPosition>(BTDTweetActionsPosition),
    BTDTweetActionsPosition.LEFT
  ),

  /** Whether to show actions on hover */
  showTweetActionsOnHover: withDefault(t.boolean, false),

  /** Adds more actions below tweets */
  tweetActions: withDefault(
    t.type({
      /** Shows a 📎 icon to copy links of medias in a tweet. */
      addCopyMediaLinksAction: t.boolean,

      /** Shows a download button to download medias in a tweet. */
      addDownloadMediaLinksAction: t.boolean,

      /** Shows a mute icon to mute the author of a tweet quickly. */
      addMuteAction: t.boolean,

      /** Shows a block icon to block the author of a tweet quickly. */
      addBlockAction: t.boolean,
    }),
    {
      addCopyMediaLinksAction: false,
      addDownloadMediaLinksAction: false,
      addMuteAction: false,
      addBlockAction: false,
    }
  ),

  /** Always shows the account picker when favoriting a tweet */
  showAccountChoiceOnFavorite: withDefault(t.boolean, false),
  /** Comma separated list of account usernames from which to trigger the account picker */
  accountChoiceAllowList: withDefault(t.string, ''),

  /** Change the display of usernames in columns. */
  usernamesFormat: withDefault(
    makeEnumRuntimeType<BTDUsernameFormat>(BTDUsernameFormat),
    BTDUsernameFormat.DEFAULT
  ),

  /** Adds more actions in tweet menus
   * TODO(damien): maybe put a BTD separator to make them more obvious in the UI.
   */
  tweetMenuItems: withDefault(
    t.type({
      /** Adds a "redraft" item */
      addRedraftMenuItem: t.boolean,

      /** Adds an item to mute the source of the tweet */
      addMuteSourceMenuItem: t.boolean,

      /** Adds a items to mute the hashtags of the tweet */
      addMuteHashtagsMenuItems: t.boolean,
    }),
    {
      addRedraftMenuItem: true,
      addMuteHashtagsMenuItems: true,
      addMuteSourceMenuItem: true,
    }
  ),

  /** Show legacy replies in columns */
  showLegacyReplies: withDefault(t.boolean, false),

  /** A mustache template defining the filename used when downloading files */
  downloadFilenameFormat: withDefault(
    t.string,
    '{{postedUser}}-{{year}}{{month}}{{day}}-{{hours}}{{minutes}}{{seconds}}-{{tweetId}}-{{fileName}}.{{fileExtension}}'
  ),

  /** Change tab title when stuff happens in TweetDeck */
  updateTabTitleOnActivity: withDefault(t.boolean, true),

  // I like this one...but maybe i'm the only one who cares?
  showLikeRTDogears: withDefault(t.boolean, false),

  enableShareItem: withDefault(t.boolean, !isFirefox),
  shouldShortenSharedText: withDefault(t.boolean, true),

  disableGifsInProfilePictures: withDefault(t.boolean, false),

  collapseReadDms: withDefault(t.boolean, false),

  replaceHeartsByStars: withDefault(t.boolean, false),

  theme: withDefault(
    makeEnumRuntimeType<BetterTweetDeckThemes>(BetterTweetDeckThemes),
    BetterTweetDeckThemes.DARK
  ),
  enableAutoThemeSwitch: withDefault(t.boolean, false),
  customAccentColor: withDefault(
    makeEnumRuntimeType<BetterTweetDeckAccentColors>(BetterTweetDeckAccentColors),
    BetterTweetDeckAccentColors.DEFAULT
  ),
  customAnyAccentColor: withDefault(t.string, ''),

  customCss: withDefault(t.string, ''),
  useCustomColumnWidth: withDefault(t.boolean, false),
  customColumnWidthValue: withDefault(t.string, '250px'),
});

export interface BTDSettings extends t.TypeOf<typeof RBetterTweetDeckSettings> {}

export function parseBTDSettings(src: any): BTDSettings {
  return src;
}
