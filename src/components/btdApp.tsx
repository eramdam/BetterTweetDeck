import React, {FC} from 'react';
import {TweetThumbnailsProvider} from './tweetThumbnailsProvider';

export const BtdApp: FC = () => {
  return (
    <div>
      <TweetThumbnailsProvider></TweetThumbnailsProvider>
    </div>
  );
};
