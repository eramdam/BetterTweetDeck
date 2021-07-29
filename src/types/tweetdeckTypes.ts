import {Template} from 'hogan.js';
import {Twitter} from 'twit';

import {HandlerOf} from '../helpers/typeHelpers';

export enum TwitterConversationModes {
  EVERYONE = '',
  FOLLOW = 'Community',
  MENTION = 'ByInvitation',
}
export type TweetDeckTheme = 'light' | 'dark';
export type TweetDeckLinkShortener = 'bitly' | 'twitter';
export interface TweetDeckBitlyAccount {
  apiKey: string;
  login: string;
}
export type TweetDeckColumnWidth = 'wide' | 'medium' | 'narrow' | 'custom';
export type TweetDeckFontSize = 'smallest' | 'small' | 'medium' | 'large' | 'largest';

declare class TweetDeckFilter {
  value: string;
  type: string;
  getDisplayType(): string;
  _getDisplayType(): string;
  _getFilterTarget(chirp: TweetDeckChirp): TweetDeckChirp;
  _pass(chirp: TweetDeckChirp): boolean;
  pass(chirp: TweetDeckChirp): boolean;
  prototype: this;
}

export interface TweetDeckObject {
  storage: Storage;
  core: Core;
  net: Net;
  mustaches: {[key: string]: string};
  templates: unknown;
  components: unknown;
  services: Services;
  controller: TweetDeckController;
  vo: {
    Column: typeof TweetDeckColumn;
    Filter: TweetDeckFilter;
  };
  ui: TweetDeckUI;
  sync: Sync;
  cache: TweetDeckCache;
  buildID: string;
  buildIDShort: string;
  version: string;
  config: Config;
  metrics: Metrics;
  util: TweetDeckUtil;
  constants: Constants;
  languages: Languages;
  decider: Decider;
  settings: TweetDeckSettings;
  globalRenderOptions: GlobalRenderOptions;
  debug: Debug;
  minWrapperVersionMac: string;
  minWrapperVersionWin: string;
  ready: boolean;
}

interface TweetDeckCache {
  twitterUsers: unknown;
  lists: unknown;
  names: Names;
}

interface Names {
  SECONDS_IN_ONE_WEEK: number;
  _cache: CacheClass;
}

interface CacheClass {
  users: unknown;
  lists: unknown;
  customTimelines: unknown;
}

interface Config {
  minimum_version: string;
  web_root: string;
  api_root: string;
  twitter_api_base: string;
  twitter_api_version: string;
  twitter_stream_base: string;
  twitter_upload_base: string;
  td_create_key: string;
  td_create_secret: string;
  bearer_token: string;
  mapbox_access_token: string;
  client_name: string;
  sync_name: string;
  touchdeck: boolean;
}

interface Constants {
  keyCodes: KeyCodes;
  charCodes: CharCodes;
  regexps: Regexps;
  time: Time;
  TDApi: TDAPI;
}

interface TDAPI {
  ERROR_ACCOUNT_DOESNT_EXIST: string;
  ERROR_BAD_PASSWORD: string;
  ERROR_SESSION_EXPIRED: string;
  ERROR_RATE_LIMIT_EXCEEDED: string;
}

interface CharCodes {
  space: number;
  questionMark: number;
}

interface KeyCodes {
  enter: number;
  shift: number;
  escape: number;
  tab: number;
  del: number;
  spacebar: number;
  upArrow: number;
  downArrow: number;
  leftArrow: number;
  rightArrow: number;
}

interface Regexps {
  name: unknown;
  username: unknown;
  usernameWithAt: unknown;
  usernameWithSpace: unknown;
  email: unknown;
  tokenSeparator: unknown;
}

interface Time {
  oneDay: number;
  oneHour: number;
}

export interface TweetDeckControllerRelationshipResult {
  relationship: {
    source: {
      all_replies: boolean;
      blocked_by: boolean;
      blocking: boolean;
      can_dm: boolean;
      followed_by: boolean;
      following: boolean;
      following_received: boolean;
      following_requested: boolean;
      id: number;
      id_str: string;
      live_following: boolean;
      marked_spam: boolean;
      muting: boolean;
      notifications_enabled: boolean;
      screen_name: string;
      want_retweets: boolean;
    };
    target: {
      followed_by: boolean;
      following: boolean;
      following_received: boolean;
      following_requested: boolean;
      id: number;
      id_str: string;
      screen_name: string;
    };
  };
}

