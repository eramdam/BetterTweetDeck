import {isHTMLElement} from '../helpers/domHelpers';
import {onComposerShown} from '../helpers/tweetdeckHelpers';
import {HandlerOf} from '../helpers/typeHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';

export const keepTweetedHashtagsInComposer = makeBTDModule(({jq, settings}) => {
  if (!settings.saveTweetedHashtags) {
    return;
  }
  let hashtags: string[] = [];

  // Save hashtags when typing.
  document.body.addEventListener(
    'keyup',
    (ev) => {
      if (
        !isHTMLElement(ev.target) ||
        !ev.target.matches('textarea.js-compose-text') ||
        !(ev.target instanceof HTMLTextAreaElement)
      ) {
        return;
      }

      const tweetText = ev.target.value;
      // @ts-expect-error
      const tweetedHashtags = window.twttrTxt.extractHashtags(tweetText);
      hashtags = tweetedHashtags;
    },
    true
  );

  function pasteHashtags() {
    const tweetTextArea = document.querySelector<HTMLTextAreaElement>('textarea.js-compose-text');

    if (!tweetTextArea) {
      return;
    }

    if (hashtags.length === 0) {
      return;
    }

    tweetTextArea.value = ` ${hashtags.map((t) => `#${t}`).join(' ')}`;
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
});

function onComposerDisabledStateChange(callback: HandlerOf<boolean>) {
  const tweetComposerObserver = new MutationObserver(() => {
    const tweetComposer = document.querySelector<HTMLTextAreaElement>(
      '.drawer[data-drawer="compose"] textarea.js-compose-text'
    );
    callback(tweetComposer?.disabled ?? false);
  });

  onComposerShown((isVisible) => {
    if (!isVisible) {
      tweetComposerObserver.disconnect();
      return;
    }

    const tweetComposer = document.querySelector(
      '.drawer[data-drawer="compose"] textarea.js-compose-text'
    );

    if (!tweetComposer) {
      return;
    }

    tweetComposerObserver.observe(tweetComposer, {
      attributeFilter: ['disabled'],
      attributes: true,
    });
  });
}
