import React from 'react';
import ReactDOM from 'react-dom';

import {BTDGifProvider} from '../components/gifPicker/gifProvider';
import {onComposerShown} from '../helpers/tweetdeckHelpers';
import {BTDSettings} from '../types/btdSettingsTypes';

export function setupGifPicker(settings: BTDSettings) {
  if (!settings.showGifPicker) {
    return;
  }

  let isComposerVisible = false;

  document
    .querySelector('button[data-drawer="compose"].js-hide-drawer')
    ?.addEventListener('click', () => {
      if (!isComposerVisible) {
        return;
      }

      document.querySelector('.btd-giphy-zone')?.classList.remove('-visible');
    });

  const gifReactTreeRoot = document.createElement('div');
  gifReactTreeRoot.id = 'btd-gif-react-tree';
  document.querySelector('.js-app')?.insertAdjacentElement('beforeend', gifReactTreeRoot);
  const gifReactTree = document.getElementById('btd-gif-react-tree');

  onComposerShown((isVisible) => {
    isComposerVisible = isVisible;
    if (!isVisible) {
      ReactDOM.unmountComponentAtNode(gifReactTree!);
      return;
    }

    ReactDOM.render(<BTDGifProvider />, gifReactTree);
  });
}
