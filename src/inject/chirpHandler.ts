import * as t from 'io-ts';
import _, {compact} from 'lodash';

import {getRandomString, isHTMLElement} from '../helpers/domHelpers';
import {getChirpFromElement, getURLsFromChirp} from '../helpers/tweetdeckHelpers';
import {HandlerOf, makeEnumRuntimeType} from '../helpers/typeHelpers';
import {BTDModalUuidAttribute, BTDUuidAttribute} from '../types/betterTweetDeck/btdCommonTypes';
import {TweetDeckColumnMediaPreviewSizesEnum, TweetDeckObject} from '../types/tweetdeckTypes';
import {getSizeForColumnKey} from './columnMediaSizeMonitor';

export const RChirpHandlerPayload = t.type({
  uuid: t.string,
  chirp: t.any,
  urls: t.array(t.string),
  columnMediaSize: makeEnumRuntimeType<TweetDeckColumnMediaPreviewSizesEnum>(
    TweetDeckColumnMediaPreviewSizesEnum
  ),
  columnKey: t.string,
});

export interface ChirpHandlerPayload extends t.TypeOf<typeof RChirpHandlerPayload> {}

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
        _(mutation.addedNodes)
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
        _(mutation.removedNodes)
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
          .compact()
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
