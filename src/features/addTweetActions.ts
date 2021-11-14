import './addTweetActions.css';

import {saveAs} from 'file-saver';

import {isHTMLElement} from '../helpers/domHelpers';
import {modifyMustacheTemplate} from '../helpers/mustacheHelpers';
import {
  getChirpFromElement,
  getFilenameDownloadData,
  getMediaFromChirp,
} from '../helpers/tweetdeckHelpers';
import {makeIsModuleRaidModule} from '../helpers/typeHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';
import {TweetDeckUser, TwitterActionEnum} from '../types/tweetdeckTypes';
import {requestMediaItem} from './redraftTweet';

export enum TweetActions {
  DOWNLOAD_MEDIA = 'download-media',
  HOTLINK_MEDIA = 'hotlink-media',
  FOLLOW_ACCOUNT = 'follow-account',
  BLOCK_ACCOUNT = 'block-account',
  MUTE_ACCOUNT = 'mute-account',
}

export const maybeAddTweetActions = makeBTDModule(({settings, TD, jq, mR}) => {
  const actionItems = settings.tweetActions;

  if (!actionItems) {
    return;
  }

  const {addCopyMediaLinksAction, addMuteAction, addBlockAction, addDownloadMediaLinksAction} =
    actionItems;
  const addFollowAction = settings.addFollowAction;

  const numberOfEnabledActions = [
    addCopyMediaLinksAction,
    addFollowAction,
    addMuteAction,
    addBlockAction,
    addDownloadMediaLinksAction,
  ].filter((i) => i).length;

  if (numberOfEnabledActions > 2) {
    document.body.setAttribute('btd-hide-buttons-count', 'true');
  }

  // Modify detail buttons.
  modifyMustacheTemplate(TD, 'status/tweet_detail_actions.mustache', (string) => {
    const marker = '{{_i}}Like{{/i}} </span> </a> {{/account}} </li>';

    const copyMediaItem =
      (addCopyMediaLinksAction &&
        `<li class="tweet-detail-action-item btd-tweet-detail-action-item">
    <a class="js-show-tip tweet-detail-action btd-tweet-detail-action btd-clipboard position-rel" href="#"
      data-btd-action="${TweetActions.HOTLINK_MEDIA}" rel="hotlink" title="Copy links to media">
      <i class="js-icon-attachment icon icon-attachment txt-center"></i>
      <span class="is-vishidden"> {{_i}}Copy links to media{{/i}} </span>
    </a>
  </li>`) ||
      '';

    const downloadMediaItem =
      (addDownloadMediaLinksAction &&
        `<li class="tweet-detail-action-item btd-tweet-detail-action-item">
      <a class="js-show-tip tweet-detail-action btd-tweet-detail-action position-rel" href="#"
        data-btd-action="${TweetActions.DOWNLOAD_MEDIA}" rel="download" title="Download media">
        <i class="js-icon-download icon icon-download txt-center"></i>
        <span class="is-vishidden"> {{_i}}Download media{{/i}} </span>
      </a>
    </li>`) ||
      '';

    const followItem =
      (addFollowAction &&
        `<li class="tweet-detail-action-item btd-tweet-detail-action-item">
  <a class="js-show-tip tweet-detail-action btd-tweet-detail-action position-rel" href="#"
    data-btd-action="${TweetActions.FOLLOW_ACCOUNT}" rel="follow" title="{{^following}}Follow{{/following}}{{#following}}Unfollow{{/following}} @{{screenName}}">
    <i class="js-icon-follow icon icon-{{^following}}follow{{/following}}{{#following}}following{{/following}} icon-follow-toggle txt-center"></i>
    <span class="is-vishidden"> {{_i}}Follow{{/i}} </span>
  </a>
</li>`) ||
      '';

    const muteItem =
      (addMuteAction &&
        `<li class="tweet-detail-action-item btd-tweet-detail-action-item">
      <a class="js-show-tip tweet-detail-action btd-tweet-detail-action position-rel" href="#"
        data-btd-action="${TweetActions.MUTE_ACCOUNT}" rel="action" title="Mute @{{screenName}}">
        <i class="icon icon-muted txt-center"></i>
        <span class="is-vishidden"> {{_i}}Mute @{{screenName}}{{/i}} </span>
      </a>
    </li>`) ||
      '';

    const blockItem =
      (addBlockAction &&
        `<li class="tweet-detail-action-item btd-tweet-detail-action-item">
      <a class="js-show-tip tweet-detail-action btd-tweet-detail-action position-rel" href="#"
        data-btd-action="${TweetActions.BLOCK_ACCOUNT}" rel="hotlink" title="Block @{{screenName}}">
        <i class="icon icon-blocked txt-center"></i>
        <span class="is-vishidden"> {{_i}}Block @{{screenName}}{{/i}} </span>
      </a>
    </li>`) ||
      '';

    const replacement = `${marker}{{#getMainTweet}}
    {{#entities.media.length}}
    ${copyMediaItem}
    ${downloadMediaItem}
    {{/entities.media.length}}
    {{#user}}{{^isMe}}
    ${followItem}
    ${muteItem}
    ${blockItem}
    {{/isMe}}{{/user}}
    {{/getMainTweet}}`;

    return string.replace(marker, replacement);
  });

  modifyMustacheTemplate(TD, 'status/tweet_single_actions.mustache', (string) => {
    const marker = '{{_i}}Like{{/i}} </span> </a> </li>';

    const copyMediaItem =
      (addCopyMediaLinksAction &&
        `<li class="tweet-action-item btd-tweet-action-item pull-left margin-r--10">
    <a class="js-show-tip tweet-action btd-tweet-action btd-clipboard position-rel" href="#" 
      data-btd-action="${TweetActions.HOTLINK_MEDIA}" rel="hotlink" title="Copy links to media"> 
      <i class="js-icon-attachment icon icon-attachment txt-center"></i>
      <span class="is-vishidden"> {{_i}}Copy links to media{{/i}} </span>
    </a>
  </li>`) ||
      '';

    const downloadItem =
      (addDownloadMediaLinksAction &&
        `<li class="tweet-action-item btd-tweet-action-item pull-left margin-r--10">
      <a class="js-show-tip tweet-action btd-tweet-action position-rel" href="#" 
        data-btd-action="${TweetActions.DOWNLOAD_MEDIA}" rel="download" title="Download media"> 
        <i class="js-icon-download icon icon-download txt-center"></i>
        <span class="is-vishidden"> {{_i}}Download media{{/i}} </span>
      </a>
    </li>`) ||
      '';

    const followersCount =
      (settings.showFollowersCount &&
        '<span class="pull-right icon-follow-toggle margin-l--2 margin-t--1 txt-size--12 js-followers-count followers-count">{{prettyFollowersCountInTweetAction}}</span>') ||
      '';

    const followItem =
      (addFollowAction &&
        `<li class="tweet-action-item btd-tweet-action-item pull-left margin-r--10">
  <a class="js-show-tip tweet-action btd-tweet-action btd-clipboard position-rel" href="#" 
    data-btd-action="${TweetActions.FOLLOW_ACCOUNT}" rel="follow" title="{{>text/follow_action}}"> 
    <i class="js-icon-follow icon icon-{{^following}}follow{{/following}}{{#following}}following{{/following}} icon-follow-toggle txt-center pull-left"></i>
    ${followersCount}
    <span class="is-vishidden"> {{_i}}Follow{{/i}} </span>
  </a>
</li>`) ||
      '';

    const muteItem =
      (addMuteAction &&
        `<li class="tweet-action-item btd-tweet-action-item pull-left margin-r--10">
    <a class="js-show-tip tweet-action btd-tweet-action btd-clipboard position-rel" href="#" 
      data-btd-action="${TweetActions.MUTE_ACCOUNT}" rel="action" title="Mute @{{screenName}}"> 
      <i class="js-icon-muted icon icon-muted txt-center"></i>
      <span class="is-vishidden"> {{_i}}Mute @{{screenName}}{{/i}} </span>
    </a>
  </li>`) ||
      '';

    const blockItem =
      (addBlockAction &&
        `<li class="tweet-action-item btd-tweet-action-item pull-left margin-r--10">
  <a class="js-show-tip tweet-action btd-tweet-action btd-clipboard position-rel" href="#" 
    data-btd-action="${TweetActions.BLOCK_ACCOUNT}" rel="action" title="Block @{{screenName}}"> 
    <i class="js-icon-blocked icon icon-blocked txt-center"></i>
    <span class="is-vishidden"> {{_i}}Block @{{screenName}}{{/i}} </span>
  </a>
</li>`) ||
      '';

    const replacement = `${marker}{{#getMainTweet}}
      {{#entities.media.length}}
      ${copyMediaItem}
      ${downloadItem}
      {{/entities.media.length}}
      {{#user}}{{^isMe}}
      ${followItem}
      ${muteItem}
      ${blockItem}
      {{/isMe}}{{/user}}
      {{/getMainTweet}}`;

    return string.replace(marker, replacement);
  });

  jq('body').on('click', `[data-btd-action="${TweetActions.DOWNLOAD_MEDIA}"]`, async (ev) => {
    ev.preventDefault();
    const chirp = getChirpFromElement(TD, ev.target)?.chirp;
    if (!chirp) {
      return;
    }
    const media = getMediaFromChirp(chirp);
    const mediaPromises = media.map((item) => {
      return requestMediaItem(item.url);
    });

    const maybeResults = await Promise.all(mediaPromises);

    maybeResults.forEach((file, index) => {
      if (!file) {
        return;
      }

      try {
        saveAs(
          file,
          TD.ui.template.render(
            'btd/download_filename_format',
            getFilenameDownloadData(chirp, media[index].url)
          )
        );
      } catch (e) {
        console.error(e);
      }
    });
  });

  jq('body').on('click', `[data-btd-action="${TweetActions.HOTLINK_MEDIA}"]`, (ev) => {
    ev.preventDefault();
    const chirp = getChirpFromElement(TD, ev.target)?.chirp;
    if (!chirp) {
      return;
    }
    const mediaUrls = getMediaFromChirp(chirp).join('\n');
    navigator.clipboard.writeText(mediaUrls);
  });

  modifyMustacheTemplate(TD, 'stream_item.mustache', (string) =>
    string.replace(
      'data-tweet-id="{{#getMainTweet}}{{id}}{{/getMainTweet}}"',
      'data-tweet-id="{{#getMainTweet}}{{id}}{{/getMainTweet}}" data-tweet-user-id="{{#getMainUser}}{{id}}{{/getMainUser}}{{^getMainUser}}{{targetTweet.user.id}}{{/getMainUser}}"'
    )
  );

  TD.mustaches['text/follow_action.mustache'] =
    '{{^following}} {{_i}}Follow @{{screenName}}{{/i}} {{/following}} {{#following}} {{_i}}Unfollow @{{screenName}}{{/i}} {{/following}}';

  modifyMustacheTemplate(TD, 'status/tweet_single.mustache', (string) =>
    string.replace(
      '{{#isFavorite}}is-favorite{{/isFavorite}}',
      '{{#isFavorite}}is-favorite{{/isFavorite}} {{#getMainUser}}{{#following}}following{{/following}}{{/getMainUser}}'
    )
  );

  modifyMustacheTemplate(TD, 'status/tweet_detail.mustache', (string) =>
    string
      .replace(
        'data-tweet-id="{{#getMainTweet}}{{id}}{{/getMainTweet}}"',
        'data-tweet-id="{{#getMainTweet}}{{id}}{{/getMainTweet}}" data-tweet-user-id="{{getMainUser.id}}"'
      )
      .replace(
        '{{#isFavorite}}is-favorite{{/isFavorite}}',
        '{{#isFavorite}}is-favorite{{/isFavorite}} {{#getMainUser}}{{#following}}following{{/following}}{{/getMainUser}}'
      )
  );

  // Similar to `TD.services.TwitterStatus.prototype.setFavorite`
  TD.services.TwitterUser.prototype.setFollowing = function (following: boolean) {
    this.following = following;
    const addedClass = following ? 'icon-following' : 'icon-follow';
    const removedClass = following ? 'icon-follow' : 'icon-following';
    jq(`[data-tweet-user-id="${this.id}"][data-account-key="${this.account.getKey()}"]`)
      .find('.js-tweet')
      .toggleClass('following', following)
      .find('a[rel="follow"]')
      .attr('title', TD.ui.template.render('text/follow_action', this))
      .find('.js-icon-follow')
      .addClass(addedClass)
      .removeClass(removedClass);
  };

  const findPrefix = mR.findConstructor('findPrefix')[0][1];
  const isFindPrefix = makeIsModuleRaidModule<(n: number, options: unknown) => string>(
    (mod) => typeof mod === 'function'
  );

  if (isFindPrefix(findPrefix)) {
    TD.services.TwitterUser.prototype.prettyFollowersCountInTweetAction = function () {
      return String(findPrefix(this.followersCount, {separator: '', decimals: 0}));
    };
  }

  jq(document).on(
    'dataFollowStateChange',
    (
      _,
      {
        action: {userAction},
        request: {twitterUser},
      }: {action: {userAction: TwitterActionEnum}; request: {twitterUser: TweetDeckUser}}
    ) => {
      if (userAction === 'follow') {
        twitterUser.setFollowing?.(true);
      } else if (userAction === 'unfollow') {
        twitterUser.setFollowing?.(false);
      }
    }
  );

  jq('body').on(
    'click',
    [TweetActions.FOLLOW_ACCOUNT, TweetActions.MUTE_ACCOUNT, TweetActions.BLOCK_ACCOUNT]
      .map((action) => `[data-btd-action="${action}"]`)
      .join(', '),
    (ev) => {
      ev.preventDefault();
      const target = ev.currentTarget;
      if (!isHTMLElement(target)) {
        return;
      }
      const chirp = getChirpFromElement(TD, ev.target)?.chirp;

      if (!chirp) {
        return;
      }
      const usefulChirp = chirp.retweetedStatus ?? chirp.targetTweet ?? chirp;
      const user = usefulChirp.retweetedStatus?.user ?? usefulChirp.user;
      const account = usefulChirp.account;

      const action = target.getAttribute('data-btd-action');

      if (
        action === TweetActions.FOLLOW_ACCOUNT &&
        (settings.showAccountChoiceOnFollow || ev.shiftKey)
      ) {
        jq(document).trigger('uiShowFollowFromOptions', {
          userToFollow: user,
        });
        return;
      }

      switch (action) {
        case TweetActions.FOLLOW_ACCOUNT:
          jq(document).trigger(usefulChirp.user.following ? 'uiUnfollowAction' : 'uiFollowAction', {
            account,
            twitterUser: user,
          });
          return;

        case TweetActions.MUTE_ACCOUNT: {
          const blocked = settings.requireConfirmationForTweetAction
            ? !confirm(`Are you sure you want to mute @${user.screenName}?`)
            : false;
          if (blocked) {
            return;
          }
          jq(document).trigger('uiMuteAction', {
            account,
            twitterUser: user,
          });
          return;
        }

        case TweetActions.BLOCK_ACCOUNT: {
          const blocked = settings.requireConfirmationForTweetAction
            ? !confirm(`Are you sure you want to block @${user.screenName}?`)
            : false;
          if (blocked) {
            return;
          }
          jq(document).trigger('uiBlockAction', {
            account,
            twitterUser: user,
          });
          return;
        }
      }
    }
  );
});
