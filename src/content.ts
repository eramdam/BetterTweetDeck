import {sendBTDMessage} from './helpers/communicationHelpers';
import {injectInTD} from './services/injectInTD';
import {BTDMessageOriginsEnum, BTDMessages} from './types/betterTweetDeck/btdMessageTypes';

(async () => {
  await injectInTD();

  setTimeout(() => {
    sendBTDMessage({
      name: BTDMessages.FETCH_THUMBNAIL,
      origin: BTDMessageOriginsEnum.CONTENT,
      isReponse: false,
      payload: {
        url:
          'https://github.com/eramdam/BetterTweetDeck/blob/experiments/src/js/services/messaging.ts',
      },
    }).then((res) => {
      console.log('response', {res});
    });
  }, 2000);
})();
