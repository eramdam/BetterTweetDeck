import './changeScrollbars.css';

import {cx} from '@emotion/css';

import {isChrome, isFirefox, isSafari} from '../helpers/browserHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';

export enum BTDScrollbarsMode {
  DEFAULT = 'default',
  SLIM = 'slim',
  HIDDEN = 'hidden',
}

export const changeScrollbarStyling = makeBTDModule(({settings}) => {
  document.body.setAttribute('btd-scrollbar-style', settings.scrollbarsMode);
  document.body.className = cx(document.body.className, {
    'is-firefox': isFirefox,
    'is-safari': isSafari,
    'is-chrome': isChrome,
  });
});
