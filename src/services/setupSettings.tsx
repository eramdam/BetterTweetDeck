import React from 'react';
import ReactDOMServer from 'react-dom/server';

import {BTDSettingsButton} from '../components/openBtdSettingsButton';
import {makeBTDModule} from '../types/btdCommonTypes';
import {BTDSettings} from '../types/btdSettingsTypes';

export type OnSettingsUpdateAsync = (newBtdSettings: BTDSettings) => void;
export type OnSettingsUpdate = (newBtdSettings: BTDSettings) => Promise<void>;

export const insertSettingsButton = makeBTDModule(({jq, TD}) => {
  jq(document).one('dataColumnsLoaded', () => {
    document
      .querySelector('.app-navigator [data-action="settings-menu"]')
      ?.insertAdjacentHTML(
        'beforebegin',
        ReactDOMServer.renderToStaticMarkup(<BTDSettingsButton />)
      );
  });
});
