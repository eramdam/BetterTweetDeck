import {compact} from 'lodash';

import {getRandomString, isHTMLElement} from '../helpers/domHelpers';
import {getChirpFromElement, getURLsFromChirp} from '../helpers/tweetdeckHelpers';
import {HandlerOf} from '../helpers/typeHelpers';
import {BTDModalUuidAttribute, BTDUuidAttribute, makeBTDModule} from '../types/btdCommonTypes';
import {TweetDeckChirp, TweetDeckColumnMediaPreviewSizesEnum} from '../types/tweetdeckTypes';
import {getSizeForColumnKey} from './columnMediaSizeMonitor';

export interface ChirpAddedPayload {
  uuid: string;
  chirp: Omit<TweetDeckChirp, 'action' | 'chirpType'>;
  chirpExtra: {
    action: TweetDeckChirp['action'];
    chirpType: TweetDeckChirp['chirpType'];
  };
  columnMediaSize: TweetDeckColumnMediaPreviewSizesEnum;
  columnKey: string;
}

export interface ChirpRemovedPayload {
  uuidArray: string[];
}

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

export const setupChirpHandler = makeBTDModule(({TD, jq}) => {
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

            if (element.closest('[data-key]')) {
              const chirpObject = getChirpFromElement(TD, element);

              if (!chirpObject) {
                return;
              }

              const {chirp, extra} = chirpObject;

              const urls = getURLsFromChirp(chirp);
              const uuid = getRandomString();

              element.setAttribute(BTDUuidAttribute, uuid);

              const payload = {
                uuid,
                chirp: chirp,
                chirpExtra: {
                  action: chirp.action,
                  chirpType: chirp.chirpType,
                },
                urls: (urls || []).map((e) => e.expanded_url),
                columnKey: extra.columnKey || '',
                columnMediaSize: getSizeForColumnKey(extra.columnKey),
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
      return;
    }

    const {columnKey} = data;

    data.chirpsData.forEach((chirpDatum) => {
      const {$elem, chirp} = chirpDatum;
      // If we don't have any element, we can skip.
      if ($elem.length === 0) {
        return;
      }

      const payload: ChirpAddedPayload = {
        uuid: '',
        chirp: chirp,
        chirpExtra: {
          action: chirp.action,
          chirpType: chirp.chirpType,
        },
        columnKey,
        columnMediaSize: getSizeForColumnKey(columnKey),
      };

      onVisibleCallbacks.forEach((cb) => {
        cb(payload);
      });
    });
  });
  isObserverSetup = true;
});
