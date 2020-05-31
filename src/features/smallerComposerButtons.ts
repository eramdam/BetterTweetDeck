import './smallerComposerButtons.css';

import {makeBTDModule} from '../types/betterTweetDeck/btdCommonTypes';

export const maybeMakeComposerButtonsSmaller = makeBTDModule(({settings}) => {
  document.body.setAttribute('btd-small-compose-icns', 'true');
});
