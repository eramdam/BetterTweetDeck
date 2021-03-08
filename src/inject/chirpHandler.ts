import {compact} from 'lodash';

import {getRandomString, isHTMLElement} from '../helpers/domHelpers';
import {decorateChirp, getChirpFromElement, getURLsFromChirp} from '../helpers/tweetdeckHelpers';
import {HandlerOf} from '../helpers/typeHelpers';
import {BTDModalUuidAttribute, BTDUuidAttribute} from '../types/betterTweetDeck/btdCommonTypes';
import {
  TweetDeckChirp,
  TweetDeckColumnMediaPreviewSizesEnum,
  TweetDeckObject,
} from '../types/tweetdeckTypes';
import {getSizeForColumnKey} from './columnMediaSizeMonitor';

export interface ChirpAddedPayload {
  uuid: string;
  chirp: TweetDeckChirp;
  columnMediaSize: TweetDeckColumnMediaPreviewSizesEnum;
  columnKey: string;
}

export interface ChirpRemovedPayload {
  uuidArray: string[];
}

type SetupChirpHandler = (TD: TweetDeckObject, jq: JQueryStatic) => void;

let isObserverSetup = false;
const onRemoveCallbacks = new Set<HandlerOf<ChirpRemovedPayload>>();
const onDomAddCallbacks = new Set<HandlerOf<ChirpAddedPayload>>();
const onVisibleCallbacks = new Set<HandlerOf<ChirpAddedPayload>>();

export function onChirpAdded(cb: HandlerOf<ChirpAddedPayload>) {
  if (!isObserverSetup) {
    throw new Error('call `setupChirpHandler` first!');
  }
  onDomAddCallbacks.add(cb);
}

export function onVisibleChirpAdded(cb: HandlerOf<ChirpAddedPayload>) {
  if (!isObserverSetup) {
    throw new Error('call `setupChirpHandler` first!');
  }
  onVisibleCallbacks.add(cb);
}

export function onChirpRemove(cb: HandlerOf<ChirpRemovedPayload>) {
  if (!isObserverSetup) {
    throw new Error('call `setupChirpHandler` first!');
  }
  onRemoveCallbacks.add(cb);
}

export const setupChirpHandler: SetupChirpHandler = (TD, jq) => {
  const mutObserver = new MutationObserver((mutations) =>
    mutations.forEach((mutation) => {
      const hasAddHandlers = onDomAddCallbacks.size > 0;
      const hasRemoveHandlers = onRemoveCallbacks.size > 0;

      if (hasAddHandlers) {
        Array.from(mutation.addedNodes)
          .filter((addedEl) => {
            if (
              !isHTMLElement(addedEl) ||
              addedEl.closest('[' + BTDUuidAttribute + ']') ||
              addedEl.matches('[' + BTDUuidAttribute + ']') ||
              addedEl.closest('[' + BTDModalUuidAttribute + ']') ||
              addedEl.matches('[' + BTDModalUuidAttribute + ']')
            ) {
              return false;
            }

            return true;
          })
          .forEach((element) => {
            if (!isHTMLElement(element)) {
              return;
            }

            if (element.closest('.js-tweet-detail.tweet-detail-wrapper')) {
              return;
            }

            if (element.closest('[data-key]')) {
              const chirp = getChirpFromElement(TD, element);

              if (!chirp) {
                return;
              }

              const urls = getURLsFromChirp(chirp);
              const uuid = getRandomString();

              element.setAttribute(BTDUuidAttribute, uuid);

              const payload = {
                uuid,
                chirp: JSON.parse(JSON.stringify(chirp)),
                urls: (urls || []).map((e) => e.expanded_url),
                columnKey: chirp._btd?.columnKey || '',
                columnMediaSize: getSizeForColumnKey(chirp._btd?.columnKey),
              };

              onDomAddCallbacks.forEach((cb) => {
                cb(payload);
              });
            }
          });
      }

      if (hasRemoveHandlers) {
        Array.from(mutation.removedNodes)
          .filter((removedEl) => {
            if (!isHTMLElement(removedEl)) {
              return false;
            }

            const btdNode = removedEl.closest('[' + BTDUuidAttribute + ']');

            if (!btdNode) {
              return false;
            }

            return true;
          })
          .filter((i) => !!i)
          .forEach((removedEl) => {
            if (!isHTMLElement(removedEl)) {
              return;
            }

            const btdNode = removedEl.closest('[' + BTDUuidAttribute + ']') as Element;
            const btdChildren = removedEl.querySelectorAll('[' + BTDUuidAttribute + ']') || [];
            const nodes = Array.from(btdChildren).concat(btdNode);

            const uuids = compact(nodes.map((n) => n.getAttribute(BTDUuidAttribute)));

            const payload = {
              uuidArray: uuids,
            };

            onRemoveCallbacks.forEach((cb) => {
              cb(payload);
            });
          });
      }
    })
  );

  mutObserver.observe(document, {subtree: true, childList: true});

  type UiVisibleChirpsEventData = {
    columnKey: string;
    chirpsData: Array<{$elem: JQuery<HTMLElement>; chirp: TweetDeckChirp}>;
  };
  // Using this event is slightly less expensive since it gives us the element and the chirp right away.
  jq(document).on('uiVisibleChirps', (_event, data: UiVisibleChirpsEventData) => {
    // If we don't have any chirp, nothing to do.
    if (data.chirpsData.length < 1) {
      return;
    }

    // If we don't have any handlers, nothing to do.
    if (onVisibleCallbacks.size < 1) {
      console.log('no visible callbacks');
      return;
    }

    const {columnKey} = data;

    data.chirpsData.forEach((chirpDatum) => {
      const {$elem, chirp} = chirpDatum;
      // If we don't have any element, we can skip.
      if ($elem.length === 0) {
        return;
      }

      // If the element is inside a detail view, we can skip.
      if ($elem.closest('.js-tweet-detail.tweet-detail-wrapper').length) {
        return;
      }

      const decoratedChirp = decorateChirp(chirp, columnKey);
      const payload: ChirpAddedPayload = {
        uuid: '',
        chirp: JSON.parse(JSON.stringify(decoratedChirp)),
        columnKey,
        columnMediaSize: getSizeForColumnKey(columnKey),
      };

      onVisibleCallbacks.forEach((cb) => {
        cb(payload);
      });
    });
  });
  isObserverSetup = true;
};
