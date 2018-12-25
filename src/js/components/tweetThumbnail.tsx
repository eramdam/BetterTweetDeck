import React, {FC} from 'react';
import {Portal} from 'react-portal';

import {ChirpHandlerPayload} from '../modules/chirpHandler';

interface TweetThumbnailProps {
  chirpData: ChirpHandlerPayload;
}

export const TweetThumbnail: FC<TweetThumbnailProps> = ({chirpData}) => {
  const {uuid} = chirpData;
  const baseNode = document.querySelector(`[data-btd-uuid="${uuid}"] .js-tweet.tweet .tweet-body`);

  if (!baseNode) {
    return null;
  }

  return (
    <Portal node={baseNode}>
      <div className="js-media media-preview position-rel">
        {' '}
        <div className=" js-media-preview-container media-preview-container position-rel width-p--100 margin-vm">
          {' '}
          <a
            className="js-media-image-link block med-link media-item media-size-medium is-zoomable"
            href="https://t.co/2SxulZzPTZ"
            rel="mediaPreview"
            target="_blank"
            style={{
              backgroundColor: 'red'
            }}
            data-media-entity-id="1077419550512099329"
            title=""
          >
            {' '}
          </a>
          <a
            href="https://images.google.com/searchbyimage?image_url=https://pbs.twimg.com/media/DvPDX25VsAEKN4e.jpg?format=jpg&amp;name=small"
            target="_blank"
            rel="url noopener noreferrer"
            className="js-show-tip reverse-image-search is-actionable "
            title="Search image on Google"
          />{' '}
        </div>{' '}
        <a
          href="https://images.google.com/searchbyimage?image_url=https://pbs.twimg.com/media/DvPDX25VsAEKN4e.jpg?format=jpg&amp;name=small"
          target="_blank"
          rel="url noopener noreferrer"
          className="js-show-tip reverse-image-search is-actionable "
          title="Search image on Google"
        />{' '}
      </div>
    </Portal>
  );
};
