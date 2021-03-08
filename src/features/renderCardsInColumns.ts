import {Dictionary} from 'lodash';
import moduleraid from 'moduleraid';

import {createSelectorForChirp, getChirpFromKey} from '../helpers/tweetdeckHelpers';
import {hasProperty} from '../helpers/typeHelpers';
import {onVisibleChirpAdded} from '../inject/chirpHandler';
import {BTDModuleOptions} from '../types/betterTweetDeck/btdCommonTypes';
import {TweetDeckChirp, TweetDeckColumn} from '../types/tweetdeckTypes';

export function maybeRenderCardsInColumns(
  options: BTDModuleOptions & {
    mR: moduleraid;
  }
) {
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

  onVisibleChirpAdded((payload) => {
    const cardContainer = jq(
      `${createSelectorForChirp(payload.chirp, payload.columnKey)} .js-card-container`
    );

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

    renderCardForChirpModule.renderCardForChirp(actualChirp, cardContainer, {
      context: 'detail',
      scribeNamespace,
    });
  });
}
