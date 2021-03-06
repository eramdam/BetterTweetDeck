import {Dictionary} from 'lodash';
import moduleraid from 'moduleraid';

import {createSelectorForChirp, getChirpFromKey} from '../helpers/tweetdeckHelpers';
import {hasProperty} from '../helpers/typeHelpers';
import {onChirpAdded} from '../inject/chirpHandler';
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

  onChirpAdded((payload) => {
    // The chirp returned by the chirp handler is a simplified version without its prototype.
    const actualChirp = getChirpFromKey(TD, payload.chirp.id, payload.columnKey);

    if (
      !actualChirp ||
      !actualChirp.card ||
      !jq ||
      !renderCardForChirpModule ||
      !getColumnTypeModule
    ) {
      return;
    }

    // Cards on private users won't load.
    if (actualChirp.user.isProtected) {
      return;
    }

    const column = TD.controller.columnManager.get(payload.columnKey);

    if (!column) {
      return;
    }

    const columnType = getColumnTypeModule.getColumnType(column);
    const scribeNamespace = getColumnTypeModule.columnMetaTypeToScribeNamespace[columnType];

    if (!scribeNamespace) {
      return;
    }

    renderCardForChirpModule.renderCardForChirp(
      actualChirp,
      jq(`${createSelectorForChirp(actualChirp, payload.columnKey)} .js-card-container`),
      {
        context: 'detail',
        scribeNamespace,
      }
    );
  });
}
