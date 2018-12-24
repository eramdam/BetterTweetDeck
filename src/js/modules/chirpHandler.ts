import ReactDOM from 'react-dom';

import {getRandomString, isHTMLElement} from '../helpers/domHelpers';
import {getChirpFromElement, getURLsFromChirp} from '../helpers/tweetdeckHelpers';
import {BTD_CUSTOM_ATTRIBUTE, HandlerOf} from '../types';

export interface ChirpHandlerPayload {
  selectorToElement: string;
  chirp: any;
  urls: any[];
  columnKey: string;
}

export const setupChirpHandler: (handler: HandlerOf<ChirpHandlerPayload>) => void = (handler) => {
  const observer = new MutationObserver(mutations => mutations.forEach((mutation) => {
    Array.from(mutation.addedNodes).forEach((element) => {
      if (!isHTMLElement(element)) {
        return;
      }

      if (element.matches(`[${BTD_CUSTOM_ATTRIBUTE}]`) || element.closest(`[${BTD_CUSTOM_ATTRIBUTE}]`)) {
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

        handler({
          selectorToElement: `[data-btd-uuid="${uuid}"]`,
          chirp: JSON.parse(JSON.stringify(chirp)),
          urls,
          columnKey: chirp._btd.columnKey
        });
      }

      if (element.matches('.js-mediatable')) {
        const insideChirpNode = element.querySelector('[data-key]');

        if (!insideChirpNode) {
          return;
        }

        const chirp = getChirpFromElement(insideChirpNode);

        if (!chirp) {
          return;
        }

        const urls = getURLsFromChirp(chirp);
        const uuid = getRandomString();

        element.setAttribute('data-btd-uuid', uuid);

        handler({
          selectorToElement: `[data-btd-uuid="${uuid}"]`,
          chirp: JSON.parse(JSON.stringify(chirp)),
          urls,
          columnKey: chirp._btd.columnKey
        });
      }
    });

    Array.from(mutation.removedNodes).forEach((removed) => {
      if (!isHTMLElement(removed)) {
        return;
      }

      const BTDElements = removed.querySelectorAll(`[${BTD_CUSTOM_ATTRIBUTE}]`);

      Array.from(BTDElements).forEach((e) => {
        ReactDOM.unmountComponentAtNode(e);
      });
    });
  }));

  observer.observe(document, {subtree: true, childList: true});
};
