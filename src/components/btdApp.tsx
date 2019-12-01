import React, {FC} from 'react';
import {TweetThumbnailsProvider} from './tweetThumbnailsProvider';
import './styles/index.css';

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