export interface TweetDeckControllerClient {
  showFriendship(
    userId: string,
    targetUserId: string | null,
    targetScreenName: string | null,
    callback: HandlerOf<TweetDeckControllerRelationshipResult>
  ): void;
  oauth: {
    account: {
      managed: boolean;
      state: {
        name: string;
        profileImageURL: string;
        userId: string;
        username: string;
      };
    };
  };
}

export type TweetDeckClientGetter = (key: string) => TweetDeckControllerClient | undefined;

interface TweetDeckController {
  auth: unknown;
  stats: Stats;
  clients: {
    getClientsByService(service: 'twitter'): TweetDeckControllerClient[];
    getClient: TweetDeckClientGetter;
  };
  scheduler: Scheduler;
  feedScheduler: FeedScheduler;
  feedManager: unknown;
  notifications: unknown;
  filterManager: {
    addFilter(type: string, value: string): void;
  };
  init: Init;
  upgrade: Upgrade;
  columnManager: ColumnManager;
}

interface ColumnManager {
  get(columnKey: string): TweetDeckColumn;
  getAllOrdered(): ReadonlyArray<TweetDeckColumn>;
  showColumn(columnKey: string): void;
  move(columnKey: string, direction: string): void;
  deleteColumn(columnKey: string): void;
  _aColumnIndex: ColumnMap;
  _columnOrder: string[];
  commands: unknown;
  TIMELINE: string;
  MENTIONS: string;
  FOLLOWERS: string;
  SEARCH: string;
  LISTS: string;
  CUSTOMTIMELINES: string;
  MESSAGES: string;
  TRENDS: string;
  ANALYTICS: string;
  TWEETS: string;
  FAVORITES: string;
  HOME: string;
  ME: string;
  INBOX: string;
  SCHEDULED: string;
  NETWORKACTIVITY: string;
  INTERACTIONS: string;
  DATAMINR: string;
  LIVEVIDEO: string;
  EVENT: string;
  WHATSHAPPENING: string;
  columnTypeToIconClass: MenuTitle;
  SELF_ACCOUNTS_ONLY: SelfAccountsOnly;
  TWITTER_GENERIC: TwitterGeneric;
  SELF_FEED_TYPE: SelfFeedType;
  NON_SELF_FEED_TYPE: NonSelfFeedType;
  MENU_TITLE: MenuTitle;
  MODAL_TITLE: MenuTitle;
  MENU_ATTRIBUTION: MenuAttribution;
  DISPLAY_ORDER: DisplayOrder[];
  DISPLAY_ORDER_SINGLETONS: DisplayOrderSingleton[];
  DISPLAY_ORDER_PROFILE: DisplayOrderProfile[];
  HELP_TEXT: HelpText;
  trendsColumnEnabled: boolean;
}

interface DisplayOrder {
  type: string;
  service?: string;
  class?: string;
  title: string;
  columnIconClass: string;
  premiumColumnType?: boolean;
  newColumnType?: boolean;
  attribution?: string;
}

interface DisplayOrderProfile {
  type: string;
  service: string;
  profile: boolean;
  title: string;
  columnIconClass: string;
  class?: string;
}

interface DisplayOrderSingleton {
  type: string;
  title: string;
  attribution?: string;
  columnIconClass: string;
}

interface HelpText {
  timeline: string;
  mentions: string;
  search: string;
  lists: string;
  customtimelines: string;
  livevideo: string;
  event: string;
  messages: string;
  trends: string;
  tweets: string;
  favorites: string;
  interactions: string;
  networkactivity: string;
  dataminr: string;
}

interface MenuAttribution {
  me: string;
  privateMe: string;
}

interface MenuTitle {
  timeline: string;
  mentions: string;
  search: string;
  followers: string;
  lists: string;
  customtimelines: string;
  messages: string;
  trends: string;
  analytics?: string;
  tweets: string;
  favorites: string;
  me: string;
  privateMe: string;
  scheduled: string;
  networkactivity: string;
  interactions: string;
  dataminr: string;
  livevideo: string;
  event: string;
  whatshappening?: string;
  home?: string;
}

interface NonSelfFeedType {
  timeline: string;
  tweets: string;
  mentions: string;
}

interface SelfAccountsOnly {
  messages: boolean;
  networkactivity: boolean;
  interactions: boolean;
  followers: boolean;
  timeline: boolean;
}

