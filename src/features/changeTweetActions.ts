import './changeTweetActions.css';

import {isHTMLElement} from '../helpers/domHelpers';
import {modifyMustacheTemplate} from '../helpers/mustacheHelpers';
import {getChirpFromElement} from '../helpers/tweetdeckHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';

export enum BTDTweetActionsPosition {
  LEFT = 'left',
  RIGHT = 'right',
}

export const changeTweetActionsStyling = makeBTDModule(({settings, jq, TD}) => {
  document.body.setAttribute('btd-tweet-actions-position', settings.tweetActionsPosition);
  document.body.setAttribute(
    'btd-show-tweet-actions-on-hover',
    String(settings.showTweetActionsOnHover)
  );

  if (settings.showAccountChoiceOnFavorite) {
    const usernamesAllowlist = settings.accountChoiceAllowList
      .split(',')
      .map((t) => t.trim().replace('@', '').toLowerCase())
      .filter(Boolean);

    jq(document).on('click', '.tweet-footer [rel="favorite"]', (e) => {
      const chirp = getChirpFromElement(TD, e.target);

      if (!chirp || !isHTMLElement(e.target) || !e.target.closest('.stream-item')) {
        return;
      }

      const usefulChirp = chirp.chirp.targetTweet || chirp.chirp;

      e.stopImmediatePropagation();
      e.stopPropagation();
      e.preventDefault();

      if (
        usernamesAllowlist.includes(usefulChirp.account.state.username.toLowerCase()) ||
        usernamesAllowlist.length === 0
      ) {
        jq(document).trigger('uiShowFavoriteFromOptions', {
          tweet: usefulChirp,
        });
        return;
      }

      usefulChirp.favorite({
        element: jq(e.target.closest('.stream-item')!),
        statusKey: usefulChirp.id,
        column: chirp.extra.columnKey,
      });
    });
  }

  if (settings.separateTweetAndQuoteTweetActions) {
    modifyMustacheTemplate(TD, 'status/tweet_single_actions.mustache', (string) => {
      const retweetOnlyItem = `<li class="tweet-action-item pull-left margin-r--10 {{#isProtected}}is-protected-action{{/isProtected}}">
  <a class="tweet-action {{#isProtected}}no-pointer-events{{/isProtected}}" href="#"
    data-btd-action="retweet-only" rel="retweet-only" title="Retweet only">
    <i class="js-icon-retweet icon icon-retweet{{#isRetweeted}}-filled{{/isRetweeted}} icon-retweet-toggle txt-center {{#withPrettyEngagements}}pull-left{{/withPrettyEngagements}}"></i>
    {{#withPrettyEngagements}}
    <span class="pull-right icon-retweet-toggle margin-l--3 margin-t--1 txt-size--12 js-retweet-count retweet-count">
      {{#prettyRetweetCount}}{{prettyRetweetCount}}{{/prettyRetweetCount}}
    </span>
    {{/withPrettyEngagements}}
    <span class="is-vishidden">{{_i}}Retweet{{/i}}</span>
  </a>
</li>`;

      const marker = '{{#getMainUser}}';
      return string
        .replace(
          'js-icon-retweet icon icon-retweet{{#isRetweeted}}-filled{{/isRetweeted}} icon-retweet-toggle txt-center {{#withPrettyEngagements}}pull-left{{/withPrettyEngagements}}',
          'icon icon-quote txt-center'
        )
        .replace(
          '{{#withPrettyEngagements}} <span class="pull-right icon-retweet-toggle margin-l--3 margin-t--1 txt-size--12 js-retweet-count retweet-count">{{#prettyRetweetCount}}{{prettyRetweetCount}}{{/prettyRetweetCount}}</span> {{/withPrettyEngagements}}',
          ''
        )
        .replace(marker, `${marker}${retweetOnlyItem}`);
    });

    modifyMustacheTemplate(TD, 'status/tweet_detail_actions.mustache', (string) => {
      const retweetOnlyItem = `<li class="tweet-detail-action-item {{#isProtected}}is-protected-action{{/isProtected}}">
  <a class="tweet-detail-action {{#isProtected}}no-pointer-events{{/isProtected}}" href="#"
    data-btd-action="retweet-only" rel="retweet-only" title="Retweet only">
    <i class="js-icon-retweet icon icon-retweet{{#isRetweeted}}-filled{{/isRetweeted}} icon-retweet-toggle"></i>
    <span class="is-vishidden">{{_i}}Retweet{{/i}}</span>
  </a>
</li>`;

      const marker = '{{#getMainUser}}';
      return string
        .replace(
          'js-icon-retweet icon icon-retweet{{#isRetweeted}}-filled{{/isRetweeted}} icon-retweet-toggle',
          'icon icon-quote'
        )
        .replace(marker, `${marker}${retweetOnlyItem}`);
    });

    jq('body').on('click', '[data-btd-action="retweet-only"]', (ev) => {
      ev.preventDefault();
      const chirp = getChirpFromElement(TD, ev.target);

      if (!chirp) {
        return;
      }

      const usefulChirp = chirp.chirp.targetTweet || chirp.chirp;

      if (!usefulChirp.isRetweeted) {
        jq(document).trigger('uiRetweet', {
          id: usefulChirp.id,
          from: [usefulChirp.account.getKey()],
        });
        jq(document).on('dataRetweetSuccess', () => {
          usefulChirp.setRetweeted(true);
        });
      } else {
        jq(document).trigger('uiUndoRetweet', {
          tweetId: usefulChirp.id,
          from: usefulChirp.account.getKey(),
        });
        jq(document).trigger('dataUndoRetweetSuccess', () => {
          usefulChirp.setRetweeted(false);
        });
      }
    });
  }
});
