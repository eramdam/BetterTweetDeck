import {Dictionary} from 'lodash';

import {createSelectorForChirp, getChirpFromKey} from '../helpers/tweetdeckHelpers';
import {hasProperty} from '../helpers/typeHelpers';
import {onVisibleChirpAdded} from '../services/chirpHandler';
import {makeBTDModule} from '../types/btdCommonTypes';
import {
  TweetDeckChirp,
  TweetDeckColumn,
  TweetDeckColumnMediaPreviewSizesEnum,
  TwitterActionEnum,
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

  const observer = new IntersectionObserver(
    (entries, thisObserver) => {
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
          if (!c.updateIndex[chirpKey]) {
            return;
          }

          c.ui.teardownCard(chirpKey);
        });

        thisObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0,
    }
  );

  onVisibleChirpAdded(async (payload) => {
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
    const isEligibleNotification =
      payload.chirpExtra.action === TwitterActionEnum.MENTION ||
      payload.chirpExtra.action === TwitterActionEnum.REPLY;
    const actualChirp =
      baseChirp?.targetTweet && isEligibleNotification ? baseChirp.targetTweet : baseChirp;

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

    // Wait a bit, if the user's timeline goes very fast, we can avoid rendering anything at all.
    await delayAsync(200);

    // If the chirp is out of the view, don't render the card.
    if (isNodeIsOutsideOfTheViewport(chirpNode[0])) {
      return;
    }

    // Observer the card container to remove the card when it gets out of the view
    observer.observe(chirpNode[0]);

    renderCardForChirpModule.renderCardForChirp(actualChirp, cardContainer, {
      context: 'detail',
      scribeNamespace,
    });
  });
});

function isNodeIsOutsideOfTheViewport(node: HTMLElement) {
  const rect = node.getBoundingClientRect();
  return (
    rect.left > window.innerWidth ||
    rect.left < 0 ||
    rect.top > window.innerHeight ||
    rect.top < 0 ||
    rect.top + rect.height > window.innerHeight ||
    rect.left + rect.width > window.innerWidth ||
    rect.x < 0 ||
    rect.y < 0
  );
}

function delayAsync(number = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, number);
  });
}
