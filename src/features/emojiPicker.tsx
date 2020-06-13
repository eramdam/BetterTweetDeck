import './emojiPicker.css';

import {Picker} from 'emoji-mart';
import React from 'react';
import ReactDOM from 'react-dom';

export function setupEmojiPicker() {
  const root = document.createElement('div');
  root.id = 'emojiRoot';

  document.body.appendChild(root);

  ReactDOM.render(
    <div>
      <Picker
        set="twitter"
        autoFocus
        onSelect={console.log}
        emoji="sparkles"
        useButton={false}
        emojiSize={18}
        perLine={7}
        theme="dark"
        title="Pick an emoji!"
        style={{
          position: 'fixed',
          top: 40,
          left: 100,
        }}
      />
    </div>,
    root,
    console.log
  );
}
