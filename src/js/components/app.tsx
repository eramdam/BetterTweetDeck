import React, {Component} from 'react';

import {ChirpHandlerPayload} from '../modules/chirpHandler';
import {TweetDeckColumnMediaPreviewSizesEnum} from '../modules/columnMediaSizes';
import {
  BTDMessageOriginsEnum,
  BTDMessageTypesEnums,
  ChirpAddedMessage,
  ChirpRemovedMessage,
  onBTDMessage
} from '../services/messaging';
import {TweetThumbnail} from './tweetThumbnail';

interface AppState {
  chirpsPayload: Map<string, ChirpHandlerPayload>;
}

export class App extends Component<{}, AppState> {
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

  render() {
    return Array.from(this.state.chirpsPayload.values())
      .filter(p => p.urls.length && p.columnMediaSize !== TweetDeckColumnMediaPreviewSizesEnum.OFF)
      .map(p => <TweetThumbnail key={p.uuid} chirpData={p} />);
  }
}
