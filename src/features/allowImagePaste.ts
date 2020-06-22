import _ from 'lodash';

import {makeBTDModule} from '../types/betterTweetDeck/btdCommonTypes';

export const allowImagePaste = makeBTDModule(({jq}) => {
  document.addEventListener('paste', (event) => {
    if (!event.clipboardData) {
      return;
    }

    const items = event.clipboardData.items;

    if (!items) {
      return;
    }

    const files = _(items)
      .filter((item) => {
        return item.kind === 'file' && item.type.startsWith('image/');
      })
      .map((item) => {
        return item.getAsFile();
      })
      .compact()
      .value();

    if (files.length === 0) {
      return;
    }

    jq(document).trigger('uiComposeTweet');
    jq(document).trigger('uiFilesAdded', {
      files,
    });
  });
});
