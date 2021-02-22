import {compact} from 'lodash';

import {getRandomString, isHTMLElement} from '../helpers/domHelpers';
import {getChirpFromElement, getURLsFromChirp} from '../helpers/tweetdeckHelpers';
import {HandlerOf} from '../helpers/typeHelpers';
import {BTDModalUuidAttribute, BTDUuidAttribute} from '../types/betterTweetDeck/btdCommonTypes';
import {
  TweetDeckChirp,
  TweetDeckColumnMediaPreviewSizesEnum,
  TweetDeckObject,
} from '../types/tweetdeckTypes';
import {getSizeForColumnKey} from './columnMediaSizeMonitor';

export interface ChirpHandlerPayload {
  uuid: string;
  chirp: TweetDeckChirp;
  urls: string[];
  columnMediaSize: TweetDeckColumnMediaPreviewSizesEnum;
  columnKey: string;
}

export interface ChirpRemovedPayload {
  uuidArray: string[];
}

type SetupChirpHandler = (
  TD: TweetDeckObject,
  handlerOnAdd?: HandlerOf<ChirpHandlerPayload>,
  handlerOnRemove?: HandlerOf<ChirpRemovedPayload>
) => void;

export const setupChirpHandler: SetupChirpHandler = (TD, handlerOnAdd, handlerOnRemove) => {
  const mutObserver = new MutationObserver((mutations) =>
    mutations.forEach((mutation) => {
      if (handlerOnAdd) {
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

              handlerOnAdd({
                uuid,
                chirp: JSON.parse(JSON.stringify(chirp)),
                urls: (urls || []).map((e) => e.expanded_url),
                columnKey: chirp._btd?.columnKey || '',
                columnMediaSize: getSizeForColumnKey(chirp._btd?.columnKey),
              });
            }
          });
      }

      if (handlerOnRemove) {
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

            handlerOnRemove({
              uuidArray: uuids,
            });
          });
      }
    })
  );

  mutObserver.observe(document, {subtree: true, childList: true});
};