interface SelfFeedType {
  timeline: string;
  messages: string;
  tweets: string;
  followers: string;
}

interface TwitterGeneric {
  timeline: boolean;
  mentions: boolean;
  followers: boolean;
  messages: boolean;
  tweets: boolean;
  favorites: boolean;
  networkactivity: boolean;
  interactions: boolean;
}

interface ColumnMap {
  [key: string]: TweetDeckColumn;
}

export declare class TweetDeckColumn {
  constructor(...args: any[]);
  clear(): void;
  reloadTweets?: () => void;
  model: ColumnModel;
  ui: ColumnUiState;
  _feeds: FeedState[];
  filters: any[];
  description: string;
  state: string;
  updateArray: ColumnChirp[];
  updateIndex: UpdateIndex;
  highWaterMarkChirp: ColumnChirp;
  highWaterMarkSeenChirp: ColumnChirp;
  isTrackingRealtime: boolean;
  isFetchingUpwardUpdates: boolean;
  isFetchingOlderUpdates: boolean;
  doUpwardScrollDeferreds: any[];
  numNewPushedChirps: number;
  wasPushedGap: boolean;
  scribedImpressionIDs: ScribedImpressionIDs;
  _isUpdating: boolean;
  feedSubscriptions: Subscriptions;
  deleteSubscriptions: Subscriptions;
  visible: boolean;
  visibility: Visibility;
  temporary: boolean;
  detailViewComponent: null | {
    chirp: TweetDeckChirp;
    mainChirp: TweetDeckChirp;
    repliesTo?: {
      repliesTo: TweetDeckChirp[];
    };
    replies?: {
      replies: TweetDeckChirp[];
    };
  };
  UPWARD_SCROLL_CHIRP_BLOCK_SIZE: number;
  INFINITE_SCROLL_CHIRP_BLOCK_SIZE: number;
  TARGET_COLUMN_CHIRP_LIMIT: number;
  RETRY_FILL_TIMEOUT: number;
  COLUMN_MINIMALIST_TWEET_TPM_THRESHOLD: number;
  CARDS_TPM_THRESHOLD: number;
  streamRate: number;
  streamRateEvent: string;
  tpm: number;
  tpmUpdateEvent: string;
  tpmCounter: unknown;
  tpmIncrementEvent: string;
  STREAM_ITEM_CONTENT_SELECTOR: string;
  STREAM_ITEM_SELECTOR: string;
  miscSubscriptions: Array<Array<null | string>>;
  chirpsWithPlayingGifs: any[];
  visibleChirpsEvent: string;
}

interface FeedState {
  state: FeedInternalState;
  privateState: FeedPrivateState;
  deltaQ: any[];
  stateCache: null;
  managed: boolean;
}

interface FeedPrivateState {
  key: string;
  apiid: string;
}

interface FeedInternalState {
  type: string;
  service: string;
  accountkey: string;
  metadata: unknown;
  mtime: Date;
}

interface Subscriptions {
  [k: string]: Array<null | string>;
}

interface ColumnChirp {
  account: ChirpAccount;
  targetTweet: TweetDeckChirp;
  sourceUser: User;
  created: Date;
  maxPosition: string;
  minPosition: string;
  id: string;
  text: string;
  htmlText: string;
  apiBounds: APIBounds;
  sortIndex: HighWaterMarkChirpSortIndex;
  chirpType: ChirpBaseTypeEnum;
  _hasAnimatedGif: boolean;
  messages?: TweetDeckChirp[];
  quotedTweet?: TweetDeckChirp;
  retweetedStatus?: TweetDeckChirp;
}

interface ChirpAccount {
  state: ChirpAccountState;
  privateState: ChirpAccountPrivateState;
  managed: boolean;
  getUserID(): string;
  getKey(): string;
}

interface ChirpAccountPrivateState {
  isPrivate: boolean;
  verified: boolean;
  updated: number;
  key: string;
}

interface ChirpAccountState {
  type: string;
  oauth_token: string;
  username: string;
  name: string;
  profileImageURL: string;
  userId: string;
  require_some_consent: boolean;
}

interface APIBounds {
  [k: string]: ApiBound;
}

interface ApiBound {
  lower: string;
  upper: number;
}

interface HighWaterMarkChirpSortIndex {
  value: number;
  type: string;
}

