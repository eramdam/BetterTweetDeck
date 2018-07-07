import ReactDOM from 'react-dom';

import {BTDComponent} from './btdBaseClass';
import {BTDUtils} from './btdDebug';

interface ChirpCallbackProps {
  (
    opts: {
    originalNode: HTMLElement;
    chirp: any;
    urls: object[];
    columnKey?: string;
    }
  ): void;
}

function isHtmlElement(blob: any): blob is HTMLElement {
  return blob instanceof HTMLElement === true;
}

export class ChirpHandler extends BTDComponent {
  private readonly utils: BTDUtils;
  private onChirpCB: Function;

  constructor(settings: any, TDObject: any, utils: BTDUtils) {
    super(settings, TDObject);

    if (utils instanceof BTDUtils === false) {
      throw new Error("'utils' must be an instance of BTDUtils");
    }

    this.utils = utils;
    this.onChirpCB = () => {};

    new MutationObserver(mutations =>
      mutations.forEach((mutation: MutationRecord) => {
        Array.from(mutation.addedNodes).forEach(this.handleInsertedNode);
        Array.from(mutation.removedNodes).forEach((removedNode) => {
          if (!isHtmlElement(removedNode)) {
            return;
          }

          const BTDElements = removedNode.querySelectorAll('[data-btd-custom]');
          Array.from(BTDElements).forEach((e) => {
            console.log('removing custom BTD React element!');
            ReactDOM.unmountComponentAtNode(e);
          });
        });
      })).observe(document, {subtree: true, childList: true});
  }

  getURLsForChirp = (chirp: any) => {
    let chirpURLs = [];

    if (!chirp) {
      console.log(chirp);
      return [];
    }

    if (chirp.entities) {
      chirpURLs = [...chirp.entities.urls, ...chirp.entities.media];
    } else if (chirp.targetTweet && chirp.targetTweet.entities) {
      // If it got targetTweet it's an activity on a tweet
      chirpURLs = [...chirp.targetTweet.entities.urls, ...chirp.targetTweet.entities.media];
    } else if (chirp.retweet && chirp.retweet.entities) {
      chirpURLs = [...chirp.retweet.entities.urls, ...chirp.retweet.entities.media];
    } else if (chirp.retweetedStatus && chirp.retweetedStatus.entities) {
      chirpURLs = [...chirp.retweetedStatus.entities.urls, ...chirp.retweetedStatus.entities.media];
    }

    return chirpURLs;
  };

  private readonly handleInsertedNode = (element: Node | HTMLElement) => {
    if (!isHtmlElement(element)) {
      return;
    }

    if (element.matches('[data-btd-custom]') || element.closest('[data-btd-custom]')) {
      return;
    }

    if (element.closest('[data-key]')) {
      const chirp = this.utils.getChirpFromElement(element);
      const urls = this.getURLsForChirp(chirp);

      this.onChirpCB({
        originalNode: element,
        chirp,
        urls,
        columnKey: chirp._btd.columnKey
      });
    }

    if (element.classList.contains('js-mediatable')) {
      const chirp = this.utils.getChirpFromElement(element.querySelector('[data-key]') as HTMLElement);
      const urls = this.getURLsForChirp(chirp);
      this.onChirpCB({
        originalNode: element,
        chirp,
        urls,
        columnKey: undefined
      });
    }
  };

  onChirp = (callback: ChirpCallbackProps) => {
    this.onChirpCB = callback;
  };
}
