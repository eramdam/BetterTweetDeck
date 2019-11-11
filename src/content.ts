import _ from 'lodash';
import {unmountComponentAtNode} from 'react-dom';

import {listenToInternalBTDMessage} from './helpers/communicationHelpers';
import {isHTMLElement} from './helpers/domHelpers';
import {sendMessageToBackground} from './helpers/webExtensionHelpers';
import {injectInTD} from './services/injectInTD';
import {findProviderForUrl} from './thumbnails';
import {BTDMessageOriginsEnum, BTDMessages} from './types/betterTweetDeck/btdMessageTypes';

(async () => {
  await injectInTD();

  listenToInternalBTDMessage(
    BTDMessages.CHIRP_RESULT,
    BTDMessageOriginsEnum.CONTENT,
    async ({data}) => {
      if (data.name !== BTDMessages.CHIRP_RESULT) {
        return;
      }

      const urls = data.payload.urls;
      if (!urls || urls.length === 0) {
        return;
      }

      const [targetUrl] = urls;

      const thumbnailProvider = findProviderForUrl(targetUrl);

      if (!thumbnailProvider) {
        return;
      }

      const urlResult = await sendMessageToBackground({
        data: {
          requestId: undefined,
          isReponse: false,
          name: BTDMessages.FETCH_THUMBNAIL,
          origin: BTDMessageOriginsEnum.CONTENT,
          payload: {
            url: urls[0] || '',
          },
        },
      });

      console.log(urlResult);
    }
  );

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      _(mutation.removedNodes)
        .filter((e) => {
          if (!isHTMLElement(e)) {
            return false;
          }

          const btdNode = e.closest('[data-btd-uuid]');

          if (!btdNode) {
            return false;
          }

          return true;
        })
        .forEach((removedEl) => {
          if (!isHTMLElement(removedEl)) {
            return;
          }

          unmountComponentAtNode(removedEl);
        });
    });
  });
  observer.observe(document, {subtree: true, childList: true});
})();
