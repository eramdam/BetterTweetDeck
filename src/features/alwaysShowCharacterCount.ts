import './alwaysShowCharacterCount.css';

import {makeBTDModule} from '../types/btdCommonTypes';

export const maybeShowCharacterCount = makeBTDModule(({settings}) => {
  if (!settings.alwaysShowNumberOfCharactersLeft) {
    return;
  }
  document.body.setAttribute('btd-character-count', 'true');
});
