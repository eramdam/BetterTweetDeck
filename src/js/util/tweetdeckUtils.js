// From http://stackoverflow.com/questions/1064089/inserting-a-text-where-cursor-is-using-javascript-jquery
function insertAtCursor(input, value) {
  // IE support
  if (document.selection) {
    input.focus();
    const sel = document.selection.createRange();
    sel.text = value;
    // MOZILLA and others
  } else if (input.selectionStart || input.selectionStart === '0') {
    const startPos = input.selectionStart;
    const endPos = input.selectionEnd;
    input.value =
      input.value.substring(0, startPos) +
      value +
      input.value.substring(endPos, input.value.length);
  } else {
    input.value += value;
  }
}

export function insertInsideComposer(string) {
  const tweetCompose = document.querySelector('textarea.js-compose-text');

  if (!tweetCompose) {
    console.error('[BTD] No composer present');
    return;
  }

  insertAtCursor(tweetCompose, string);
  tweetCompose.dispatchEvent(new Event('change'));
}

export function onComposerShown(callback) {
  const drawer = document.querySelector('.drawer[data-drawer="compose"]');

  const onChange = () => {
    const tweetCompose = drawer.querySelector('textarea.js-compose-text');

    if (!tweetCompose) {
      callback(false);
    }

    callback(true);
  };

  const composerObserver = new MutationObserver(onChange);

  composerObserver.observe(drawer, {
    childList: true,
  });

  onChange();

  return () => {
    composerObserver.disconnect();
  };
}

export function onComposerDisabledStateChange(callback) {
  const tweetComposerObserver = new MutationObserver(() => {
    const tweetComposer = document.querySelector('.drawer[data-drawer="compose"] textarea.js-compose-text');
    callback(tweetComposer.disabled);
  });

  onComposerShown((isVisible) => {
    if (!isVisible) {
      tweetComposerObserver.disconnect();
      return;
    }

    const tweetComposer = document.querySelector('.drawer[data-drawer="compose"] textarea.js-compose-text');

    if (!tweetComposer) {
      return;
    }

    tweetComposerObserver.observe(tweetComposer, {
      attributeFilter: ['disabled'],
      attributes: true,
    });
  });
}
