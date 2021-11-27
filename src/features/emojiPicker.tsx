import './emojiPicker.css';

import React from 'react';
import ReactDOM from 'react-dom';

import {BTDEmojiProvider} from '../components/emojiProvider';
import {BTDSettings} from '../types/btdSettingsTypes';

export function setupEmojiPicker(settings: BTDSettings) {
  if (!settings.showEmojiPicker) {
    return;
  }

  document.body.setAttribute('btd-emoji-picker', 'true');

  const gifEmojiTreeRoot = document.createElement('div');
  gifEmojiTreeRoot.id = 'btd-emoji-react-tree';
  document.querySelector('.js-app')?.insertAdjacentElement('beforeend', gifEmojiTreeRoot);

  ReactDOM.render(<BTDEmojiProvider />, gifEmojiTreeRoot);
}
