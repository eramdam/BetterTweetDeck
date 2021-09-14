import {BaseEmoji, NimbleEmoji, NimblePicker} from 'emoji-mart';
import React, {FC, Fragment, useState} from 'react';

import data from '../assets/emoji-mart-data.json';
import {isHTMLElement} from '../helpers/domHelpers';
import {getEmojiSheetUrl} from '../helpers/emojiHelpers';
import {useTweetdeckTheme} from '../helpers/hookHelpers';
import {HandlerOf} from '../helpers/typeHelpers';

const pickerProps = {
  sheetRows: 60,
  sheetColumns: 60,
};

export const EmojiButton: FC<{onClick: HandlerOf<string>}> = (props) => {
  const [isPickerShown, setIsPickerShown] = useState(false);
  const theme = useTweetdeckTheme();
  const composerRect = () =>
    document.querySelector('.compose-text-container')!.getBoundingClientRect();
  const color = '#1da1f2';

  return (
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
          <NimblePicker
            data={data as any}
            set="twitter"
            autoFocus
            onSelect={(emoji: BaseEmoji) => {
              props.onClick(emoji.native);
            }}
            color={color}
            emoji="sparkles"
            useButton={false}
            emojiSize={20}
            {...pickerProps}
            perLine={7}
            backgroundImageFn={getEmojiSheetUrl}
            title=""
            theme={theme}
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
        <NimbleEmoji
          data={data as any}
          {...pickerProps}
          emoji="joy"
          size={20}
          onClick={() => setIsPickerShown(true)}
          set="twitter"
          backgroundImageFn={getEmojiSheetUrl}
        />
      </div>
    </Fragment>
  );
};
