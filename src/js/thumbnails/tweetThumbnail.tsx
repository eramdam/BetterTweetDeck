import React, {Component} from 'react';

import {ThumbnailDataMessage} from '../util/messaging';
import {BTDUrlProviderResultTypeEnum} from './types';

interface BTDTweetThumbnailProps {
  urlData: ThumbnailDataMessage;
}

export class BTDTweetThumbnail extends Component<BTDTweetThumbnailProps> {
  render() {
    const {urlData} = this.props;
    if (urlData.payload.type !== BTDUrlProviderResultTypeEnum.IMAGE) {
      return null;
    }

    return (
      <div className=" js-media-preview-container media-preview-container position-rel width-p--100     margin-t--20   is-paused ">
        <div className="media-caret" />
        <a
          className="js-media-image-link block med-link media-item media-size-large   is-zoomable"
          href={urlData.payload.url}
          target="_blank"
          style={{
            backgroundImage: `url("${urlData.payload.thumbnailUrl}")`
          }}
          onMouseDown={(ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            console.log('yolo');
          }}
        >
          {' '}
        </a>
        <a
          href="https://images.google.com/searchbyimage?image_url=https://pbs.twimg.com/media/DhfaJJ6U8AARvzh.jpg?format=jpg&amp;name=medium"
          target="_blank"
          rel="url noopener noreferrer"
          className="js-show-tip reverse-image-search is-actionable "
          title="Search image on Google"
        />
      </div>
    );
  }
}
