import {BaseEmoji, Emoji, Picker} from 'emoji-mart';
import React, {FC, Fragment, useState} from 'react';

import {isHTMLElement} from '../helpers/domHelpers';
import {HandlerOf} from '../helpers/typeHelpers';

export const EmojiButton: FC<{onClick: HandlerOf<string>}> = (props) => {
  const [isPickerShown, setIsPickerShown] = useState(false);
  const composerRect = () =>
    document.querySelector('.compose-text-container')!.getBoundingClientRect();

  return (
    // @ts-ignore
    <Fragment>
      {isPickerShown && (
        <div
          id="emojiPickerWrapper"
          onClick={(e) => {
            if (isHTMLElement(e.target) && e.target.closest('.emoji-mart')) {
              return;
            }

            setIsPickerShown(false);
          }}>
          <Picker
            set="twitter"
            autoFocus
            onSelect={(emoji: BaseEmoji) => {
              props.onClick(emoji.native);
              setIsPickerShown(false);
            }}
            emoji="sparkles"
            useButton={false}
            emojiSize={16}
            perLine={8}
            title=""
            theme="dark"
            style={{
              position: 'fixed',
              top: composerRect().top + composerRect().height,
              left: 0,
              width: composerRect().width,
              border: 'none',
              transform: 'translateX(calc(-100% - 15px))',
            }}
          />
        </div>
      )}
      <div
        className="btd-emoji-button-wrapper"
        style={{
          height: 20,
          position: 'absolute',
          top: 10,
          right: 10,
          width: 20,
          display: 'block',
        }}>
        {/* @ts-ignore */}
        <Emoji emoji="joy" size={20} onClick={() => setIsPickerShown(true)} set="twitter" />
      </div>
    </Fragment>
  );
};
