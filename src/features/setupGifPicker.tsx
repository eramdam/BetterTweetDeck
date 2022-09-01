import React from 'react';
import ReactDOM from 'react-dom/client';

import {BTDGifProvider} from '../components/gifPicker/gifProvider';
import {BTDSettings} from '../types/btdSettingsTypes';

export function setupGifPicker(settings: BTDSettings) {
  if (!settings.showGifPicker) {
    return;
  }

  const gifReactTreeRoot = document.createElement('div');
  gifReactTreeRoot.id = 'btd-gif-react-tree';
  document.querySelector('.js-app')?.insertAdjacentElement('beforeend', gifReactTreeRoot);
  const gifReactTree = document.getElementById('btd-gif-react-tree');
  if (!gifReactTree) {
    return;
  }

  ReactDOM.createRoot(gifReactTree).render(<BTDGifProvider />);
}
