import {flip, shift, useFloating} from '@floating-ui/react-dom';
import {BaseEmoji, NimbleEmoji, NimblePicker} from 'emoji-mart';
import React, {Fragment, useCallback, useState} from 'react';
import ReactDOM from 'react-dom';

import data from '../assets/emoji-mart-data.json';
import {isHTMLElement} from '../helpers/domHelpers';
import {getEmojiSheetUrl} from '../helpers/emojiHelpers';
import {useTweetdeckTheme} from '../helpers/hookHelpers';
import {insertInsideComposer, useIsComposerVisible} from '../helpers/tweetdeckHelpers';
import {HandlerOf} from '../helpers/typeHelpers';

export const nimbleEmojiBaseProps = {
  sheetRows: 60,
  sheetColumns: 60,
  data: data as any,
};

export const BTDEmojiProvider = () => {
  const [isPickerShown, setIsPickerShown] = useState(false);
  const theme = useTweetdeckTheme();
  const color = '#1da1f2';
  const [isComposerVisible, setIsComposerVisible] = useState(false);
  const [emojiButtonRootElement, setEmojiButtonRootElement] = useState<HTMLDivElement | null>(null);
  const {x, y, reference, floating, strategy} = useFloating({
    placement: 'right-start',
    middleware: [flip(), shift()],
  });

  const onComposerVisibleChange: HandlerOf<boolean> = useCallback(
    (isVisible) => {
      setIsComposerVisible(isVisible);
      if (!isVisible) {
        return;
      }

      const composeTextContainer = document.querySelector<HTMLElement>('.compose-text-container');

      if (!composeTextContainer) {
        return;
      }

      const emojiRootElement = document.createElement('div');
      emojiRootElement.id = 'emojiButton';
      composeTextContainer.appendChild(emojiRootElement);
      setEmojiButtonRootElement(emojiRootElement);
      reference(composeTextContainer);
    },
    [reference]
  );

  useIsComposerVisible(onComposerVisibleChange);

  const emojiButton = (
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
        {...nimbleEmojiBaseProps}
        emoji="joy"
        size={20}
        onClick={() => setIsPickerShown(true)}
        set="twitter"
        backgroundImageFn={getEmojiSheetUrl}
      />
    </div>
  );

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
          <div
            ref={floating}
            style={{
              position: strategy,
              top: y ?? '',
              left: x ?? '',
            }}>
            <NimblePicker
              set="twitter"
              autoFocus
              onSelect={(emoji: BaseEmoji) => {
                insertInsideComposer(emoji.native);
              }}
              color={color}
              emoji="sparkles"
              useButton={false}
              emojiSize={20}
              {...nimbleEmojiBaseProps}
              perLine={7}
              backgroundImageFn={getEmojiSheetUrl}
              title=""
              theme={theme}
            />
          </div>
        </div>
      )}
      {isComposerVisible &&
        emojiButtonRootElement &&
        ReactDOM.createPortal(emojiButton, emojiButtonRootElement)}
    </Fragment>
  );
};