export type TweetDeckUser = User;
interface User {
  account: ChirpAccount;
  id: string;
  screenName: string;
  profileURL: string;
  profileImageURL: string;
  avatarSuffixRegex: unknown;
  name: string;
  emojifiedName: string;
  location: string;
  description: string;
  entities: SourceUserEntities;
  joinedDate: Date;
  friendsCount: number;
  listedCount: number;
  followersCount: number;
  statusesCount: number;
  url: string;
  isProtected: boolean;
  isVerified: boolean;
  isTranslator: boolean;
  isBadged: boolean;
  following: boolean;
  lang: null;
  profileColor: string;
  bannerUrl: string;
  bannerUrlSmall: string;
  _profileBannerURL: string;
  prototype: this;
  getExpandedURL(): string;
  setFollowing?(following: boolean): void;
  prettyFollowersCountInTweetAction?(): string;
}

interface SourceUserEntities {
  url: UrlEntity;
  description: UrlEntity;
}

interface UrlEntity {
  urls: TwitterUrl[];
}

interface TwitterUrl {
  url: string;
  expanded_url: string;
  display_url: string;
  indices: number[];
}

export enum TwitterActionEnum {
  FAVORITE = 'favorite',
  FAVORITED_MEDIA = 'favorited_media_tagged',
  FAVORITED_MENTION = 'favorited_mention',
  FAVORITED_RETWEET = 'favorited_retweet',
  FOLLOW = 'follow',
  LIST_CREATED = 'list_created',
  LIST_DESTROYED = 'list_destroyed',
  LIST_MEMBER_ADDED = 'list_member_added',
  LIST_MEMBER_REMOVED = 'list_member_removed',
  MENTION = 'mention',
  QUOTE = 'quote',
  QUOTED_TWEET = 'quoted_tweet',
  REPLY = 'reply',
  RETWEET = 'retweet',
  RETWEETED_MEDIA = 'retweeted_media_tagged',
  RETWEETED_MENTION = 'retweeted_mention',
  RETWEETED_RETWEET = 'retweeted_retweet',
  UNFAVORITE = 'unfavorite',
  UNFOLLOW = 'unfollow',
}

export enum ChirpBaseTypeEnum {
  CONVERSATION_JOIN = 'conversation_participants_join',
  CONVERSATION_NAME_UPDATE = 'conversation_name_update',
  CONVERSATION_PARTICIPANTS_FAILED = 'conversation_participants_failed',
  CONVERSATION_PARTICIPANTS_JOIN = 'conversation_participants_join',
  DATAMINR_ALERT = 'dataminr_alert',
  GAP = 'gap',
  MESSAGE_THREAD = 'message_thread',
  MESSAGE = 'message',
  SCHEDULED_GROUP = 'scheduled_group',
  SCHEDULED_STATUS = 'scheduled_status',
  SCHEDULED_TWEET_GROUP = 'scheduled_tweet_group',
  SCHEDULED_TWEET = 'scheduled_tweet',
  TWEET = 'tweet',
}

export interface TweetDeckChirp {
  _hasAnimatedGif: boolean;
  _media: any[];
  account: ChirpAccount;
  creatorAccount: ChirpAccount;
  action?: TwitterActionEnum;
  chirpType?: ChirpBaseTypeEnum;
  conversationMuted: boolean;
  created: string;
  entities: TweetEntities;
  htmlText: string;
  id: string;
  inReplyToID: string | number | null;
  inReplyToScreenName: string;
  inReplyToUserID: string;
  isFavorite: boolean;
  isQuoteStatus: boolean;
  isRetweeted: boolean;
  lang: string;
  likeCount: number;
  owner?: User;
  participants: User[];
  place: unknown;
  prettyLikeCount: boolean;
  prettyReplyCount: boolean;
  prettyRetweetCount: boolean;
  quotedTweet?: TweetDeckChirp;
  quotedTweetMissing: boolean;
  replyCount: number;
  retweet?: TweetDeckChirp;
  retweetCount: number;
  retweetedStatus?: TweetDeckChirp;
  selfThreadId: boolean;
  sender?: User;
  sortIndex: TargetTweetSortIndex;
  sourceNoHTML: string;
  sourceUrl: string;
  sourceUser: User;
  targetTweet?: TweetDeckChirp;
  text: string;
  user: User;
  withPrettyEngagements: boolean;
  conversationId?: string | number;
  renderInMediaGallery(): string;
  renderQuotedTweet(options: {mediaPreviewSize: TweetDeckColumnMediaPreviewSizesEnum}): string;
  getChirpURL(): string;
  getMainTweet(): TweetDeckChirp;
  getReplyUsers(): User[];
  getReplyingToUsers(): User[];
  isAboutYou(): boolean;
  hasEligibleCard?(): boolean;
  destroy(): void;
  isRetweetedStatus(): boolean;
  getFilterableText(): string;
  favorite(options: {element: JQuery<Element>; statusKey: string; column: string}): void;
  card?: {
    name: string;
    url: string;
  };
}

