import './smallerComposerButtons.css';

import {makeBTDModule} from '../types/btdCommonTypes';

export const maybeMakeComposerButtonsSmaller = makeBTDModule(({settings}) => {
  document.body.setAttribute('btd-small-compose-icns', String(settings.smallComposerButtons));
});
