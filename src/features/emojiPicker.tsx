import './emojiPicker.css';

import React from 'react';
import ReactDOM, {unmountComponentAtNode} from 'react-dom';

import {EmojiButton} from '../components/emojiButton';
import {insertInsideComposer, onComposerShown} from '../helpers/tweetdeckHelpers';
import {BTDSettings} from '../types/btdSettingsTypes';

export function setupEmojiPicker(settings: BTDSettings) {
  if (!settings.showEmojiPicker) {
    return;
  }

  document.body.setAttribute('btd-emoji-picker', 'true');

  let root: HTMLDivElement | undefined = undefined;

  function unmount() {
    if (!root) {
      return;
    }

    unmountComponentAtNode(root);
  }

  onComposerShown((isVisible) => {
    if (!isVisible) {
      unmount();
      return;
    }

    root = document.createElement('div');
    root.id = 'emojiButton';

    document.querySelector('.compose-text-container')!.appendChild(root);

    ReactDOM.render(<EmojiButton onClick={insertInsideComposer}></EmojiButton>, root);
  });
}
