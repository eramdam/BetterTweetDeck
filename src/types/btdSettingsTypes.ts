import * as t from 'io-ts';

import {makeEnumRuntimeType, withDefault} from '../helpers/runtimeTypeHelpers';
import {
  BetterTweetDeckAccentColors,
  BetterTweetDeckThemes,
  BTDAvatarShapes,
  BTDLogoVariations,
  BTDMutualBadges,
  BTDScrollbarsMode,
  BTDTimestampFormats,
  BTDTweetActionsPosition,
  BTDUsernameFormat,
  BTDVerifiedBlueBadges,
} from './btdSettingsEnums';

export const RBetterTweetDeckSettings = t.type({
  /** Used to show a banner prompting the user to follow @BetterTDeck */
  showFollowPrompt: withDefault(t.boolean, true),

  /** Are used to track the version of the user and show a banner upon updates */
  installedVersion: withDefault(t.string, '4.0.0'),
  needsToShowUpdateBanner: withDefault(t.boolean, false),

  // /** Alters the timestamp display in tweets */
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

  /** Detects content warnings */
  detectContentWarnings: withDefault(t.boolean, false),
  detectContentWarningsWithoutKeywords: withDefault(t.boolean, false),
  singleWordContentWarnings: withDefault(t.string, 'food,transphobia,racism,homophobia'),
  detectSpoilers: withDefault(t.boolean, false),
  spoilerKeywords: withDefault(t.string, ''),
  /** Show Twitter's media warnings. */
  showMediaWarnings: withDefault(t.boolean, true),
  showWarningsForAdultContent: withDefault(t.boolean, true),
  showWarningsForGraphicViolence: withDefault(t.boolean, true),
  showWarningsForOther: withDefault(t.boolean, true),

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
  /** Shows a clear (💧) button in the sidebar to clear ALL columns */
  showClearAllButtonInSidebar: withDefault(t.boolean, false),

  /** Shows a collapse (➖/➕) button in the header of columns */
  showCollapseButtonInColumnsHeader: withDefault(t.boolean, false),

  /** Shows a remove (X) button in the header of columns */
  showRemoveButtonInColumnsHeader: withDefault(t.boolean, false),

  /** Hide icons in the columns' header */
  hideColumnIcons: withDefault(t.boolean, false),

  /** Make buttons in composer smaller */
  smallComposerButtons: withDefault(t.boolean, false),

  /** Show conversation control in tweet composer */
  showConversationControl: withDefault(t.boolean, true),

  showProfileLabels: withDefault(t.boolean, false),
  extractAndShowPronouns: withDefault(t.boolean, false),
  dontShowPronounsOnOwnAccounts: withDefault(t.boolean, false),

  /** Disable the `tweet` button if images don't have an alt text. */
  disableTweetButtonIfAltIsMissing: withDefault(t.boolean, false),
  /** Disable the `tweet` button if images don't have an alt text in DMs too. */
  disableTweetButtonIfAltIsMissingInDMs: withDefault(t.boolean, false),

  hidePreviewButton: withDefault(t.boolean, false),

  /** Choose the shape of avatars in columns */
  avatarsShape: withDefault(
    makeEnumRuntimeType<BTDAvatarShapes>(BTDAvatarShapes),
    BTDAvatarShapes.CIRCLE
  ),
  showAvatarsOnTopOfColumns: withDefault(t.boolean, false),

  /** Whether to make scrollbars slim or to hide them entirely */
  scrollbarsMode: withDefault(
    makeEnumRuntimeType<BTDScrollbarsMode>(BTDScrollbarsMode),
    BTDScrollbarsMode.DEFAULT
  ),

  /** Put badges (translator/verified) on top of user avatars rather than next to names. */
  badgesOnTopOfAvatars: withDefault(t.boolean, true),
  verifiedBadges: withDefault(t.boolean, true),
  translatorBadges: withDefault(t.boolean, true),
  mutualBadges: withDefault(t.boolean, false),
  mutualBadgeVariation: withDefault(
    makeEnumRuntimeType<BTDMutualBadges>(BTDMutualBadges),
    BTDMutualBadges.HEART
  ),
  verifiedBlueBadges: withDefault(t.boolean, false),
  verifiedBlueBadgeVariation: withDefault(
    makeEnumRuntimeType(BTDVerifiedBlueBadges),
    BTDVerifiedBlueBadges.DOLLAR
  ),

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
      addCopyMediaLinksAction: withDefault(t.boolean, false),

      /** Shows a download button to download medias in a tweet. */
      addDownloadMediaLinksAction: withDefault(t.boolean, false),

      /** Shows a mute icon to mute the author of a tweet quickly. */
      addMuteAction: withDefault(t.boolean, false),

      /** Shows a block icon to block the author of a tweet quickly. */
      addBlockAction: withDefault(t.boolean, false),

      requireConfirmationForTweetAction: withDefault(t.boolean, true),
    }),
    {}
  ),

  /** Always shows the account picker when favoriting a tweet */
  showAccountChoiceOnFavorite: withDefault(t.boolean, false),
  /** Comma separated list of account usernames from which to trigger the account picker */
  accountChoiceAllowList: withDefault(t.string, ''),

  /** Shows a follow icon to follow the author of a tweet quickly. */
  addFollowAction: withDefault(t.boolean, false),

  /** Always shows the account picker when following a user with the tweet action */
  showAccountChoiceOnFollow: withDefault(t.boolean, true),

  /** Shows the number of followers in the follow actions */
  showFollowersCount: withDefault(t.boolean, true),

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
      addRedraftMenuItem: withDefault(t.boolean, true),
      requireConfirmationForRedraft: withDefault(t.boolean, true),

      /** Adds an item to mute the source of the tweet */
      addMuteSourceMenuItem: withDefault(t.boolean, true),

      /** Adds a items to mute the hashtags of the tweet */
      addMuteHashtagsMenuItems: withDefault(t.boolean, true),
    }),
    {}
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

  enableShareItem: withDefault(t.boolean, false),
  shouldShortenSharedText: withDefault(t.boolean, true),

  disableGifsInProfilePictures: withDefault(t.boolean, false),

  collapseReadDms: withDefault(t.boolean, false),
  collapseAllDms: withDefault(t.boolean, false),

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

  overrideTranslationLanguage: withDefault(t.boolean, false),
  customTranslationLanguage: withDefault(t.string, ''),

  /** Change the logo shown at the bottom left of TweetDeck */
  logoVariation: withDefault(
    makeEnumRuntimeType<BTDLogoVariations>(BTDLogoVariations),
    BTDLogoVariations.DEFAULT
  ),

  /** Mutes users who used the NFT-integration on their avatar */
  muteNftAvatars: withDefault(t.boolean, false),
  hideNftMuteNotice: withDefault(t.boolean, false),
});

export interface BTDSettings extends t.TypeOf<typeof RBetterTweetDeckSettings> {}

export function parseBTDSettings(src: any): BTDSettings {
  return src;
}
