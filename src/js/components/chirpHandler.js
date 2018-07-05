import { BTDComponent } from '../util/btdClass';
import { BTDUtils } from './btdDebug';
import { msgToContent } from '../util/messaging';


export class ChirpHandler extends BTDComponent {
  handleChirpInColumn = (element, chirp, colKey) => {
    let chirpURLs = [];

    if (chirp.entities) {
      chirpURLs = [...chirp.entities.urls, ...chirp.entities.media];
    } else if (chirp.targetTweet && chirp.targetTweet.entities) {
      // If it got targetTweet it's an activity on a tweet
      chirpURLs = [
        ...chirp.targetTweet.entities.urls,
        ...chirp.targetTweet.entities.media,
      ];
    } else if (chirp.retweet && chirp.retweet.entities) {
      chirpURLs = [
        ...chirp.retweet.entities.urls,
        ...chirp.retweet.entities.media,
      ];
    } else if (chirp.retweetedStatus && chirp.retweetedStatus.entities) {
      chirpURLs = [
        ...chirp.retweetedStatus.entities.urls,
        ...chirp.retweetedStatus.entities.media,
      ];
    }

    return chirpURLs;
  }

 handleInsertedNode = (element) => {
   if (element instanceof HTMLElement === false) {
     return;
   }

   if (element.closest('[data-key]')) {
     const chirp = this.utils.getChirpFromElement(element);
     const urls = this.handleChirpInColumn(element, chirp, chirp._btd.columnKey);

     if (urls.length > 0) {
       //  msgToContent({
       //    msg: 'CHIRP_REQUEST',
       //  }).then((data) => {
       //  });
     }
   }

   if (element.classList.contains('js-mediatable')) {
     const chirp = this.utils.getChirpFromElement(element.querySelector('[data-key]'));
     console.log('in modal', chirp);
   }
 };

 constructor(settings, TDObject, utils) {
   super(settings, TDObject);

   if (utils instanceof BTDUtils === false) {
     throw new Error('\'utils\' must be an instance of BTDUtils');
   }

   this.utils = utils;
 }

 monitorChirps = () => {
   new MutationObserver(mutations =>
     mutations.forEach((mutation) => {
       [...mutation.addedNodes].forEach(this.handleInsertedNode);
     })).observe(document, { subtree: true, childList: true });
 }
}
