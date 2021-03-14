import './replaceHeartsByStars.css';

import {makeBTDModule} from '../types/btdCommonTypes';

export const maybeReplaceHeartsByStars = makeBTDModule(({settings}) => {
  document.body.setAttribute('btd-use-stars', String(settings.replaceHeartsByStars));
});
