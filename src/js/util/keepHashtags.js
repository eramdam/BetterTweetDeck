import { onComposerDisabledStateChange, onComposerShown } from './tweetdeckUtils';

export function keepHashtags() {
  let hashtags = [];

  // Save hashtags when typing.
  document.body.addEventListener(
    'keyup',
    (ev) => {
      if (!ev.target.matches('textarea.js-compose-text')) {
        return;
      }

      const tweetText = ev.target.value;
      const tweetedHashtags = window.twttrTxt.extractHashtags(tweetText);
      hashtags = tweetedHashtags;
    },
    true,
  );

  function pasteHashtags() {
    const tweetTextArea = document.querySelector('textarea.js-compose-text');

    if (!tweetTextArea) {
      return;
    }

    if (hashtags.length === 0) {
      return;
    }

    tweetTextArea.value = ` ${hashtags.map(t => `#${t}`).join(' ')}`;
    tweetTextArea.selectionStart = 0;
    tweetTextArea.selectionEnd = 0;
    tweetTextArea.dispatchEvent(new Event('change'));
  }

  // Re-instate hashtags when the composer is enabled again.
  onComposerDisabledStateChange((isDisabled) => {
    if (isDisabled) {
      return;
    }

    pasteHashtags();
  });

  // Re-add hashtags when the composer is back.
  onComposerShown((isVisible) => {
    if (!isVisible) {
      return;
    }

    pasteHashtags();
  });
}
