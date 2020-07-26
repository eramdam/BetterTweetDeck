import * as t from 'io-ts';

import {RBTDFetchResult} from '../../features/thumbnails/types';
import {makeEnumRuntimeType} from '../../helpers/typeHelpers';
import {RChirpHandlerPayload} from '../../inject/chirpHandler';
import {RBetterTweetDeckSettings} from './btdSettingsTypes';

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
  DOWNLOAD_MEDIA = 'DOWNLOAD_MEDIA',
  DOWNLOAD_MEDIA_RESULT = 'DOWNLOAD_MEDIA_RESULT',
  SAVE_SETTINGS = 'SAVE_SETTINGS',
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
const RMakeGifPickerRequestEvent = t.type({
  ...baseMessageEvent,
  name: t.literal(BTDMessages.MAKE_GIF_REQUEST),
  payload: t.type({
    endpoint: t.string,
    source: gifSources,
    params: t.dictionary(t.string, t.string),
  }),
});

const RMakeGifPickerRequestResultEvent = t.type({
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

const RGifDownloadRequestEvent = t.type({
  ...baseMessageEvent,
  name: t.literal(BTDMessages.DOWNLOAD_MEDIA),
  payload: t.string,
});

const RGifDownloadRequestResultEvent = t.type({
  ...baseMessageEvent,
  name: t.literal(BTDMessages.DOWNLOAD_MEDIA_RESULT),
  payload: t.object,
});

export const RSaveSettingsResultEvent = t.type({
  ...baseMessageEvent,
  name: t.literal(BTDMessages.SAVE_SETTINGS),
  payload: t.type({
    settings: RBetterTweetDeckSettings,
    shouldRefresh: t.boolean,
  }),
});

const RBTDMessageEvent = t.type({
  data: t.taggedUnion('name', [
    RFetchThumbnailEvent,
    RThumbnailResultEvent,
    RChirpResult,
    RChirpRemoval,
    RMakeGifPickerRequestEvent,
    RMakeGifPickerRequestResultEvent,
    RBTDReady,
    RGifDownloadRequestEvent,
    RGifDownloadRequestResultEvent,
    RSaveSettingsResultEvent,
  ]),
});

export interface BTDMessageEvent extends t.TypeOf<typeof RBTDMessageEvent> {}
export interface BTDThumbnailResultEvent extends t.TypeOf<typeof RThumbnailResultEvent> {}
export interface BTDFetchThumbnailEvent extends t.TypeOf<typeof RFetchThumbnailEvent> {}
export interface BTDMakeGifPickerRequestEvent extends t.TypeOf<typeof RMakeGifPickerRequestEvent> {}
export interface BTDMakeGifPickerRequestResultEvent
  extends t.TypeOf<typeof RMakeGifPickerRequestResultEvent> {}

export interface BTDGifDownloadRequestEvent extends t.TypeOf<typeof RGifDownloadRequestEvent> {}
export interface BTDGifDownloadRequestResultEvent
  extends t.TypeOf<typeof RGifDownloadRequestResultEvent> {}

export type BTDThumbnailResultEventPayload = BTDThumbnailResultEvent['payload'];
export type BTDMessageEventData = BTDMessageEvent['data'];

export function isBTDMessage(src: string): src is BTDMessages {
  return src in BTDMessages;
}
