import {ChirpHandlerPayload, ChirpRemovedPayload} from '../modules/chirpHandler';

export enum BTDMessageTypesEnums {
  GOT_CHIRP = 'GOT_CHIRP',
  REMOVED_CHIRP = 'REMOVED_CHIRP',
  THUMBNAIL_DATA = 'THUMBNAIL_DATA',
  DEBUG = '___USE_ONLY_FOR_DEBUG___',
  READY = 'READY'
}

export enum BTDMessageOriginsEnum {
  INJECT = 'BTD_INJECT',
  CONTENT = 'BTD_CONTENT'
}

interface BTDBaseMessageData {
  readonly type: string;
  readonly payload?: any;
  readonly meta?: {
    hash?: string;
    origin: BTDMessageOriginsEnum;
  };
}

export interface ReadyMessage extends BTDBaseMessageData {
  readonly type: BTDMessageTypesEnums.READY;
}

export interface ChirpAddedMessageData extends BTDBaseMessageData {
  readonly type: BTDMessageTypesEnums.GOT_CHIRP;
  readonly payload: ChirpHandlerPayload;
}

export interface ChirpRemovedMessageData extends BTDBaseMessageData {
  readonly type: BTDMessageTypesEnums.REMOVED_CHIRP;
  readonly payload: ChirpRemovedPayload;
}

export interface ThumbnailDataMessage extends BTDBaseMessageData {
  readonly type: BTDMessageTypesEnums.THUMBNAIL_DATA;
  readonly payload: {};
}

interface DebugMessage extends BTDBaseMessageData {
  type: BTDMessageTypesEnums.DEBUG;
}

export type BTDData = DebugMessage | ChirpAddedMessageData | ThumbnailDataMessage | ReadyMessage | ChirpRemovedMessageData;

const MESSAGE_ORIGIN = 'https://tweetdeck.twitter.com';

const baseMsgTransit = (sourceKey: BTDMessageOriginsEnum, destinationKey: BTDMessageOriginsEnum) => function transfer<T = {}>(data: BTDData) {
  return new Promise<T>((resolve) => {
    // We compute a "hash" with performance.now(), should be simple enough for now
    // NOTE: for the whole promise-based system to work, a listener to a given event MUST send back the existing hash
    const hash = (data.meta && data.meta.hash) || (performance.now() + Math.random()).toString(36);

    // We register a listener
    window.addEventListener('message', function currListener(ev) {
      // If the message doesn't come from TD, doesn't come from the content script,
      if (!ev || ev.origin !== MESSAGE_ORIGIN || !ev.data || !ev.data.meta || ev.data.meta.origin !== destinationKey || ev.data.meta.hash !== hash) {
        return;
      }

      resolve(ev.data);
      window.removeEventListener('message', currListener);
    });

    window.postMessage(
      Object.assign(data, {
        meta: {
          origin: sourceKey,
          hash
        }
      }),
      MESSAGE_ORIGIN
    );
  });
};

/** Sends a postMessage event to the content script and returns its response in the promise */
export const msgToContent = baseMsgTransit(BTDMessageOriginsEnum.INJECT, BTDMessageOriginsEnum.CONTENT);
/** Sends a postMessage event to the injected script and returns its response in the promise */
export const msgToInject = baseMsgTransit(BTDMessageOriginsEnum.CONTENT, BTDMessageOriginsEnum.INJECT);

interface BTDMessageEvent extends MessageEvent {
  data: BTDData;
}

const BTDMessageTypesEnumsValues = Object.values(BTDMessageTypesEnums);
const BTDMessageOriginsEnumValues = Object.values(BTDMessageOriginsEnum);

function messageIsBTDMessage(message: MessageEvent): message is BTDMessageEvent {
  if (message.origin !== MESSAGE_ORIGIN || !BTDMessageTypesEnumsValues.includes(message.data.type) || !BTDMessageOriginsEnumValues.includes(message.data.meta.origin)) {
    return false;
  }

  return true;
}

/** Runs a callback on every message events sent by Better TweetDeck  */
export function onBTDMessage<T extends BTDData>(origin: BTDMessageOriginsEnum, messageType: BTDMessageTypesEnums, cb: (ev: T) => void) {
  window.addEventListener('message', (ev) => {
    if (!messageIsBTDMessage(ev) || !ev.data.meta || ev.data.meta.origin !== origin) {
      return;
    }

    if (messageType.toString() !== ev.data.type) {
      return;
    }

    cb(ev.data as T);
  });
}

export function waitForBTDMessage(origin: BTDMessageOriginsEnum, messageType: BTDMessageTypesEnums) {
  return new Promise((resolve) => {
    const listener = (ev: MessageEvent) => {
      if (!messageIsBTDMessage(ev) || !ev.data.meta || ev.data.meta.origin !== origin) {
        return;
      }

      if (messageType.toString() !== ev.data.type) {
        return;
      }

      window.removeEventListener('message', listener);
      resolve(ev);
    };

    window.addEventListener('message', listener);
  });
}
