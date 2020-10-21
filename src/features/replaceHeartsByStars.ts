import './replaceHeartsByStars.css';

import {makeBTDModule} from '../types/betterTweetDeck/btdCommonTypes';

export const maybeReplaceHeartsByStars = makeBTDModule(({settings}) => {
  if (settings.replaceHeartsByStars) document.body.setAttribute('btd-use-stars', 'true');
});
