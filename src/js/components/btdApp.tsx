import React, {Component, Fragment} from 'react';

import {ChirpHandlerPayload} from '../modules/chirpHandler';
import {TweetDeckColumnMediaPreviewSizesEnum} from '../modules/columnMediaSizes';
import {
  BTDMessageOriginsEnum,
  BTDMessageTypesEnums,
  ChirpAddedMessage,
  ChirpRemovedMessage,
  onBTDMessage
} from '../services/messaging';
import {BTDThumbnailDataResults} from '../thumbnails/types';
import {HandlerOf} from '../types';
import {FullscreenModal} from './fullscreenModal';
import {TweetThumbnail} from './tweetThumbnail';

interface AppState {
  chirpsPayload: Map<string, ChirpHandlerPayload>;
  isFullscrenPreviewOpen?: boolean;
  fullscreenUrlData?: BTDThumbnailDataResults;
}

export class BTDApp extends Component<{}, AppState> {
  constructor(props: any) {
    super(props);

    this.state = {
      chirpsPayload: new Map<string, ChirpHandlerPayload>()
    };
  }

  componentDidMount() {
    // @ts-ignore
    window.BTD_APP = this;
    onBTDMessage<ChirpAddedMessage>(BTDMessageOriginsEnum.INJECT, BTDMessageTypesEnums.GOT_CHIRP, (data) => {
      this.setState(({chirpsPayload}) => {
        chirpsPayload.set(data.payload.uuid, data.payload);

        return {
          chirpsPayload
        };
      });
    });

    onBTDMessage<ChirpRemovedMessage>(BTDMessageOriginsEnum.INJECT, BTDMessageTypesEnums.REMOVED_CHIRP, (data) => {
      this.setState(({chirpsPayload}) => {
        data.payload.uuidArray.forEach((uuid) => {
          chirpsPayload.delete(uuid);
        });

        return {
          chirpsPayload
        };
      });
    });
  }

  private readonly handleThumbnailClick: HandlerOf<BTDThumbnailDataResults> = (urlData) => {
    this.setState({
      isFullscrenPreviewOpen: true,
      fullscreenUrlData: urlData
    });
  };

  private readonly maybeRenderFullscreenPreview = () => {
    const {fullscreenUrlData, isFullscrenPreviewOpen} = this.state;

    if (!isFullscrenPreviewOpen || !fullscreenUrlData) {
      return null;
    }

    return (
      <FullscreenModal
        urlData={fullscreenUrlData}
        onRequestClose={() => {
          this.setState({
            isFullscrenPreviewOpen: false,
            fullscreenUrlData: undefined
          });
        }}
      />
    );
  };

  private readonly renderThumbnailsInChirps = () => Array.from(this.state.chirpsPayload.values())
    .filter(p => p.urls.length && p.columnMediaSize !== TweetDeckColumnMediaPreviewSizesEnum.OFF)
    .map(p => <TweetThumbnail key={p.uuid} chirpData={p} onClick={this.handleThumbnailClick} />);

  render() {
    return (
      <Fragment>
        {this.renderThumbnailsInChirps()}
        {this.maybeRenderFullscreenPreview()}
      </Fragment>
    );
  }
}
