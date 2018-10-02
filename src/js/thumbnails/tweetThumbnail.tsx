import classnames from 'classnames';
import React, {Component} from 'react';

import {TweetDeckColumnMediaPreviewSizesEnum} from '../util/columnsMediaSizeMonitor';
import {ThumbnailDataMessage} from '../util/messaging';
import {BTDUrlProviderResultTypeEnum} from './types';

interface BTDTweetThumbnailProps {
  urlData: ThumbnailDataMessage;
  size: TweetDeckColumnMediaPreviewSizesEnum;
}

interface BTDTweetThumbnailState {
  showModal?: boolean;
}

export class BTDTweetThumbnail extends Component<BTDTweetThumbnailProps, BTDTweetThumbnailState> {
  constructor(props: BTDTweetThumbnailProps) {
    super(props);

    this.state = {
      showModal: false
    };
  }

  render() {
    const {urlData, size} = this.props;
    if (urlData.payload.type !== BTDUrlProviderResultTypeEnum.IMAGE) {
      return null;
    }

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

    const {showModal} = this.state;

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
            this.setState({
              showModal: true
            });
          }}
        />
      </div>
    );
  }
}