export interface TweetHashtag {
  indices: [number, number];
  text: string;
}

export type TweetMediaEntityPalette = {
  rgb: {
    blue: number;
    red: number;
    green: number;
  };
  percentage: number;
}[];

export type TweetdeckMediaEntity = Twitter.MediaEntity & {
  ext_media_color?: {
    palette: TweetMediaEntityPalette;
  };
  video_info: {
    variants: {
      url: string;
      bitrate: number;
    }[];
  };
};

type TweetDeckMentionEntity = Twitter.UserMentionEntity & {
  isImplicitMention: boolean;
};

type TweetDeckUrlEntity = Twitter.UrlEntity & {
  isUrlForAttachment: boolean;
};

export interface TweetEntities {
  hashtags: Twitter.HashtagEntity[];
  urls: TweetDeckUrlEntity[];
  user_mentions: TweetDeckMentionEntity[];
  cashtags: any[];
  media: TweetdeckMediaEntity[];
  convertedToUTF16: boolean;
}

interface TargetTweetSortIndex {
  value: string;
  type: string;
}

interface ColumnModel {
  state: ColumnModelState;
  privateState: FeedPrivateState;
  deltaQ: any[];
  stateCache: null;
  managed: boolean;
  setClearedTimestamp: (timestamp: number) => void;
}

export enum TweetDeckColumnMediaPreviewSizesEnum {
  OFF = 'off',
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}
interface ColumnModelState {
  mtime: Date;
  type: string;
  settings: {
    media_preview_size: TweetDeckColumnMediaPreviewSizesEnum;
  };
  feedkeys: string[];
}

interface ScribedImpressionIDs {
  cache: ScribedImpressionIDsCache;
  head: Head;
  tail: Head;
  cacheSize: number;
  maxSize: number;
}

interface ScribedImpressionIDsCache {
  [k: string]: Head;
}

interface Head {
  key: string;
  value: boolean;
  next: null;
  previous: null;
}

interface ColumnUiState {
  chirpContainerSelector: string;
  infiniteSpinnerSelector: string;
  globalTpmSlidingLimit: number;
  columnTpmSlidingLimit: number;
  queuedSlidingLimit: number;
  chirpStaggeringInterval: number;
  $moreTweetsButtonContainer: MoreTweetsButtonContainer;
  fadeInClass: string;
  state: UIState;
  newTweetsTemplates: NewTweetsTemplates;
  moreTweetsState: MoreTweetsState;
  _$chirpContainer: ChirpContainer;
  getChirpScroller(): JQuery<HTMLElement>;
  pause(): void;
  unpause(): void;
  getChirpById(id: string | number): JQuery<HTMLElement>;
  teardownCard(id: string): void;
}

interface MoreTweetsButtonContainer {
  '0': unknown;
  length: number;
  prevObject: MoreTweetsButtonContainerPrevObject;
  context: Context;
  selector: string;
}

interface Context {
  location: LocationClass;
  _reactListenersID17652101240597484: number;
}

interface LocationClass {
  href: string;
  ancestorOrigins: unknown;
  origin: string;
  protocol: string;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
}

interface MoreTweetsButtonContainerPrevObject {
  '0': unknown;
  length: number;
  prevObject: ChirpContainer;
  context: Context;
}

interface ChirpContainer {
  '0': unknown;
  length: number;
  prevObject: ChirpContainerPrevObject;
  context: Context;
  selector: string;
}

interface ChirpContainerPrevObject {
  '0': Context;
  context: Context;
  length: number;
}

interface MoreTweetsState {
  current: string;
  transition: null;
}

