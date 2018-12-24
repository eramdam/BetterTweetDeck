import React, {Component} from 'react';

import {BTDMessageOriginsEnum, ChirpPayloadMessageData, onBTDMessage} from '../services/messaging';

export class App extends Component {
  componentDidMount() {
    onBTDMessage<ChirpPayloadMessageData>(BTDMessageOriginsEnum.INJECT, (data) => {
      console.log(data.payload);
    });
  }

  render() {
    return <div />;
  }
}
