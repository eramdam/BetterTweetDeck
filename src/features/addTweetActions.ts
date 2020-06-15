import './addTweetActions.css';

import {saveAs} from 'file-saver';

import {isHTMLElement} from '../helpers/domHelpers';
import {modifyMustacheTemplate} from '../helpers/mustacheHelpers';
import {
  getChirpFromElement,
  getFilenameDownloadData,
  getMediaFromChirp,
} from '../helpers/tweetdeckHelpers';
import {makeBTDModule} from '../types/betterTweetDeck/btdCommonTypes';
import {requestMediaItem} from './redraftTweet';

export const maybeAddTweetActions = makeBTDModule(({settings, TD, $}) => {
  const actionItems = settings.tweetActions;
  console.log({actionItems});

  if (!actionItems) {
    return;
  }

  const {
    addCopyMediaLinksAction,
    addMuteAction,
    addBlockAction,
    addDownloadMediaLinksAction,
  } = actionItems;

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

    const muteItem =
      (addMuteAction &&
        `<li class="tweet-detail-action-item btd-tweet-detail-action-item">
      <a class="js-show-tip tweet-detail-action btd-tweet-detail-action btd-clipboard position-rel" href="#"
        data-btd-action="hotlink-media" rel="action" title="Mute {{#getMainTweet}}@{{user.screenName}}{{/getMainTweet}}">
        <i class="icon icon-muted txt-center"></i>
        <span class="is-vishidden"> {{_i}}Mute {{#getMainTweet}}@{{user.screenName}}{{/getMainTweet}}{{/i}} </span>
      </a>
    </li>`) ||
      '';

    const blockItem =
      (addBlockAction &&
        `<li class="tweet-detail-action-item btd-tweet-detail-action-item">
      <a class="js-show-tip tweet-detail-action btd-tweet-detail-action btd-clipboard position-rel" href="#"
        data-btd-action="hotlink-media" rel="hotlink" title="Block {{#getMainTweet}}@{{user.screenName}}{{/getMainTweet}}">
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
    ${muteItem}
    ${blockItem}
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
      <i class="js-icon-attachment icon icon-attachment txt-center txt-size--16 margin-t---1"></i>
      <span class="is-vishidden"> {{_i}}Copy links to media{{/i}} </span>
    </a>
  </li>`) ||
      '';

    const downloadItem =
      (addDownloadMediaLinksAction &&
        `<li class="tweet-action-item btd-tweet-action-item pull-left margin-r--10 margin-l--1">
      <a class="js-show-tip tweet-action btd-tweet-action position-rel" href="#" 
        data-btd-action="download-media" rel="download" title="Download media"> 
        <i class="js-icon icon icon-download txt-center txt-size--16 margin-t---1"></i>
        <span class="is-vishidden"> {{_i}}Download media{{/i}} </span>
      </a>
    </li>`) ||
      '';

    const muteItem =
      (addMuteAction &&
        `<li class="tweet-action-item btd-tweet-action-item pull-left margin-r--10 margin-l--1">
    <a class="js-show-tip tweet-action btd-tweet-action btd-clipboard position-rel" href="#" 
      data-btd-action="mute-account" rel="action" title="Mute {{#getMainTweet}}@{{user.screenName}}{{/getMainTweet}}"> 
      <i class="js-icon-attachment icon icon-muted txt-center txt-size--16 margin-t---1"></i>
      <span class="is-vishidden"> {{_i}}Mute {{#getMainTweet}}@{{user.screenName}}{{/getMainTweet}}{{/i}} </span>
    </a>
  </li>`) ||
      '';

    const blockItem =
      (addBlockAction &&
        `<li class="tweet-action-item btd-tweet-action-item pull-left margin-r--10 margin-l--1">
  <a class="js-show-tip tweet-action btd-tweet-action btd-clipboard position-rel" href="#" 
    data-btd-action="block-account" rel="action" title="Block {{#getMainTweet}}@{{user.screenName}}{{/getMainTweet}}"> 
    <i class="js-icon-attachment icon icon-blocked txt-center txt-size--16 margin-t---1"></i>
    <span class="is-vishidden"> {{_i}}Block {{#getMainTweet}}@{{user.screenName}}{{/getMainTweet}}{{/i}} </span>
  </a>
</li>`) ||
      '';

    const replacement = `${marker}
      {{#tweet.entities.media.length}}
      ${copyMediaItem}
      ${downloadItem}
      {{/tweet.entities.media.length}}
      ${muteItem}
      ${blockItem}
      `;

    return string.replace(marker, replacement);
  });

  $('body').on('click', '[data-btd-action="download-media"]', (ev) => {
    ev.preventDefault();
    const chirp = getChirpFromElement(TD, ev.target);
    if (!chirp) {
      return;
    }
    const media = getMediaFromChirp(chirp);

    media.forEach((item) => {
      requestMediaItem(item).then((blob) => {
        saveAs(
          blob,
          TD.ui.template.render(
            'btd/download_filename_format',
            getFilenameDownloadData(chirp, item)
          )
        );
      });
    });
  });

  $('body').on('click', '[data-btd-action="hotlink-media"]', (ev) => {
    ev.preventDefault();
    const chirp = getChirpFromElement(TD, ev.target);
    if (!chirp) {
      return;
    }
    const mediaUrls = getMediaFromChirp(chirp).join('\n');
    navigator.clipboard.writeText(mediaUrls);
  });

  $('body').on(
    'click',
    '[data-btd-action="mute-account"], [data-btd-action="block-account"]',
    (ev) => {
      ev.preventDefault();
      const target = ev.target;
      if (!isHTMLElement(target)) {
        return;
      }
      let chirp = getChirpFromElement(TD, ev.target);
      if (!chirp) {
        return;
      }
      chirp = chirp.targetTweet ? chirp.targetTweet : chirp;
      const user = chirp.retweetedStatus ? chirp.retweetedStatus.user : chirp.user;
      const account = chirp.account;

      const action = target.getAttribute('data-btd-action');

      if (action === 'mute-account') {
        $(document).trigger('uiMuteAction', {
          account,
          twitterUser: user,
        });
      } else if (action === 'block-account') {
        $(document).trigger('uiBlockAction', {
          account,
          twitterUser: user,
        });
      }
    }
  );
});
