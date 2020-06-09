import './styles/index.css';

import React, {FC, useEffect, useState} from 'react';

import {HandlerOf} from '../helpers/typeHelpers';
import {GifPickerProvider} from './gifPickerProvider';
import {TweetThumbnailsProvider} from './tweetThumbnailsProvider';

function useComposerVisiblity(callback: HandlerOf<boolean>) {
  useEffect(() => {
    const drawer = document.querySelector('.drawer[data-drawer="compose"]');

    const onChange = () => {
      const tweetCompose = drawer?.querySelector('textarea.js-compose-text');

      if (!tweetCompose) {
        callback(false);
        return;
      }

      callback(false);
      callback(true);
    };

    const composerObserver = new MutationObserver(onChange);

    composerObserver.observe(drawer!, {
      childList: true,
    });

    onChange();

    return () => {
      composerObserver.disconnect();
    };
  }, [callback]);
}

export const BtdApp: FC = () => {
  const [isComposerVisible, setIsComposerVisible] = useState(false);
  useComposerVisiblity(setIsComposerVisible);

  console.log({isComposerVisible});
  return (
    <div>
      <TweetThumbnailsProvider></TweetThumbnailsProvider>
      {isComposerVisible && <GifPickerProvider></GifPickerProvider>}
      <div id="btd-fullscreen-portal-root">
        <div id="btd-fullscreen-portal-target"></div>
      </div>
    </div>
  );
};
