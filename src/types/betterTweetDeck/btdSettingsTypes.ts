import * as t from 'io-ts';

import {BTDAvatarShapes} from '../../features/changeAvatarShape';
import {BTDScrollbarsMode} from '../../features/changeScrollbars';
import {BTDTimestampFormats} from '../../features/changeTimestampFormat';
import {BTDTweetActionsPosition} from '../../features/changeTweetActions';
import {BetterTweetDeckAccentColors, BetterTweetDeckThemes} from '../../features/themeTweaks';
import {BTDUsernameFormat} from '../../features/usernameDisplay';
import {makeEnumRuntimeType, withDefault} from '../../helpers/runtimeTypeHelpers';

export const RBetterTweetDeckSettings = t.type({
  /** Used to show a banner prompting the user to follow @BetterTDeck */
  needsToShowFollowPrompt: withDefault(t.boolean, false),

  /** Is used to track the version of the user and show a banner upon updates */
  installedVersion: withDefault(t.string, '4.0.0'),

  /** Alters the timestamp display in tweets */
  timestampShortFormat: withDefault(t.string, ''),
  timestampFullFormat: withDefault(t.string, ''),
  timestampStyle: withDefault(
    makeEnumRuntimeType<BTDTimestampFormats>(BTDTimestampFormats),
    BTDTimestampFormats.RELATIVE
  ),

  /** Show tweet cards in columns. */
  showCardsInsideColumns: withDefault(t.boolean, true),

  /** Display single images using their original aspect ratio. */
  useOriginalAspectRatioForSingleImages: withDefault(t.boolean, false),

  /** Switches between the full timestamp in tweets after 24h */
  fullTimestampAfterDay: withDefault(t.boolean, false),

  /** Uses full links instead of t.co links */
  removeRedirectionOnLinks: withDefault(t.boolean, false),

  /** Shows a clear (💧) button in the header of columns */
  showClearButtonInColumnsHeader: withDefault(t.boolean, false),

  /** Shows a collapse (➖/➕) button in the header of columns */
  showCollapseButtonInColumnsHeader: withDefault(t.boolean, false),

  /** Shows a remove (X) button in the header of columns */
  showRemoveButtonInColumnsHeader: withDefault(t.boolean, false),

  /** Hide icons in the columns' header */
  hideColumnIcons: withDefault(t.boolean, true),

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

  /* Adds more actions below tweets */
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
      addCopyMediaLinksAction: true,
      addDownloadMediaLinksAction: true,
      addMuteAction: true,
      addBlockAction: true,
    }
  ),

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
  // showLikeRTDogears: withDefault(t.boolean, false),

  enableShareItem: withDefault(t.boolean, true),
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

  customCss: withDefault(t.string, ''),
});

export interface BTDSettings extends t.TypeOf<typeof RBetterTweetDeckSettings> {}

export function parseBTDSettings(src: any): BTDSettings {
  return src;
}
