import _ from 'lodash';

import {makeBTDModule} from '../types/betterTweetDeck/btdCommonTypes';

export const allowImagePaste = makeBTDModule(({$}) => {
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

    $(document).trigger('uiComposeTweet');
    $(document).trigger('uiFilesAdded', {
      files,
    });
  });
});
