import './biggerEmoji.css';

import {makeBTDModule} from '../types/btdCommonTypes';

export const makeEmojiBigger = makeBTDModule(({settings}) => {
  if (!settings.biggerEmoji) {
    return;
  }

  document.body.setAttribute('btd-big-emoji', 'true');
});
