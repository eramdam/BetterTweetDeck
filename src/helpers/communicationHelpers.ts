import _ from 'lodash';

import {
  BTDMessageEvent,
  BTDMessageEventData,
  BTDMessageOriginsEnum,
  BTDMessages,
  isBTDMessage,
} from '../types/btdMessageTypes';

const ORIGIN_TWEETDECK = 'https://tweetdeck.twitter.com';
const ORIGIN_BETTER_TW = 'https://better.tw';

export function isMessageEventAllowed(ev: MessageEvent) {
  const {origin, data} = ev;
  const allowedOrigins = [ORIGIN_TWEETDECK, ORIGIN_BETTER_TW];

  if (!allowedOrigins.includes(origin)) {
    return false;
  }

  // Replace this by an io-ts validator
  const {name} = data;

  if (!name || !isBTDMessage(name)) {
    return false;
  }

  return true;
}

export type BTDMessageEventHandler = (
  ev: BTDMessageEvent
) => Promise<BTDMessageEventData | void | undefined>;

export function listenToInternalBTDMessage(
  name: BTDMessages,
  /** Location from which you're listening to the message */
  location: BTDMessageOriginsEnum,
  handler: BTDMessageEventHandler
) {
  const listener = async (ev: MessageEvent) => {
    if (!isMessageEventAllowed(ev)) {
      return;
    }

    const {data} = ev as BTDMessageEvent;

    if (!data.requestId) {
      return;
    }

    if (data.name !== name) {
      return;
    }

    if (data.isReponse === true) {
      return;
    }

    if (data.origin === location) {
      return;
    }

    const replyEvent = await handler(ev);

    if (!replyEvent) {
      return;
    }

    window.postMessage(
      {
        ...replyEvent,
        requestId: data.requestId,
        isReponse: true,
      } as BTDMessageEventData,
      ORIGIN_TWEETDECK
    );
  };

  window.addEventListener('message', listener);

  return () => {
    window.removeEventListener('message', listener);
  };
}

export function sendInternalBTDMessage(msg: Omit<BTDMessageEventData, 'requestId'>) {
  const requestId = _.uniqueId('btd-request');

  return new Promise<BTDMessageEventData>((resolve) => {
    const listener = (ev: MessageEvent) => {
      if (!isMessageEventAllowed(ev)) {
        return;
      }

      const {data} = ev as BTDMessageEvent;

      if (data.requestId !== requestId) {
        return;
      }

      if (!data.isReponse) {
        return;
      }

      window.removeEventListener('message', listener);
      resolve(ev.data as BTDMessageEventData);
    };

    window.addEventListener('message', listener);
    window.postMessage(
      {
        ...msg,
        requestId,
      } as BTDMessageEventData,
      ORIGIN_TWEETDECK
    );
  });
}