interface NewTweetsTemplates {
  default: string;
  'plural tweet': string;
  'singular tweet': string;
  'plural notification': string;
  'singular notification': string;
  'plural activity': string;
  'singular activity': string;
  'plural follower': string;
  'singular follower': string;
  'plural message': string;
  'singular message': string;
}

interface UIState {
  columnKey: string;
  $noResults: null;
  sliding: boolean;
  slidingQueue: any[];
}

interface UpdateIndex {
  [k: string]: ColumnChirp & TweetDeckChirp;
}

interface Visibility {
  columnWidth: number;
  visibleWidth: number;
  visibleHeight: number;
  visibleFraction: number;
}

interface FeedScheduler {
  FEED_TYPE_TO_MINIMUM_REFRESH_PERIOD: FeedTypeToMinimumRefreshPeriod;
  DEFAULT_MINIMUM_REFRESH_PERIOD: number;
  DEFAULT_REFRESH_PERIOD: number;
  THROTTLED_REFRESH_PERIOD: number;
  _activeColumns: ColumnMap;
  _temporaryColumns: unknown;
  _taskIndex: TaskIndex;
}

interface FeedTypeToMinimumRefreshPeriod {
  home: number;
  favorites: number;
  search: number;
  usertweets: number;
  networkactivity: number;
  scheduled: number;
}

interface TaskIndex {
  [k: string]: FeedSchedulerTask;
}

interface FeedSchedulerTask {
  home: Home;
  interactions: Interactions;
}

interface Home {
  accountKey: string;
  feedType: string;
  feeds: unknown;
  taskId: null;
  rateLimitData: RateLimitData;
  isThrottled: boolean;
}

interface RateLimitData {
  rateLimitRemaining: number;
  rateLimitTotal: number;
  rateLimitReset: number;
}

interface Interactions {
  accountKey: string;
  feedType: string;
  feeds: Feeds;
  taskId: string;
  rateLimitData: null;
  isThrottled: boolean;
}

interface Feeds {
  [k: string]: FeedState;
}

interface Init {
  initTimer: InitTimer;
}

interface InitTimer {
  ns: string;
  t: number;
}

interface Scheduler {
  QUERY_INTERVAL: number;
  SLEEP_THRESHOLD: number;
  _tasks: {[key: string]: FeedSchedulerTask};
  _lastTickTime: number;
  _jQueryCleanupTaskId: string;
  removePeriodicTask(id: string): void;
}

interface FeedSchedulerTask {
  id: string;
  period: number;
  cycleStartTime: number;
}

interface Stats {
  columnNamespaces: ColumnNamespaces;
  SCRIBE_CLIENT: string;
  scribeClientEvent: ScribeClientEvent;
  scribeGuestId: number;
  setExperiments: HandlerOf<object>;
}

interface ColumnNamespaces {
  col_mentions: ColActivity;
  col_followers: ColActivity;
  col_timeline: ColActivity;
  col_search: ColActivity;
  col_messages: ColActivity;
  col_favorites: ColActivity;
  col_list: ColActivity;
  col_scheduled: ColActivity;
  col_usertweets: ColActivity;
  undefined: ColActivity;
  col_home: ColActivity;
  col_me: ColActivity;
  col_inbox: ColActivity;
  col_interactions: ColActivity;
  col_activity: ColActivity;
  col_customtimeline: ColActivity;
  col_dataminr: ColActivity;
  col_livevideo: Col;
  col_trends: Col;
  col_analytics: Col;
  col_whatshappening: Col;
  col_event: Col;
}

interface ColActivity {
  legacyId: number;
  namespace: Namespace;
}

interface Namespace {
  section: string;
  component: string;
}

interface Col {
  namespace: Namespace;
}

interface ScribeClientEvent {
  scribeContext: unknown;
  scribeData: unknown;
}

interface Upgrade {
  CURRENT_VERSION: number;
}

interface Core {
  base64: unknown;
  defer: Defer;
}

interface Defer {
  NAME: string;
  DEBUG_DEFERREDS: boolean;
}

interface Debug {
  spoof_data: null;
}

interface Decider {
  accessLevels: AccessLevels;
}

interface AccessLevels {
  scheduler: MediaUpload;
  mediaUpload: MediaUpload;
}

interface MediaUpload {
  levels: Level[];
}

interface Level {
  level: string;
  deciderKey: string;
}

