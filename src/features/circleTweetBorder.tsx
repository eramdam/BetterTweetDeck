import './circleTweetBorder.css';

import {onChirpAdded} from '../services/chirpHandler';
import {makeBTDModule, makeBtdUuidSelector} from '../types/btdCommonTypes';

export const circleTweetBorder = makeBTDModule(({settings}) => {
  if (!settings.showCircleTweetsBorder) {
    return;
  }

  document.body.setAttribute('btd-twitter-circle', 'true');

  onChirpAdded((payload) => {
    const isInCircle =
      payload.chirp.limitedActions === 'limit_trusted_friends_tweet' ||
      payload.chirp.targetTweet?.limitedActions === 'limit_trusted_friends_tweet';

    if (!isInCircle) {
      return;
    }

    const chirpNode = document.querySelector(makeBtdUuidSelector('data-btd-uuid', payload.uuid));

    if (!chirpNode) {
      return;
    }

    chirpNode.classList.add('btd-circle-tweet');
  });
});
