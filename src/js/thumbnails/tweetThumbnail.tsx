import classnames from 'classnames';
import React, {Component} from 'react';

import {TweetDeckColumnMediaPreviewSizesEnum} from '../util/columnsMediaSizeMonitor';
import {ThumbnailDataMessage} from '../util/messaging';
import {BTDThumbnailDataResults, BTDUrlProviderResultTypeEnum} from './types';

interface BTDTweetThumbnailProps {
  urlData: ThumbnailDataMessage;
  size: TweetDeckColumnMediaPreviewSizesEnum;
  onThumbnailClick?: (data: BTDThumbnailDataResults) => void;
}

export class BTDTweetThumbnail extends Component<BTDTweetThumbnailProps> {
  render() {
    const {urlData, size} = this.props;
    if (urlData.payload.type === BTDUrlProviderResultTypeEnum.ERROR) {
      return null;
    }

    const payloadData = urlData.payload;

    const isSizeLarge = size === TweetDeckColumnMediaPreviewSizesEnum.LARGE;

    const wrapperClassnames = classnames('js-media-preview-container media-preview-container position-rel width-p--100', {
      'margin-t--20': isSizeLarge,
      'margin-vm': !isSizeLarge
    });

    const mediaImageClassName = classnames('js-media-image-link block med-link media-item is-zoomable', {
      'media-size-large': isSizeLarge,
      'media-size-medium': size === TweetDeckColumnMediaPreviewSizesEnum.MEDIUM,
      'media-size-small': size === TweetDeckColumnMediaPreviewSizesEnum.SMALL
    });

    return (
      <div className={wrapperClassnames}>
        {isSizeLarge ? <div className="media-caret" /> : null}
        <a
          className={mediaImageClassName}
          href={urlData.payload.url}
          target="_blank"
          style={{
            backgroundImage: `url("${urlData.payload.thumbnailUrl}")`
          }}
          onMouseDown={(ev) => {
            ev.preventDefault();
            ev.stopPropagation();

            if (this.props.onThumbnailClick) {
              this.props.onThumbnailClick(payloadData);
            }
          }}
        />
      </div>
    );
  }
}
