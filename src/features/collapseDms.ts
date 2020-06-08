import './collapseDms.css';

import {makeBTDModule} from '../types/betterTweetDeck/btdCommonTypes';

export const maybeCollapseDms = makeBTDModule(({settings}) => {
  document.body.setAttribute('btd-collapse-dms', String(settings.collapseReadDms));
});
