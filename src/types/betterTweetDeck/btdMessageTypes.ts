import * as t from 'io-ts';

import {makeEnumRuntimeType} from '../../helpers/typeHelpers';

/** Different kinds of messages that BTD can send/receive internally. */
export enum BTDMessages {
  FETCH_THUMBNAIL = 'FETCH_THUMBNAIL',
  THUMBNAIL_RESULT = 'THUMBNAIL_RESULT',
  FETCH_CHIRP = 'FETCH_CHIRP',
  CHIRP_RESULT = 'CHIRP_RESULT',
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
  requestId: t.string,
  isReponse: t.union([t.boolean, t.undefined]),
};

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
  payload: t.type({
    type: makeEnumRuntimeType<BTDThumbnailMessageTypes>(BTDThumbnailMessageTypes),
    thumbnailUrl: t.string,
    url: t.string,
    html: t.union([t.undefined, t.string]),
  }),
});

const RBTDMessageEvent = t.type({
  data: t.taggedUnion('name', [RFetchThumbnailEvent, RThumbnailResultEvent]),
});

export interface BTDMessageEvent extends t.TypeOf<typeof RBTDMessageEvent> {}
export type BTDMessageEventData = BTDMessageEvent['data'];

export function isBTDMessage(src: string): src is BTDMessages {
  return src in BTDMessages;
}
