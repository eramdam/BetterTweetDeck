import './changeScrollbars.css';

import {makeBTDModule} from '../types/btdCommonTypes';

export enum BTDScrollbarsMode {
  DEFAULT = 'default',
  SLIM = 'slim',
  HIDDEN = 'hidden',
}

export const changeScrollbarStyling = makeBTDModule(({settings}) => {
  document.body.setAttribute('btd-scrollbar-style', settings.scrollbarsMode);
});
