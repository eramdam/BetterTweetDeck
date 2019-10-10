import {uniqueId} from 'lodash';

import {injectInTD} from './services/injectInTD';
import {TweetDeckObject} from './types/tweetdeckTypes';

(async () => {
  await injectInTD();
})();

document.addEventListener(
  'click',
  async (ev) => {
    const {target} = ev;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (!target.matches('article.stream-item') && !target.closest('article.stream-item')) {
      return;
    }

    const article = target.closest('article.stream-item');
    if (!article) {
      return;
    }

    const chirpKey = article.getAttribute('data-key') || '';
    const chirpContainer = article.closest('[data-column]');
    const colKey = (chirpContainer && chirpContainer.getAttribute('data-column')) || '';

    console.log({chirpKey, colKey});
  },
  {capture: true}
);

function getTweetDeckObjectFromInject(): Promise<TweetDeckObject> {
  const requestId = uniqueId();
  console.log('getTweetDeckObjectFromInject', {requestId});

  return new Promise((resolve) => {
    const listener = (ev: MessageEvent) => {
      const {origin, data} = ev;

      if (['tweetdeck.twitter.com', 'https://better.tw'].some((o) => origin.includes(o))) {
        const {name} = data;

        if (name === 'TD_BACK' && data.requestId === requestId) {
          console.log({data, requestId}, JSON.parse(data.data));
          window.removeEventListener('message', listener);
          resolve(JSON.parse(data.data));
        }
      }
    };

    window.addEventListener('message', listener);
    window.postMessage({name: 'GET_TD', requestId}, 'https://tweetdeck.twitter.com');
  });
}
