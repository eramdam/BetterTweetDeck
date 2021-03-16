import {isHTMLElement} from '../helpers/domHelpers';
import {onComposerShown} from '../helpers/tweetdeckHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';

export const keepTweetedHashtagsInComposer = makeBTDModule(({jq, settings}) => {
  if (!settings.saveTweetedHashtags) {
    return;
  }
  let savedHashtags: string[] = [];

  function pasteHashtags() {
    const tweetTextArea = document.querySelector<HTMLTextAreaElement>('textarea.js-compose-text');
    console.log('savedHashtags', savedHashtags);

    if (!tweetTextArea) {
      return;
    }

    if (savedHashtags.length === 0) {
      return;
    }

    tweetTextArea.value = ` ${savedHashtags.map((t) => `#${t}`).join(' ')}`;
    tweetTextArea.selectionStart = 0;
    tweetTextArea.selectionEnd = 0;
    tweetTextArea.dispatchEvent(new Event('change'));
  }

  jq(document).on('keypress', 'textarea.js-compose-text', (e) => {
    if (!isHTMLElement(e.target)) {
      return;
    }

    if (!(e.target instanceof HTMLTextAreaElement)) {
      return;
    }

    const tweetText = e.target.value;
    // @ts-expect-error
    const tweetedHashtags = window.twttrTxt?.extractHashtags(tweetText) as string[] | undefined;

    if (!tweetedHashtags) {
      return;
    }

    savedHashtags = tweetedHashtags;
  });

  jq(document).one('dataColumnsLoaded', () => {
    onComposerShown((isVisible) => {
      if (!isVisible) {
        return;
      }

      pasteHashtags();
    });
  });
});
