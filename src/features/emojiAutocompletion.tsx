import {cx} from '@emotion/css';
import {BaseEmoji, NimbleEmoji, NimbleEmojiIndex} from 'emoji-mart';
import React from 'react';
import ReactDOM from 'react-dom';
import {Key} from 'ts-key-enum';

import data from '../assets/emoji-mart-data.json';
import {nimbleEmojiBaseProps} from '../components/emojiProvider';
import {isHTMLElement, replaceAt, valueAtCursor} from '../helpers/domHelpers';
import {getEmojiSheetUrl} from '../helpers/emojiHelpers';
import {BTDSettings} from '../types/btdSettingsTypes';

interface StateEmoji {
  emojiData: BaseEmoji;
  isSelected: boolean;
}

const emojiIndex = new NimbleEmojiIndex(data as any);

const emojiColonRegex = /(^|\s|\W):([a-z0-9_\-+]+):?:?([a-z0-9_-]+)?:?$/i;

export function setupEmojiAutocompletion(settings: BTDSettings) {
  if (!settings.enableEmojiCompletion) {
    return;
  }
  let stateEmojis: StateEmoji[] = [];

  document.body.addEventListener(
    'input',
    (ev) => {
      const target = ev.target;
      if (!isHTMLElement(target)) {
        return;
      }

      if (!target.matches('textarea')) {
        return;
      }

      const composer = target as HTMLTextAreaElement;
      const valAtCursor = valueAtCursor(composer).value;
      const colonMatches = valAtCursor.match(emojiColonRegex);

      if (!colonMatches) {
        unmountEmojiDropodownNearInput(composer);
        return;
      }

      const shortcode = colonMatches[2];

      if (shortcode.startsWith('-') || shortcode.length < 2) {
        unmountEmojiDropodownNearInput(composer);
        return;
      }

      const emojiResults = emojiIndex.search(shortcode)?.slice(0, 5);

      if (!emojiResults || !emojiResults.length) {
        unmountEmojiDropodownNearInput(composer);
        return;
      }

      const newStateEmojis = (emojiResults as BaseEmoji[]).map((e, i) => {
        return {
          emojiData: e,
          isSelected: i === 0,
        };
      });
      stateEmojis = newStateEmojis;

      renderEmojiDropdownInHolder(
        {
          emojis: newStateEmojis,
        },
        composer
      );
    },
    true
  );

  document.body.addEventListener(
    'keydown',
    (ev) => {
      const target = ev.target;

      // Let event go through if meta is pressed (otherwise "send" shortcut won't work).
      if (ev.metaKey) {
        return;
      }

      if (!isHTMLElement(target)) {
        return;
      }

      if (!target.matches('textarea')) {
        return;
      }

      const composer = target as HTMLTextAreaElement;
      const valAtCursor = valueAtCursor(composer).value;
      const colonMatches = valAtCursor.match(emojiColonRegex);

      if (!colonMatches) {
        return;
      }

      const allowedKeys: string[] = [Key.ArrowDown, Key.ArrowUp, Key.Tab, Key.Enter, Key.Escape];
      const eventKey = ev.key;

      if (!allowedKeys.includes(eventKey)) {
        return;
      }

      if (stateEmojis.length === 0) {
        return;
      }

      ev.preventDefault();
      ev.stopPropagation();

      switch (eventKey) {
        case Key.ArrowUp: {
          stateEmojis = moveSelection(stateEmojis, -1);
          renderEmojiDropdownInHolder(
            {
              emojis: stateEmojis,
            },
            composer
          );
          return;
        }

        case Key.ArrowDown: {
          stateEmojis = moveSelection(stateEmojis, 1);
          renderEmojiDropdownInHolder(
            {
              emojis: stateEmojis,
            },
            composer
          );
          return;
        }

        case Key.Escape: {
          unmountEmojiDropodownNearInput(composer);
          return;
        }

        case Key.Enter:
        case Key.Tab: {
          insertSelectedEmoji(
            stateEmojis.find((e) => e.isSelected),
            composer
          );
          stateEmojis = [];
        }
      }
    },
    true
  );
}

function insertSelectedEmoji(selectedEmoji: StateEmoji | undefined, composer: HTMLTextAreaElement) {
  const atCursor = valueAtCursor(composer);
  const toReplace = atCursor.value.match(emojiColonRegex);

  if (!toReplace || !Number.isInteger(toReplace.index) || !selectedEmoji) {
    return;
  }

  const unicodeEmoji = selectedEmoji.emojiData.native;

  const newTextareaValue = replaceAt(
    composer.value,
    toReplace.index!,
    toReplace[0],
    toReplace[1] + unicodeEmoji
  );

  composer.value = newTextareaValue;
  composer.selectionStart = toReplace.index! + (toReplace[1] + unicodeEmoji).length;
  composer.selectionEnd = toReplace.index! + (toReplace[1] + unicodeEmoji).length;
  composer.dispatchEvent(new Event('change'));
  composer.dispatchEvent(new KeyboardEvent('input'));

  unmountEmojiDropodownNearInput(composer);
}

function moveSelection(emojiArray: StateEmoji[], offset: number) {
  const currentSelectedIndex = emojiArray.findIndex((i) => i.isSelected);
  const newIndex = (currentSelectedIndex + offset) % emojiArray.length;

  return emojiArray.map((e, index) => {
    return {
      ...e,
      isSelected: index === newIndex,
    };
  });
}

interface EmojiCompletionProps {
  emojis: StateEmoji[];
}
function renderEmojiDropdownInHolder({emojis}: EmojiCompletionProps, input: HTMLTextAreaElement) {
  let emojiDropdownHolder = input.parentElement?.querySelector('.emoji-dropdown-holder');

  if (!emojiDropdownHolder) {
    emojiDropdownHolder = document.createElement('div');
    emojiDropdownHolder.className = 'emoji-dropdown-holder';
    input.parentElement?.appendChild(emojiDropdownHolder);
  }

  ReactDOM.render(
    <ul
      className="lst lst-modal typeahead"
      style={{
        display: 'block',
      }}>
      {emojis.map((emoji) => {
        return (
          <li
            key={emoji.emojiData.id}
            className={cx(
              'typeahead-item padding-am cf is-actionable',
              emoji.isSelected && 's-selected'
            )}
            onClick={() => insertSelectedEmoji(emoji, input)}>
            <p
              className="js-hashtag txt-ellipsis"
              style={{
                display: 'grid',
                gridTemplateColumns: '16px 1fr',
                gridColumnGap: '8px',
                overflow: 'hidden',
              }}>
              <NimbleEmoji
                {...nimbleEmojiBaseProps}
                emoji={emoji.emojiData}
                size={16}
                set="twitter"
                backgroundImageFn={getEmojiSheetUrl}
              />
              <span>{emoji.emojiData.colons}</span>
            </p>
          </li>
        );
      })}
    </ul>,
    emojiDropdownHolder
  );
}

function unmountEmojiDropodownNearInput(target: HTMLTextAreaElement) {
  const emojiDropdownHolder = target.parentElement?.querySelector('.emoji-dropdown-holder');

  if (!emojiDropdownHolder) {
    return;
  }

  ReactDOM.unmountComponentAtNode(emojiDropdownHolder);
}
