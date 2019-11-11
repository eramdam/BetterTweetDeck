import * as t from 'io-ts';
import _, {compact} from 'lodash';

import {getRandomString, isHTMLElement} from '../helpers/domHelpers';
import {getChirpFromElement, getURLsFromChirp} from '../helpers/tweetdeckHelpers';
import {HandlerOf, makeEnumRuntimeType} from '../helpers/typeHelpers';
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
              addedEl.closest('[data-btd-uuid]') ||
              addedEl.matches('[data-btd-uuid]')
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
              const chirp = getChirpFromElement(TD, element);

              if (!chirp) {
                return;
              }

              const urls = getURLsFromChirp(chirp);
              const uuid = getRandomString();

              element.setAttribute('data-btd-uuid', uuid);

              handlerOnAdd({
                uuid,
                chirp: JSON.parse(JSON.stringify(chirp)),
                urls: (urls || []).map((e) => e.expanded_url),
                columnKey: chirp._btd.columnKey,
                columnMediaSize: getSizeForColumnKey(chirp._btd.columnKey),
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

            const btdNode = removedEl.closest('[data-btd-uuid]');

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

            const btdNode = removedEl.closest('[data-btd-uuid]') as Element;
            const btdChildren = removedEl.querySelectorAll('[data-btd-uuid]') || [];
            const nodes = Array.from(btdChildren).concat(btdNode);

            const uuids = compact(nodes.map((n) => n.getAttribute('data-btd-uuid')));

            handlerOnRemove({
              uuidArray: uuids,
            });
          });
      }
    })
  );

  mutObserver.observe(document, {subtree: true, childList: true});
};
