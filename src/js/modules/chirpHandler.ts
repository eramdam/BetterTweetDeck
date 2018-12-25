import {compact} from 'lodash';

import {getRandomString, isHTMLElement} from '../helpers/domHelpers';
import {getChirpFromElement, getURLsFromChirp} from '../helpers/tweetdeckHelpers';
import {BTD_CUSTOM_ATTRIBUTE, HandlerOf} from '../types';

export interface ChirpHandlerPayload {
  uuid: string;
  chirp: any;
  urls: any[];
  columnKey: string;
}

export interface ChirpRemovedPayload {
  uuidArray: string[];
}

type SetupChirpHandler = (handlerOnAdd: HandlerOf<ChirpHandlerPayload>, handlerOnRemove: HandlerOf<ChirpRemovedPayload>) => void;

export const setupChirpHandler: SetupChirpHandler = (handlerOnAdd, handlerOnRemove) => {
  const observer = new MutationObserver(mutations => mutations.forEach((mutation) => {
    Array.from(mutation.addedNodes).forEach((element) => {
      if (!isHTMLElement(element)) {
        return;
      }

      if (element.matches(`[${BTD_CUSTOM_ATTRIBUTE}]`) || element.closest(`[${BTD_CUSTOM_ATTRIBUTE}]`) || element.closest('[data-btd-uuid]') || element.matches('[data-btd-uuid]')) {
        return;
      }

      if (element.closest('[data-key]')) {
        const chirp = getChirpFromElement(element);

        if (!chirp) {
          return;
        }

        const urls = getURLsFromChirp(chirp);
        const uuid = getRandomString();

        element.setAttribute('data-btd-uuid', uuid);

        handlerOnAdd({
          uuid,
          chirp: JSON.parse(JSON.stringify(chirp)),
          urls,
          columnKey: chirp._btd.columnKey
        });
      }

      if (element.matches('.js-mediatable')) {
        // const insideChirpNode = element.querySelector('[data-key]');
        // if (!insideChirpNode) {
        //   return;
        // }
        // const chirp = getChirpFromElement(insideChirpNode);
        // if (!chirp) {
        //   return;
        // }
        // const urls = getURLsFromChirp(chirp);
        // const uuid = getRandomString();
        // element.setAttribute('data-btd-uuid', uuid);
        // handlerOnAdd({
        //   uuid,
        //   chirp: JSON.parse(JSON.stringify(chirp)),
        //   urls,
        //   columnKey: chirp._btd.columnKey
        // });
      }
    });

    Array.from(mutation.removedNodes).forEach((removed) => {
      if (!isHTMLElement(removed)) {
        return;
      }

      const btdNode = removed.closest('[data-btd-uuid]');
      const btdChildren = removed.querySelectorAll('[data-btd-uuid]') || [];

      if (!btdNode) {
        return;
      }

      const nodes = Array.from(btdChildren).concat(btdNode);

      const uuids = compact(nodes.map(n => n.getAttribute('data-btd-uuid')));

      handlerOnRemove({
        uuidArray: uuids
      });

      // const BTDElements = removed.querySelectorAll(`[${BTD_CUSTOM_ATTRIBUTE}]`);

      // Array.from(BTDElements).forEach((e) => {
      //   ReactDOM.unmountComponentAtNode(e);
      // });
    });
  }));

  observer.observe(document, {subtree: true, childList: true});
};
