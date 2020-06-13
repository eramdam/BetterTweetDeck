import './emojiPicker.css';

import React from 'react';
import ReactDOM, {unmountComponentAtNode} from 'react-dom';

import {EmojiButton} from '../components/emojiButton';
import {insertInsideComposer, onComposerShown} from '../helpers/tweetdeckHelpers';

export function setupEmojiPicker() {
  function unmount() {
    unmountComponentAtNode(document.querySelector('#emojiButton')!);
  }

  onComposerShown((isVisible) => {
    if (!isVisible) {
      unmount();
      return;
    }

    const root = document.createElement('div');
    root.id = 'emojiButton';

    document.querySelector('.compose-text-container')!.appendChild(root);

    // @ts-ignore
    ReactDOM.render(<EmojiButton onClick={insertInsideComposer}></EmojiButton>, root);
  });
}
