import {BTDComponent} from '../util/btdClass';
import {BTDUtils} from './btdDebug';

interface ChirpCallbackProps {
  (
    opts: {
    chirp: any;
    urls: string[];
    columnKey?: string;
    },
  ): void;
}

export class ChirpHandler extends BTDComponent {
  getURLsForChirpInColumn = (chirp: any) => {
    let chirpURLs = [];

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

  handleInsertedNode = (element: HTMLElement) => {
    if (element instanceof HTMLElement === false) {
      return;
    }

    if (element.closest('[data-key]')) {
      const chirp = this.utils.getChirpFromElement(element);
      const urls = this.getURLsForChirpInColumn(chirp);

      this.onChirpCB({
        chirp,
        urls,
        columnKey: chirp._btd.columnKey,
      });
    }

    if (element.classList.contains('js-mediatable')) {
      const chirp = this.utils.getChirpFromElement(element.querySelector('[data-key]') as HTMLElement);
      const urls = this.getURLsForChirpInColumn(chirp);
      this.onChirpCB({
        chirp,
        urls,
        columnKey: undefined,
      });
    }
  };

  onChirp = (callback: ChirpCallbackProps) => {
    this.onChirpCB = callback;
  };

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
      mutations.forEach((mutation: any) => {
        [...mutation.addedNodes].forEach(this.handleInsertedNode);
      })).observe(document, {subtree: true, childList: true});
  }
}
