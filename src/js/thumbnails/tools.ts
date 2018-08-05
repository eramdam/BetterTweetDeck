import React from 'react';
import ReactDOM from 'react-dom';

import {ChirpProps} from '../components/chirpHandler';
import {BTD_CUSTOM_ATTRIBUTE} from '../types';
import {ThumbnailDataMessage} from '../util/messaging';
import {BTDTweetThumbnail} from './tweetThumbnail';
import {BTDUrlProviderResultTypeEnum} from './types';

export function insertThumbnailOnTweet(chirpProps: ChirpProps, urlData: ThumbnailDataMessage) {
  switch (urlData.payload.type) {
    case BTDUrlProviderResultTypeEnum.IMAGE:
      if (!chirpProps.originalNode.querySelector('.js-tweet.tweet')) {
        return;
      }
      chirpProps.originalNode
        .querySelector('.js-tweet.tweet')!
        .insertAdjacentHTML(
          'afterend',
          `<div class="js-media position-rel item-box-full-bleed margin-tm"${BTD_CUSTOM_ATTRIBUTE}></div>`
        );

      ReactDOM.render(
        React.createElement(BTDTweetThumbnail, {
          urlData
        }),
        chirpProps.originalNode.querySelector(`[${BTD_CUSTOM_ATTRIBUTE}]`)
      );

      break;

    default:
      break;
  }
}
