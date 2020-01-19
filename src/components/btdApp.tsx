import './styles/index.css';

import React, {FC} from 'react';

import {TweetThumbnailsProvider} from './tweetThumbnailsProvider';

export const BtdApp: FC = () => {
  return (
    <div>
      <TweetThumbnailsProvider></TweetThumbnailsProvider>
      <div id="btd-fullscreen-portal-root">
        <div id="btd-fullscreen-portal-target"></div>
      </div>
    </div>
  );
};
