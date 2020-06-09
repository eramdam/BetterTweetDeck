import React from 'react';
import {render} from 'react-dom';

import {onComposerShown} from '../helpers/tweetdeckHelpers';
import {makeBTDModule} from '../types/betterTweetDeck/btdCommonTypes';
import {GifButton} from './gif/gifButton';

export const setupGifPicker = makeBTDModule(() => {
  console.log('setupGifPicker');
  onComposerShown((isOpen) => {
    console.log({isOpen});
    if (!isOpen) {
      return;
    }

    if (document.getElementById('gifRoot')) {
      return;
    }

    const gifHolderParent = document.querySelector('.compose-text-container > div.txt-right');
    const gifHolder = document.createElement('div');
    gifHolder.id = 'gifRoot';
    gifHolderParent!.insertAdjacentElement('beforeend', gifHolder);

    render(
      <GifButton
        onClick={() => {
          console.log('clicked the gif button!!!!');
        }}
      />,
      gifHolder
    );
  });
});
