import './replaceHeartsByStars.css';

import {makeBTDModule} from '../types/betterTweetDeck/btdCommonTypes';

export const maybeReplaceHeartsByStars = makeBTDModule(() => {
  document.body.setAttribute('btd-use-stars', 'true');
});
