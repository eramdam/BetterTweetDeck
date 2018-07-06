export enum BTDMessageTypesEnums {
  CHIRP_URLS = 'CHIRPS_URLS',
  DEBUG = '___USE_ONLY_FOR_DEBUG___'
}

export enum BTDMessageOriginsEnum {
  INJECT = 'BTD_INJECT',
  CONTENT = 'BTD_CONTENT'
}

interface BTDBaseMessageData<T = {}> {
  readonly type: BTDMessageTypesEnums;
  readonly payload: T;
  readonly hash?: string;
}

interface BTDDecoratedMessageData<T> extends BTDBaseMessageData<T> {
  readonly origin: BTDMessageOriginsEnum;
}

interface ChirpUrlsMessageData extends BTDBaseMessageData<string[]> {
  type: BTDMessageTypesEnums.CHIRP_URLS;
}

interface DebugMessage extends BTDBaseMessageData {
  type: BTDMessageTypesEnums.DEBUG;
}

export type BTDData = DebugMessage | ChirpUrlsMessageData;

const MESSAGE_ORIGIN = 'https://tweetdeck.twitter.com';

const baseMsgTransit = (sourceKey: BTDMessageOriginsEnum, destinationKey: BTDMessageOriginsEnum) => (data: BTDData) =>
  new Promise((resolve) => {
    // We compute a "hash" with performance.now(), should be simple enough for now
    const hash = data.hash || (performance.now() + Math.random()).toString(36);

    // We register a listener
    window.addEventListener('message', function currListener(ev) {
      // If the message doesn't come from TD, doesn't come from the content script,
      if (ev.origin !== MESSAGE_ORIGIN || ev.data.origin !== destinationKey || ev.data.hash !== hash) {
        return;
      }

      resolve(ev.data);
      window.removeEventListener('message', currListener);
    });

    window.postMessage(
      Object.assign(data, {
        origin: sourceKey,
        hash
      }),
      MESSAGE_ORIGIN
    );
  });

/** Sends a postMessage event to the content script and returns its response in the promise */
export const msgToContent = baseMsgTransit(BTDMessageOriginsEnum.INJECT, BTDMessageOriginsEnum.CONTENT);
/** Sends a postMessage event to the injected script and returns its response in the promise */
export const msgToInject = baseMsgTransit(BTDMessageOriginsEnum.CONTENT, BTDMessageOriginsEnum.INJECT);

interface BTDMessageEvent<T> extends MessageEvent {
  data: BTDDecoratedMessageData<T>;
}

const BTDMessageTypesEnumsValues = Object.values(BTDMessageTypesEnums);
const BTDMessageOriginsEnumValues = Object.values(BTDMessageOriginsEnum);
function messageIsBTDMessage(message: MessageEvent): message is BTDMessageEvent<any> {
  if (message.origin !== MESSAGE_ORIGIN || !BTDMessageTypesEnumsValues.includes(message.data.type) || !BTDMessageOriginsEnumValues.includes(message.data.origin)) {
    return false;
  }

  return true;
}

/** Runs a callback on every message events sent by Better TweetDeck  */
export function onBTDMessage(origin: BTDMessageOriginsEnum, cb: (ev: BTDMessageEvent<any>) => void) {
  window.addEventListener('message', (ev) => {
    if (!messageIsBTDMessage(ev) || ev.data.origin !== origin) {
      return;
    }

    cb(ev);
  });
}
