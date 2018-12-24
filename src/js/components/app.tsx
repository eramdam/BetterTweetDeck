import React, {Component} from 'react';

import {ChirpHandlerPayload} from '../modules/chirpHandler';
import {
  BTDMessageOriginsEnum,
  BTDMessageTypesEnums,
  ChirpAddedMessageData,
  ChirpRemovedMessageData,
  onBTDMessage
} from '../services/messaging';

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
    window.BTD_APP = this;
    console.log('componentDidMount');
    onBTDMessage<ChirpAddedMessageData>(BTDMessageOriginsEnum.INJECT, BTDMessageTypesEnums.GOT_CHIRP, (data) => {
      this.setState(({chirpsPayload}) => {
        chirpsPayload.set(data.payload.uuid, data.payload);

        return {
          chirpsPayload
        };
      });
    });

    onBTDMessage<ChirpRemovedMessageData>(BTDMessageOriginsEnum.INJECT, BTDMessageTypesEnums.REMOVED_CHIRP, (data) => {
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
    return <div>hello world</div>;
  }
}