interface GlobalRenderOptions {
  styledScrollbar: boolean;
  isTouchDevice: boolean;
  decider: {[key: string]: boolean};
  featureFlag: FeatureFlag;
  btd: {
    usernameFromURL: () => (input: string, render: Template['render']) => string;
  };
}

interface FeatureFlag {
  tweetdeck_activity_streaming: boolean;
  tweetdeck_activity_value_polling: number;
  tweetdeck_alt_text_max_length: number;
  tweetdeck_content_search_darkmode: boolean;
  tweetdeck_content_render_search_tweets: boolean;
  tweetdeck_content_usertweets_darkmode: boolean;
  tweetdeck_content_usertweets_render: boolean;
  tweetdeck_content_usertweets_rest_polling_interval: number;
  tweetdeck_create_moment_pro: boolean;
  tweetdeck_devel: boolean;
  tweetdeck_dogfood: boolean;
  tweetdeck_error_collection: boolean;
  tweetdeck_gdpr_consent: boolean;
  tweetdeck_gdpr_updates: boolean;
  tweetdeck_graphql_login: boolean;
  tweetdeck_horizon_web_cards_enabled: any[];
  tweetdeck_horizon_web_cards_static: any[];
  tweetdeck_insights: boolean;
  tweetdeck_live_engagements: boolean;
  tweetdeck_native_video_player: boolean;
  tweetdeck_rweb_composer: boolean;
  tweetdeck_searches_with_negation: boolean;
  tweetdeck_scheduled_new_api: boolean;
  tweetdeck_scheduled_tweet_ephemeral: boolean;
  tweetdeck_show_release_notes_link: boolean;
  tweetdeck_trends_column: boolean;
  tweetdeck_uiv: boolean;
}

interface Languages {
  _index: {[key: string]: Index};
  getSystemLanguageCode(normalize?: boolean): string;
  getAllLanguages(): ReadonlyArray<{code: string; localized_name: string; name: string}>;
}

interface Index {
  code: string;
  localized_name: string;
  name: string;
  actual_code?: string;
}

interface Metrics {
  DEBUG: boolean;
  throttle: number;
  flush: boolean;
  restoreFromFlush: boolean;
  flushKey: string;
  types: Types;
  namespaces: unknown;
  error: Error;
  event: Event;
}

interface Error {
  preventCallThrough: boolean;
  attached: boolean;
}

interface Event {
  attached: boolean;
}

interface Types {
  counter: Counter;
  metric: Metric;
}

interface Counter {
  key: string;
  empty: number;
  defaultValue: number;
}

interface Metric {
  key: string;
  empty: any[];
  defaultValue: any[];
}

interface Net {
  util: unknown;
  ajax: unknown;
}

export interface TwitterStatus extends TweetDeckChirp {
  prototype: TweetDeckChirp & {
    [k: string]: any;
    getReplyingToUsers(): User[];
  };
}

interface Services {
  TwitterAction: TwitterStatus;
  bitly: unknown;
  TwitterStatus: TwitterStatus;
  TwitterActionOnTweet: TwitterStatus;
  TwitterUser: User;
  ChirpBase: {
    MESSAGE: string;
  };
}

interface TweetDeckSettings {
  NEW_COMPOSER_OPT_IN: string;
  COLUMN_WIDTH_VALUES: TweetDeckColumnWidth[];
  FONT_SIZE_VALUES: TweetDeckFontSize[];
  linkShorteners: LinkShortener[];
  setTheme(theme: TweetDeckTheme): void;
  getTheme(): TweetDeckTheme;
  getLinkShortener(): TweetDeckLinkShortener;
  setLinkShortener(service: TweetDeckLinkShortener): void;
  setBitlyAccount(account: TweetDeckBitlyAccount): void;
  getBitlyAccount(): TweetDeckBitlyAccount;
  getColumnWidth(): TweetDeckColumnWidth;
  setColumnWidth(width: TweetDeckColumnWidth): void;
  getFontSize(): TweetDeckFontSize;
  setFontSize(size: TweetDeckFontSize): void;
  getAutoPlayGifs(): boolean;
  setAutoPlayGifs(value: boolean): void;
  getShowStartupNotifications(): boolean;
  setShowStartupNotifications(value: boolean): void;
  getDisplaySensitiveMedia(): boolean;
  setDisplaySensitiveMedia(value: boolean): void;
  getUseStream(): boolean;
  setUseStream(value: boolean): void;
}

interface LinkShortener {
  id: string;
  title: string;
}

