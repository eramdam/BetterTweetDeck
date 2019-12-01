import * as t from 'io-ts';

import {makeEnumRuntimeType} from '../../helpers/typeHelpers';
import {RChirpHandlerPayload} from '../../services/chirpHandler';
import {RBTDFetchResult} from '../../thumbnails/types';

/** Different kinds of messages that BTD can send/receive internally. */
export enum BTDMessages {
  FETCH_THUMBNAIL = 'FETCH_THUMBNAIL',
  THUMBNAIL_RESULT = 'THUMBNAIL_RESULT',
  FETCH_CHIRP = 'FETCH_CHIRP',
  CHIRP_RESULT = 'CHIRP_RESULT',
  CHIRP_REMOVAL = 'CHIRP_REMOVAL',
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

const RBTDMessageEvent = t.type({
  data: t.taggedUnion('name', [
    RFetchThumbnailEvent,
    RThumbnailResultEvent,
    RChirpResult,
    RChirpRemoval,
  ]),
});

export interface BTDMessageEvent extends t.TypeOf<typeof RBTDMessageEvent> {}
interface BTDThumbnailResultEvent extends t.TypeOf<typeof RThumbnailResultEvent> {}
export type BTDThumbnailResultEventPayload = BTDThumbnailResultEvent['payload'];
export type BTDMessageEventData = BTDMessageEvent['data'];

export function isBTDMessage(src: string): src is BTDMessages {
  return src in BTDMessages;
}
