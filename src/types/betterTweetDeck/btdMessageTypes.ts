import * as t from 'io-ts';

import {makeEnumRuntimeType} from '../../helpers/typeHelpers';
import {RChirpHandlerPayload} from '../../inject/chirpHandler';
import {RBTDFetchResult} from '../../features/thumbnails/types';

/** Different kinds of messages that BTD can send/receive internally. */
export enum BTDMessages {
  BTD_READY = 'BTD_READY',
  FETCH_THUMBNAIL = 'FETCH_THUMBNAIL',
  THUMBNAIL_RESULT = 'THUMBNAIL_RESULT',
  FETCH_CHIRP = 'FETCH_CHIRP',
  CHIRP_RESULT = 'CHIRP_RESULT',
  CHIRP_REMOVAL = 'CHIRP_REMOVAL',
  MAKE_GIF_REQUEST = 'MAKE_GIF_REQUEST',
  GIF_REQUEST_RESULT = 'GIF_REQUEST_RESULT',
}

/** Locations from which messages can be listened/sent to. */
export enum BTDMessageOriginsEnum {
  INJECT = 'INJECT',
  CONTENT = 'CONTENT',
}

export enum BTDThumbnailMessageTypes {
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
  IMAGE = 'IMAGE',
}

const baseMessageEvent = {
  origin: makeEnumRuntimeType<BTDMessageOriginsEnum>(BTDMessageOriginsEnum),
  requestId: t.union([t.string, t.undefined]),
  isReponse: t.union([t.boolean, t.undefined]),
};

const RChirpResult = t.type({
  ...baseMessageEvent,
  name: t.literal(BTDMessages.CHIRP_RESULT),
  payload: RChirpHandlerPayload,
});

const RChirpRemoval = t.type({
  ...baseMessageEvent,
  name: t.literal(BTDMessages.CHIRP_REMOVAL),
  payload: t.type({
    uuids: t.array(t.string),
  }),
});

const RFetchThumbnailEvent = t.type({
  ...baseMessageEvent,
  name: t.literal(BTDMessages.FETCH_THUMBNAIL),
  payload: t.type({
    url: t.string,
  }),
});

const RThumbnailResultEvent = t.type({
  ...baseMessageEvent,
  name: t.literal(BTDMessages.THUMBNAIL_RESULT),
  payload: RBTDFetchResult,
});

const gifSources = t.union([t.literal('giphy'), t.literal('tenor')]);
const RMakeGifRequestEvent = t.type({
  ...baseMessageEvent,
  name: t.literal(BTDMessages.MAKE_GIF_REQUEST),
  payload: t.type({
    endpoint: t.string,
    source: gifSources,
    params: t.dictionary(t.string, t.string),
  }),
});

const RMakeGifRequestResultEvent = t.type({
  ...baseMessageEvent,
  name: t.literal(BTDMessages.GIF_REQUEST_RESULT),
  payload: t.type({
    gifs: t.readonlyArray(
      t.type({
        preview: t.type({
          url: t.string,
          width: t.Integer,
          height: t.Integer,
        }),
        url: t.string,
        source: gifSources,
      })
    ),
  }),
});

const RBTDReady = t.type({
  ...baseMessageEvent,
  name: t.literal(BTDMessages.BTD_READY),
  payload: t.undefined,
});

const RBTDMessageEvent = t.type({
  data: t.taggedUnion('name', [
    RFetchThumbnailEvent,
    RThumbnailResultEvent,
    RChirpResult,
    RChirpRemoval,
    RMakeGifRequestEvent,
    RMakeGifRequestResultEvent,
    RBTDReady,
  ]),
});

export interface BTDMessageEvent extends t.TypeOf<typeof RBTDMessageEvent> {}
export interface BTDThumbnailResultEvent extends t.TypeOf<typeof RThumbnailResultEvent> {}
export interface BTDFetchThumbnailEvent extends t.TypeOf<typeof RFetchThumbnailEvent> {}
export interface BTDMakeGifRequestEvent extends t.TypeOf<typeof RMakeGifRequestEvent> {}
export interface BTDMakeGifRequestResultEvent extends t.TypeOf<typeof RMakeGifRequestResultEvent> {}

export type BTDThumbnailResultEventPayload = BTDThumbnailResultEvent['payload'];
export type BTDMessageEventData = BTDMessageEvent['data'];

export function isBTDMessage(src: string): src is BTDMessages {
  return src in BTDMessages;
}