type TweetDeckAccount = {
  generateKeyFor(service: string, userID: string): string;
};

interface Storage {
  store: Store;
  Account: TweetDeckAccount;
  notification: unknown;
  feedController: FeedController;
  columnController: ColumnController;
  accountController: AccountController;
  clientController: ClientController;
}

interface AccountController {
  _moduleName: string;
  reqsinflight: any[];
  ACCEPTED_ACCOUNT_TYPES: AcceptedAccountTypes;
  _objects: AccountControllerObjects;
  _cookieAccountPromise: unknown;
  _unverified: unknown;
  subscription: Array<null | string>;
}

interface AcceptedAccountTypes {
  twitter: boolean;
  bitly: boolean;
}

interface AccountControllerObjects {
  [k: string]: ChirpAccount;
}

interface ClientController {
  apiEndpoint: string;
  _moduleName: string;
  reqsinflight: any[];
  _objects: ObjectsByApiidClass;
  _objectsByApiid: ObjectsByApiidClass;
  client: Client;
}

interface ObjectsByApiidClass {
  blackbird: Client;
}

interface Client {
  state: ClientState;
  privateState: unknown;
  deltaQ: any[];
  stateCache: null;
  managed: boolean;
  dictSet(object: string, key: string, value: any): void;
}

interface ClientState {
  column_order: string[];
  account_whitelist: string[];
  default_account: string;
  settings: StateSettings;
  recent_searches: string[];
  mtime: Date;
  name: string;
}

interface StateSettings {
  show_search_filter_callout: boolean;
  seen_message_ids: number[];
  compose_stay_open: boolean;
  name_cache: CacheClass;
  version: number;
  use_narrow_columns: null;
  previous_splash_version: string;
  theme: string;
}

interface ColumnController {
  apiEndpoint: string;
  _moduleName: string;
  reqsinflight: any[];
  _objects: ColumnControllerObjects;
  _objectsByApiid: {[key: string]: ColumnModel};
}

interface ColumnControllerObjects {
  c1590985257427s53: ColumnModel;
}

interface FeedController {
  apiEndpoint: string;
  _moduleName: string;
  reqsinflight: any[];
  _objects: Feeds;
  _objectsByApiid: ObjectsByApiid;
}

interface ObjectsByApiid {
  [k: string]: FeedState;
}

interface Store {
  _backendType: string;
  _backend: Backend;
}

interface Backend {
  typeaheadTopicsLastPrefetch: string;
  __version__: string;
  typeaheadTopicsHash: string;
  typeaheadUserLastPrefetch: string;
  twitterAccountID: string;
  accountsLastVerified: string;
  typeaheadUserHash: string;
  guestID: string;
}

interface Sync {
  util: SyncUtil;
  trace: unknown;
  tdapi: unknown;
  controller: SyncController;
}

interface SyncController {
  loop: number;
}

interface SyncUtil {
  DO_THING_ANYWAY: string;
}

interface TweetDeckUI {
  template: {
    render: (templateName: string, context: object) => string;
  };
  main: unknown;
  openColumn: unknown;
  updates: Updates;
  columns: Columns;
}

interface Columns {
  COLUMN_GLOW_DURATION: number;
}

interface Updates {
  allowRetweetsAndReplies: boolean;
}

interface TweetDeckUtil {
  ANCHOR_TAG_REGEXP: unknown;
  LT_REGEXP: unknown;
  GT_REGEXP: unknown;
  SINGLE_QUOTE_REGEXP: unknown;
  QUOTE_REGEXP: unknown;
  TWITTER_USERNAME_REGEXP: unknown;
  timesCached: TimesCached;
  datesCached: DatesCached;
  poller: unknown;
  createUrlAnchor(e: TweetDeckUrlEntity): string;
  pluck(method: string): (a: any) => any;
  truncateNumber(n: number): string;
  transform(text: string, entities?: TweetEntities): string;
  htmlToText(text: string): string;
  removeHTMLCodes(text: string): string;
}

interface DatesCached {
  months: string[];
  dates: string[];
}

interface TimesCached {
  longFormPast: LongFormFuture;
  longFormFuture: LongFormFuture;
  shortForm: LongFormFuture;
}

interface LongFormFuture {
  singular: Plural;
  plural: Plural;
}

interface Plural {
  now: string;
  seconds: string;
  minutes: string;
  hours: string;
  days: string;
}
