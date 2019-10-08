import * as t from 'io-ts';

import {BTDAvatarShapes} from '../features/changeAvatarShape';
import {BTDScrollbarsMode} from '../features/changeScrollbars';
import {BTDTweetActionsPosition} from '../features/changeTweetActions';
import {BTDUsernameFormat} from '../features/usernameDisplay';
import {makeEnumRuntimeType, withDefault} from '../helpers/typeHelpers';
import {getExtensionVersion} from '../helpers/webExtensionHelpers';

export type BTDModule = (TD: object, $: JQuery) => void;

const RBetterTweetDeckSettings = t.type({
  /** Used to show a banner prompting the user to follow @BetterTDeck */
  needsToShowFollowPrompt: t.boolean,
  /** Is used to track the version of the user and show a banner upon updates */
  installedVersion: withDefault(t.string, getExtensionVersion()),
  /** Alters the timestamp display in tweets */
  timestampFormat: t.type({
    shortFormat: t.string,
    fullFormat: t.string,
  }),
  /** Switches between the full timestamp in tweets after 24h */
  fullTimestampAfterDay: makeEnumRuntimeType<BTDUsernameFormat>(BTDUsernameFormat),
  /** Uses full links instead of t.co links */
  removeRedirectionOnLinks: t.boolean,
  /** Shows a clear (💧) button in the header of columns */
  showClearButtonColumnsInHeader: t.boolean,
  /** Shows a collapse (➖/➕) button in the header of columns */
  showCollapseButtonInColumnsHeader: t.boolean,
  /** Specify a custom column width using CSS values */
  columnCustomWidth: t.union([t.string, t.number]),
  /** Choose the shape of avatars in columns */
  avatarsShape: makeEnumRuntimeType<BTDAvatarShapes>(BTDAvatarShapes),
  /** Whether to make scrollbars slim or to hide them entirely */
  scrollbarsMode: makeEnumRuntimeType<BTDScrollbarsMode>(BTDScrollbarsMode),
  /** Put badges (translator/verified) on top of user avatars rather than next to names. */
  badgesOnTopOfAvatars: t.boolean,
  /** Where to show tweet actions. */
  tweetActionsPosition: makeEnumRuntimeType<BTDTweetActionsPosition>(BTDTweetActionsPosition),
  /** Whether to show actions on hover */
  showTweetActionsOnHover: t.boolean,
  /** Adds more actions below tweets */
  additionalTweetActions: t.type({
    /** Shows a 📎 icon to copy links of medias in a tweet. */
    copyMediaLinks: t.boolean,
    /** Shows a download button to download medias in a tweet. */
    downloadMediaLinks: t.boolean,
    /** Shows a mute icon to mute the author of a tweet quickly. */
    mute: t.boolean,
    /** Shows a block icon to block the author of a tweet quickly. */
    block: t.boolean,
  }),
  /** Adds more actions in tweet menus
   * TODO(damien): maybe put a BTD separator to make them more obvious in the UI.
   */
  additionalTweetMenuItems: t.type({
    redraft: t.boolean,
    muteSource: t.boolean,
    muteHashtags: t.boolean,
  }),
  /** Show legacy replies in columns */
  showLegacyReplies: t.boolean,
  /** A mustache template defining the filename used when downloading files */
  downloadFilenameFormat: t.string,
  /** Change tab title when stuff happens in TweetDeck */
  updateTabTitleOnActivity: t.boolean,
  // I like this one...but maybe i'm the only who cares?
  showLikeRTDogears: t.boolean,

  // Legacy / Not sure what to do with those
  // DEPREQ
  // Annoying feature...might remove or find a better way to do it
  displayStars: t.undefined,
  // DEPREQ
  // Annoying? I dont remember anyone depending on that + is probably buggy af
  flashTweets: t.undefined,

  // Useful but needs to be repositioned
  disableGifsInProfilePictures: t.undefined,
  // DEPREQ
  // Not sure they're that useful tbh
  collapse_columns_pause: t.boolean,
  // DEPREQ
  uncollapse_columns_unpause: t.boolean,
  // Not sure what to do with this one... Might need some rework
  minimal_mode: t.boolean,
  // DEPREQ
  // ...never knew why I kept this after the new replies tbqh
  hide_context: t.boolean,
  // This one will be a doozy....
  og_dark_theme: t.boolean,
  // DEPREQ
  // Not sure if this ever worked reliably
  pause_scroll_on_hover: t.boolean,
  // Might be risky nowadays...
  share_item: t.type({
    enabled: t.boolean,
    short_txt: t.boolean,
  }),
  // DEPREQ
  make_search_columns_first: t.boolean,
});
