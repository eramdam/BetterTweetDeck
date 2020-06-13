import './emojiPicker.css';

import {BaseEmoji, Picker} from 'emoji-mart';
import React from 'react';
import ReactDOM, {unmountComponentAtNode} from 'react-dom';

import {makeEmojiButton} from '../components/emojiButton';
import {isHTMLElement} from '../helpers/domHelpers';
import {insertInsideComposer, onComposerShown} from '../helpers/tweetdeckHelpers';

export function setupEmojiPicker() {
  const root = document.createElement('div');
  root.id = 'emojiRoot';

  document.body.appendChild(root);

  function unmount() {
    unmountComponentAtNode(root);
  }

  onComposerShown((isVisible) => {
    if (!isVisible) {
      unmount();
      return;
    }

    function renderEmojiPicker() {
      const composer = document.querySelector('.compose-text-container')!;
      const composerRect = composer.getBoundingClientRect();
      ReactDOM.render(
        <div
          style={{
            height: '100vh',
            width: '100vw',
            position: 'fixed',
            zIndex: 100000,
          }}
          onClick={(e) => {
            if (isHTMLElement(e.target) && e.target.closest('.emoji-mart')) {
              return;
            }
            unmount();
          }}>
          <Picker
            set="twitter"
            autoFocus
            onSelect={(emoji: BaseEmoji) => {
              insertInsideComposer(emoji.native);
              unmount();
            }}
            emoji="sparkles"
            useButton={false}
            emojiSize={16}
            perLine={8}
            title=""
            theme="dark"
            style={{
              position: 'fixed',
              top: composerRect.top + composerRect.height,
              left: composerRect.left,
            }}
          />
        </div>,
        root,
        console.log
      );
    }

    const emojiButton = makeEmojiButton({onClick: renderEmojiPicker});

    document.querySelector('.compose-text-container')?.append(emojiButton as any);
  });
}
