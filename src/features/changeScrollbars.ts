import './changeScrollbars.css';

import {BTDSettings} from '../types/betterTweetDeck/btdSettingsTypes';

export enum BTDScrollbarsMode {
  DEFAULT = 'default',
  SLIM = 'slim',
  HIDDEN = 'hidden',
}

export function changeScrollbarStyling(settings: BTDSettings) {
  document.body.setAttribute('btd-scrollbar-style', settings.scrollbarsMode);
}
