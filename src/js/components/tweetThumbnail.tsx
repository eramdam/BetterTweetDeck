import React, {Component, FC} from 'react';
import {Portal} from 'react-portal';

import {ChirpHandlerPayload} from '../modules/chirpHandler';
import {TweetDeckColumnMediaPreviewSizesEnum} from '../modules/columnMediaSizes';
import {LargeThumbnail, MediumThumbnail, SmallThumbnail} from './mediaThumbnails';

interface TweetThumbnailProps {
  chirpData: ChirpHandlerPayload;
}

interface TweetThumbnailState {
  urlData: any;
}

export class TweetThumbnail extends Component<TweetThumbnailProps> {
  componentDidMount() {
    const {urls} = this.props.chirpData;

    const urlToConsider = urls.find(u => !u.type && !u.expanded_url.includes('twitter.com'));

    if (!urlToConsider) {
      return;
    }

    console.log({urlToConsider});
  }

  render() {
    return null;
    // const {chirpData} = this.props;
    // const {uuid, columnMediaSize} = chirpData;

    // if (columnMediaSize === TweetDeckColumnMediaPreviewSizesEnum.OFF) {
    //   return null;
    // }

    // const baseNode = document.querySelector(`[data-btd-uuid="${uuid}"] .js-tweet.tweet .tweet-body`);

    // if (!baseNode) {
    //   return null;
    // }

    // return renderThumbnail(this.props, baseNode);
  }
}

function renderThumbnail(props: TweetThumbnailProps, baseNode: Element) {
  const {columnMediaSize, uuid} = props.chirpData;

  if (columnMediaSize === TweetDeckColumnMediaPreviewSizesEnum.LARGE) {
    const node = document.querySelector(`[data-btd-uuid="${uuid}"] .js-stream-item-content`);
    if (!node) {
      return null;
    }

    return (
      <Portal node={node}>
        <LargeThumbnail url="https://better.tw" imageUrl="https://eramdam.github.io/gifs/flatten/bullshit-but-i-believe-it.jpg" />
      </Portal>
    );
  }

  if (columnMediaSize === TweetDeckColumnMediaPreviewSizesEnum.MEDIUM) {
    return (
      <Portal node={baseNode}>
        <MediumThumbnail url="https://better.tw" imageUrl="https://eramdam.github.io/gifs/flatten/bullshit-but-i-believe-it.jpg" />
      </Portal>
    );
  }

  return (
    <Portal node={baseNode}>
      <SmallThumbnail url="https://better.tw" imageUrl="https://eramdam.github.io/gifs/flatten/bullshit-but-i-believe-it.jpg" />
    </Portal>
  );
}
