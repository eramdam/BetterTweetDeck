import './addTweetActions.css';

import {saveAs} from 'file-saver';

import {isHTMLElement} from '../helpers/domHelpers';
import {modifyMustacheTemplate} from '../helpers/mustacheHelpers';
import {
  getChirpFromElement,
  getFilenameDownloadData,
  getMediaFromChirp,
} from '../helpers/tweetdeckHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';
import {requestMediaItem} from './redraftTweet';

export const maybeAddTweetActions = makeBTDModule(({settings, TD, jq}) => {
  const actionItems = settings.tweetActions;

  if (!actionItems) {
    return;
  }

  const {
    addCopyMediaLinksAction,
    addFollowAction,
    addMuteAction,
    addBlockAction,
    addDownloadMediaLinksAction,
  } = actionItems;

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
      data-btd-action="hotlink-media" rel="hotlink" title="Copy links to media">
      <i class="js-icon-attachment icon icon-attachment txt-center"></i>
      <span class="is-vishidden"> {{_i}}Copy links to media{{/i}} </span>
    </a>
  </li>`) ||
      '';

    const downloadMediaItem =
      (addDownloadMediaLinksAction &&
        `<li class="tweet-detail-action-item btd-tweet-detail-action-item">
      <a class="js-show-tip tweet-detail-action btd-tweet-detail-action position-rel" href="#"
        data-btd-action="download-media" rel="download" title="Download media">
        <i class="js-icon icon icon-download txt-center"></i>
        <span class="is-vishidden"> {{_i}}Download media{{/i}} </span>
      </a>
    </li>`) ||
      '';

    const followItem =
      (addFollowAction &&
        `<li class="tweet-detail-action-item btd-tweet-detail-action-item">
  <a class="js-show-tip tweet-detail-action btd-tweet-detail-action position-rel" href="#"
    data-btd-action="{{^following}}follow{{/following}}{{#following}}unfollow{{/following}}-account" rel="action" title="{{^following}}Follow{{/following}}{{#following}}Unfollow{{/following}} @{{screenName}}">
    <i class="js-icon icon icon-{{^following}}follow{{/following}}{{#following}}following{{/following}} txt-center"></i>
    <span class="is-vishidden"> {{_i}}{{^following}}Follow{{/following}}{{#following}}Unfollow{{/following}} @{{screenName}}{{/i}} </span>
  </a>
</li>`) ||
      '';

    const muteItem =
      (addMuteAction &&
        `<li class="tweet-detail-action-item btd-tweet-detail-action-item">
      <a class="js-show-tip tweet-detail-action btd-tweet-detail-action position-rel" href="#"
        data-btd-action="mute-account" rel="action" title="Mute {{#getMainTweet}}@{{user.screenName}}{{/getMainTweet}}">
        <i class="icon icon-muted txt-center"></i>
        <span class="is-vishidden"> {{_i}}Mute {{#getMainTweet}}@{{user.screenName}}{{/getMainTweet}}{{/i}} </span>
      </a>
    </li>`) ||
      '';

    const blockItem =
      (addBlockAction &&
        `<li class="tweet-detail-action-item btd-tweet-detail-action-item">
      <a class="js-show-tip tweet-detail-action btd-tweet-detail-action position-rel" href="#"
        data-btd-action="block-account" rel="hotlink" title="Block {{#getMainTweet}}@{{user.screenName}}{{/getMainTweet}}">
        <i class="icon icon-blocked txt-center"></i>
        <span class="is-vishidden"> {{_i}}Block {{#getMainTweet}}@{{user.screenName}}{{/getMainTweet}}{{/i}} </span>
      </a>
    </li>`) ||
      '';

    const replacement = `${marker}{{#getMainTweet}}
    {{#entities.media.length}}
    ${copyMediaItem}
    ${downloadMediaItem}
    {{/entities.media.length}}
    {{#user}}
    ${followItem}
    ${muteItem}
    ${blockItem}
    {{/user}}
    {{/getMainTweet}}`;

    return string.replace(marker, replacement);
  });

  modifyMustacheTemplate(TD, 'status/tweet_single_actions.mustache', (string) => {
    const marker = '{{_i}}Like{{/i}} </span> </a> </li>';

    const copyMediaItem =
      (addCopyMediaLinksAction &&
        `<li class="tweet-action-item btd-tweet-action-item pull-left margin-r--10 margin-l--1">
    <a class="js-show-tip tweet-action btd-tweet-action btd-clipboard position-rel" href="#" 
      data-btd-action="hotlink-media" rel="hotlink" title="Copy links to media"> 
      <i class="js-icon-attachment icon icon-attachment txt-center margin-t---1"></i>
      <span class="is-vishidden"> {{_i}}Copy links to media{{/i}} </span>
    </a>
  </li>`) ||
      '';

    const downloadItem =
      (addDownloadMediaLinksAction &&
        `<li class="tweet-action-item btd-tweet-action-item pull-left margin-r--10 margin-l--1">
      <a class="js-show-tip tweet-action btd-tweet-action position-rel" href="#" 
        data-btd-action="download-media" rel="download" title="Download media"> 
        <i class="js-icon icon icon-download txt-center margin-t---1"></i>
        <span class="is-vishidden"> {{_i}}Download media{{/i}} </span>
      </a>
    </li>`) ||
      '';

    const followItem =
      (addFollowAction &&
        `<li class="tweet-action-item btd-tweet-action-item pull-left margin-r--10 margin-l--1">
  <a class="js-show-tip tweet-action btd-tweet-action btd-clipboard position-rel" href="#" 
    data-btd-action="{{^following}}follow{{/following}}{{#following}}unfollow{{/following}}-account" rel="action" title="{{^following}}Follow{{/following}}{{#following}}Unfollow{{/following}} @{{screenName}}"> 
    <i class="js-icon-follow icon icon-{{^following}}follow{{/following}}{{#following}}following{{/following}} txt-center margin-t---1"></i>
    <span class="is-vishidden"> {{_i}}{{^following}}Follow{{/following}}{{#following}}Unfollow{{/following}} @{{screenName}}{{/i}} </span>
  </a>
</li>`) ||
      '';

    const muteItem =
      (addMuteAction &&
        `<li class="tweet-action-item btd-tweet-action-item pull-left margin-r--10 margin-l--1">
    <a class="js-show-tip tweet-action btd-tweet-action btd-clipboard position-rel" href="#" 
      data-btd-action="mute-account" rel="action" title="Mute {{#getMainTweet}}@{{user.screenName}}{{/getMainTweet}}"> 
      <i class="js-icon-attachment icon icon-muted txt-center margin-t---1"></i>
      <span class="is-vishidden"> {{_i}}Mute {{#getMainTweet}}@{{user.screenName}}{{/getMainTweet}}{{/i}} </span>
    </a>
  </li>`) ||
      '';

    const blockItem =
      (addBlockAction &&
        `<li class="tweet-action-item btd-tweet-action-item pull-left margin-r--10 margin-l--1">
  <a class="js-show-tip tweet-action btd-tweet-action btd-clipboard position-rel" href="#" 
    data-btd-action="block-account" rel="action" title="Block {{#getMainTweet}}@{{user.screenName}}{{/getMainTweet}}"> 
    <i class="js-icon-attachment icon icon-blocked txt-center margin-t---1"></i>
    <span class="is-vishidden"> {{_i}}Block {{#getMainTweet}}@{{user.screenName}}{{/getMainTweet}}{{/i}} </span>
  </a>
</li>`) ||
      '';

    const replacement = `${marker}{{#getMainTweet}}
      {{#tweet.entities.media.length}}
      ${copyMediaItem}
      ${downloadItem}
      {{/tweet.entities.media.length}}
      {{#user}}
      ${followItem}
      ${muteItem}
      ${blockItem}
      {{/user}}
      {{/getMainTweet}}`;

    return string.replace(marker, replacement);
  });

  jq('body').on('click', '[data-btd-action="download-media"]', (ev) => {
    ev.preventDefault();
    const chirp = getChirpFromElement(TD, ev.target)?.chirp;
    if (!chirp) {
      return;
    }
    const media = getMediaFromChirp(chirp);

    media.forEach((item) => {
      requestMediaItem(item).then((file) => {
        if (!file) {
          return;
        }
        try {
          saveAs(
            file,
            TD.ui.template.render(
              'btd/download_filename_format',
              getFilenameDownloadData(chirp, item)
            )
          );
        } catch (e) {
          console.error(e);
        }
      });
    });
  });

  jq('body').on('click', '[data-btd-action="hotlink-media"]', (ev) => {
    ev.preventDefault();
    const chirp = getChirpFromElement(TD, ev.target)?.chirp;
    if (!chirp) {
      return;
    }
    const mediaUrls = getMediaFromChirp(chirp).join('\n');
    navigator.clipboard.writeText(mediaUrls);
  });

  jq('body').on(
    'click',
    '[data-btd-action="follow-account"], [data-btd-action="unfollow-account"], [data-btd-action="mute-account"], [data-btd-action="block-account"]',
    (ev) => {
      ev.preventDefault();
      const target = ev.currentTarget;
      if (!isHTMLElement(target)) {
        return;
      }
      let chirp = getChirpFromElement(TD, ev.target)?.chirp;

      if (!chirp) {
        return;
      }
      chirp = chirp.targetTweet ? chirp.targetTweet : chirp;
      const user = chirp.retweetedStatus ? chirp.retweetedStatus.user : chirp.user;
      const account = chirp.account;

      const action = target.getAttribute('data-btd-action');

      if (ev.shiftKey && (action === 'follow-account' || action === 'unfollow-account')) {
        jq(document).trigger('uiShowFollowFromOptions', {
          userToFollow: user,
        });
        return;
      }

      switch (action) {
        case 'follow-account':
          jq(document).trigger('uiFollowAction', {
            account,
            twitterUser: user,
          });
          return;
        case 'unfollow-account':
          jq(document).trigger('uiUnfollowAction', {
            account,
            twitterUser: user,
          });
          return;
        case 'mute-account':
          jq(document).trigger('uiMuteAction', {
            account,
            twitterUser: user,
          });
          return;
        case 'block-account':
          jq(document).trigger('uiBlockAction', {
            account,
            twitterUser: user,
          });
          return;
      }
    }
  );
});
