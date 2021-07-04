import './collapseDms.css';

import {makeBTDModule} from '../types/btdCommonTypes';

export const maybeCollapseDms = makeBTDModule(({settings}) => {
  if (!settings.collapseReadDms) {
    return;
  }
  document.body.setAttribute('btd-collapse-dms', String(settings.collapseReadDms));
  document.body.setAttribute('btd-collapse-dms-read', String(settings.collapseAllDms));
});
