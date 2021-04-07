import {Dictionary} from 'lodash';

import {createSelectorForChirp, getChirpFromKey} from '../helpers/tweetdeckHelpers';
import {hasProperty} from '../helpers/typeHelpers';
import {onVisibleChirpAdded} from '../services/chirpHandler';
import {makeBTDModule} from '../types/btdCommonTypes';
import {
  TweetDeckChirp,
  TweetDeckColumn,
  TweetDeckColumnMediaPreviewSizesEnum,
} from '../types/tweetdeckTypes';

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

  const observer = new IntersectionObserver((entries, thisObserver) => {
    const allColumns = TD.controller.columnManager.getAllOrdered();

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

      allColumns.forEach((c) => {
        c.ui.teardownCard(chirpKey);
      });

      thisObserver.unobserve(entry.target);
    });
  });

  onVisibleChirpAdded((payload) => {
    if (payload.columnMediaSize === TweetDeckColumnMediaPreviewSizesEnum.OFF) {
      return;
    }

    const cardContainer = jq(
      `${createSelectorForChirp(payload.chirp, payload.columnKey)} .js-card-container`
    );
    const chirpNode = jq(`${createSelectorForChirp(payload.chirp, payload.columnKey)}`);

    if (chirpNode.closest('.js-tweet-detail.tweet-detail-wrapper').length) {
      return;
    }

    // If we already have a card, nothing to do.
    if (cardContainer.has('iframe').length) {
      return;
    }

    // The chirp returned by the chirp handler is a simplified version without its prototype.
    // The prototype is required by `renderCardForChirp` later on.
    const baseChirp = getChirpFromKey(TD, payload.chirp.id, payload.columnKey);

    // In the case of a reply, we want the `targetTweet`, as the chirp itself is just a notification
    const actualChirp = baseChirp?.targetTweet ? baseChirp.targetTweet : baseChirp;

    if (!actualChirp || !actualChirp.card || !renderCardForChirpModule || !getColumnTypeModule) {
      return;
    }

    // Cards on private users won't load.
    if (!actualChirp.user || actualChirp.user.isProtected) {
      return;
    }

    const column = TD.controller.columnManager.get(payload.columnKey);

    const columnType = getColumnTypeModule.getColumnType(column);
    const scribeNamespace = getColumnTypeModule.columnMetaTypeToScribeNamespace[columnType];

    if (!scribeNamespace) {
      return;
    }

    // Observer the card container to remove the card when it gets out of the view
    observer.observe(cardContainer[0]);

    renderCardForChirpModule.renderCardForChirp(actualChirp, cardContainer, {
      context: 'detail',
      scribeNamespace,
    });
  });
});
