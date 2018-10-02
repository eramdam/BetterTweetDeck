import React from 'react';
import ReactDOM from 'react-dom';

import {ChirpProps} from '../components/chirpHandler';
import {BTD_CUSTOM_ATTRIBUTE} from '../types';
import {TweetDeckColumnMediaPreviewSizesEnum} from '../util/columnsMediaSizeMonitor';
import {ThumbnailDataMessage} from '../util/messaging';
import {BTDTweetThumbnail} from './tweetThumbnail';
import {BTDUrlProviderResultTypeEnum} from './types';

export function insertThumbnailOnTweet(chirpProps: ChirpProps, urlData: ThumbnailDataMessage, size: TweetDeckColumnMediaPreviewSizesEnum, onThumbnailClick: () => void) {
  if (size === 'off') {
    return;
  }

  switch (urlData.payload.type) {
    case BTDUrlProviderResultTypeEnum.IMAGE:
      if (!chirpProps.originalNode.querySelector('.js-tweet.tweet')) {
        return;
      }

      if (size === 'large') {
        chirpProps.originalNode.querySelector('.js-tweet.tweet')!.insertAdjacentHTML('afterend', `<div class="js-media position-rel item-box-full-bleed margin-tm" ${BTD_CUSTOM_ATTRIBUTE}></div>`);
      } else {
        chirpProps.originalNode.querySelector('.js-tweet-body')!.insertAdjacentHTML('beforeend', `<div class="js-media media-preview position-rel" ${BTD_CUSTOM_ATTRIBUTE}></div>`);
      }

      ReactDOM.render(<BTDTweetThumbnail urlData={urlData} size={size} onThumbnailClick={onThumbnailClick} />, chirpProps.originalNode.querySelector(`[${BTD_CUSTOM_ATTRIBUTE}]`));

      break;

    default:
      break;
  }
}

export function buildURLWithSearchParams(url: string, searchParams: object) {
  const finalUrl = new URL(url);

  Object.entries(searchParams).forEach(([key, value]) => {
    finalUrl.searchParams.set(key, value);
  });

  return finalUrl.toString();
}
