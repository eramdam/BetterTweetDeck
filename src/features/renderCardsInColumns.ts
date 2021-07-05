import './renderCardsInColumns.css';

import {Dictionary} from 'lodash';

import {modifyMustacheTemplate} from '../helpers/mustacheHelpers';
import {createSelectorForChirp, getChirpFromKey} from '../helpers/tweetdeckHelpers';
import {hasProperty} from '../helpers/typeHelpers';
import {ChirpAddedPayload, onChirpAdded, onVisibleChirpAdded} from '../services/chirpHandler';
import {makeBTDModule} from '../types/btdCommonTypes';
import {
  TweetDeckChirp,
  TweetDeckColumn,
  TweetDeckColumnMediaPreviewSizesEnum,
  TweetDeckObject,
  TwitterStatus,
} from '../types/tweetdeckTypes';

const allowedCardNames = [
  '3260518932:moment',
  'poll2choice_text_only',
  'poll3choice_text_only',
  'poll4choice_text_only',
  'summary',
  'summary_large_image',
  '3691233323:periscope_broadcast',
  'audio',
  'player',
  '745291183405076480:live_event',
  '745291183405076480:live_video',
];

export const maybeRenderCardsInColumns = makeBTDModule((options) => {
  const {mR, TD, settings, jq} = options;

  if (!settings.showCardsInsideColumns) {
    return;
  }

  type RenderCardForChirp = (
    chirp: TweetDeckChirp,
    targetNode: JQuery<HTMLElement>,
    params: object
  ) => void;

  const renderCardForChirpModule = Array.from(
    (mR && mR.findFunction('renderCardForChirp')) || []
  ).find((maybeModule) => {
    if (
      hasProperty(maybeModule, 'renderCardForChirp') &&
      typeof maybeModule.renderCardForChirp === 'function'
    ) {
      return true;
    }

    return false;
  }) as
    | {
        renderCardForChirp: RenderCardForChirp;
      }
    | undefined;

  const getColumnTypeModule:
    | {
        getColumnType: (col: TweetDeckColumn) => string;
        columnMetaTypeToScribeNamespace: Dictionary<object>;
      }
    | undefined = mR && mR.findFunction('getColumnType')[0];

  if (!renderCardForChirpModule || !getColumnTypeModule) {
    return;
  }

  document.body.setAttribute('btd-render-cards', 'true');
  document.body.setAttribute(
    'btd-render-small-cards',
    String(settings.showCardsInSmallMediaColumns)
  );

  TD.services.TwitterStatus.prototype.hasEligibleCard = function () {
    return statusHasEligibleCard(this);
  };
  TD.services.TwitterActionOnTweet.prototype.hasEligibleCard = function () {
    return statusHasEligibleCard(this);
  };

  modifyMustacheTemplate(TD, 'status/tweet_single.mustache', (string) => {
    return string.replace(
      '<div class',
      '<div {{#hasEligibleCard}}btd-card="{{card.name}}"{{/hasEligibleCard}} class'
    );
  });

  const observer = new IntersectionObserver(
    (entries, thisObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          return;
        }

        const chirpNode = entry.target.closest('[data-key]');

        if (!chirpNode) {
          return;
        }

        const chirpKey = chirpNode.getAttribute('data-key');

        if (!chirpKey) {
          return;
        }

        const columnNode = chirpNode.closest('[data-column]');

        if (columnNode) {
          const columnKey = columnNode.getAttribute('data-column');

          const column = TD.controller.columnManager.get(columnKey || '');

          if (column) {
            column.ui.teardownCard(chirpKey);
          }
        } else {
          const allColumns = TD.controller.columnManager.getAllOrdered();

          allColumns.forEach((c) => {
            if (!c.updateIndex || !c.updateIndex[chirpKey]) {
              return;
            }

            c.ui.teardownCard(chirpKey);
          });
        }

        thisObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0,
    }
  );

  onChirpAdded((payload) => {
    const chirpNodes = jq(`${createSelectorForChirp(payload.chirp, payload.columnKey)}`);

    if (!chirpNodes.closest('.js-detail-content > div:not(.tweet-detail-wrapper)').length) {
      return;
    }

    chirpNodes.toArray().forEach((node) => {
      maybeRenderCardForChirp(TD, payload, jq(node), true);
    });
  });

  onVisibleChirpAdded(async (payload) => {
    if (
      payload.columnMediaSize === TweetDeckColumnMediaPreviewSizesEnum.OFF ||
      (payload.columnMediaSize === TweetDeckColumnMediaPreviewSizesEnum.SMALL &&
        !settings.showCardsInSmallMediaColumns)
    ) {
      return;
    }

    const chirpNodes = jq(`${createSelectorForChirp(payload.chirp, payload.columnKey)}`);

    if (chirpNodes.closest('.js-tweet-detail.tweet-detail-wrapper').length) {
      return;
    }

    chirpNodes.toArray().forEach((node) => {
      maybeRenderCardForChirp(TD, payload, jq(node), true);
    });
  });

  function maybeRenderCardForChirp(
    TD: TweetDeckObject,
    payload: ChirpAddedPayload,
    chirpNode: JQuery<HTMLElement>,
    renderInvisible?: boolean
  ) {
    if (!getColumnTypeModule || !renderCardForChirpModule) {
      return;
    }

    const cardContainer = chirpNode.find(`.js-card-container`);
    const mediaPreview = chirpNode.find('.js-media');

    // If we already have a card, nothing to do.
    if (
      (cardContainer.has('iframe').length || mediaPreview.length) &&
      !chirpNode.find('[btd-card]').length
    ) {
      chirpNode.find('[btd-card]').removeAttr('btd-card');
      return;
    }

    // The chirp returned by the chirp handler is a simplified version without its prototype.
    // The prototype is required by `renderCardForChirp` later on.
    const baseChirpWithPrototype = getChirpFromKey(TD, payload.chirp.id, payload.columnKey);

    // Check if the base chirp has a card we can render.
    if (!baseChirpWithPrototype?.hasEligibleCard || !baseChirpWithPrototype?.hasEligibleCard()) {
      chirpNode.find('[btd-card]').removeAttr('btd-card');
      return;
    }

    const column = TD.controller.columnManager.get(payload.columnKey);

    const columnType = getColumnTypeModule.getColumnType(column);
    const scribeNamespace = getColumnTypeModule.columnMetaTypeToScribeNamespace[columnType];

    if (!scribeNamespace) {
      return;
    }

    // If the chirp is out of the view, don't render the card.
    if (isNodeIsOutsideOfTheViewport(chirpNode[0]) && !renderInvisible) {
      return;
    }

    // Observer the card container to remove the card when it gets out of the view
    observer.observe(chirpNode[0]);

    const chirpToLoadCardFor = baseChirpWithPrototype?.targetTweet
      ? baseChirpWithPrototype.targetTweet
      : baseChirpWithPrototype;

    renderCardForChirpModule.renderCardForChirp(chirpToLoadCardFor, cardContainer, {
      context: 'detail',
      scribeNamespace,
    });
  }
});

function isNodeIsOutsideOfTheViewport(node: HTMLElement) {
  const rect = node.getBoundingClientRect();
  return (
    rect.left > window.innerWidth ||
    rect.left < 0 ||
    rect.top > window.innerHeight ||
    rect.top < 0 ||
    rect.x < 0 ||
    rect.y < 0
  );
}

const youtube_re =
  /(?:(?:https?:\/\/)?(?:www\.)?)?youtube\.com\/watch[a-zA-Z0-9_\-?&=/]+|(http:\/\/|www.)?youtu\.be\/([a-zA-Z0-9_\-?&=/]+)/;

function statusHasEligibleCard(status: TwitterStatus['prototype']) {
  const hasYoutube = status.entities?.urls.some((u) => u.expanded_url.match(youtube_re));
  const cardName =
    status.targetTweet && !status.isAboutYou() ? status.targetTweet.card?.name : status.card?.name;
  const user = status.targetTweet ? status.targetTweet.user : status.user;

  return (
    !hasYoutube &&
    user &&
    !user.isProtected &&
    allowedCardNames.includes(cardName || '') &&
    !status.quotedTweet
  );
}
