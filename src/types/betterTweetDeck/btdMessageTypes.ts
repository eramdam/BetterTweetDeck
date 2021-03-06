import {Dictionary} from 'lodash';

import {BTDFetchResult} from '../../features/thumbnails/types';
import {ChirpAddedPayload} from '../../inject/chirpHandler';
import {BTDSettings} from './btdSettingsTypes';

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
  GET_SETTINGS = 'GET_SETTINGS',
  OPEN_SETTINGS = 'OPEN_SETTINGS',
  GET_SETTINGS_RESULT = 'GET_SETTINGS_RESULT',
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

interface BTDMessageEventBase {
  requestId?: string;
  isReponse?: boolean;
  origin: BTDMessageOriginsEnum;
  name: BTDMessages;
  payload: any;
}

interface BTDChirpResult extends BTDMessageEventBase {
  name: BTDMessages.CHIRP_RESULT;
  payload: ChirpAddedPayload;
}

interface BTDChirpRemoval extends BTDMessageEventBase {
  name: BTDMessages.CHIRP_REMOVAL;
  payload: {
    uuids: string[];
  };
}

interface BTDFetchThumbnail extends BTDMessageEventBase {
  name: BTDMessages.FETCH_THUMBNAIL;
  payload: {
    url: string;
  };
}

export interface BTDFetchThumbnailResult extends BTDMessageEventBase {
  name: BTDMessages.FETCH_THUMBNAIL;
  payload: {
    url: string;
  };
}

export interface BTDThumbnailResult extends BTDMessageEventBase {
  name: BTDMessages.THUMBNAIL_RESULT;
  payload: BTDFetchResult;
}

export interface BTDMakeGifPickerRequest extends BTDMessageEventBase {
  name: BTDMessages.MAKE_GIF_REQUEST;
  payload: {
    endpoint: string;
    source: 'tenor' | 'giphy';
    params: Dictionary<string>;
  };
}

export interface BTDMakeGifPickerRequestResult extends BTDMessageEventBase {
  name: BTDMessages.GIF_REQUEST_RESULT;
  payload: {
    gifs: ReadonlyArray<{
      preview: {
        url: string;
        width: number;
        height: number;
      };
      url: string;
      source: 'tenor' | 'giphy';
    }>;
  };
}

interface BTDReady extends BTDMessageEventBase {
  name: BTDMessages.BTD_READY;
  payload: undefined;
}

export interface BTDDownloadMediaRequest extends BTDMessageEventBase {
  name: BTDMessages.DOWNLOAD_MEDIA;
  payload: string;
}

export interface BTDDownloadMediaRequestResult extends BTDMessageEventBase {
  name: BTDMessages.DOWNLOAD_MEDIA_RESULT;
  payload: {
    blob: Blob;
    url: string;
  };
}

interface BTDSaveSettings extends BTDMessageEventBase {
  name: BTDMessages.SAVE_SETTINGS;
  payload: {
    settings: BTDSettings;
    shouldRefresh: boolean;
  };
}

interface BTDGetSettings extends BTDMessageEventBase {
  name: BTDMessages.GET_SETTINGS;
  payload: undefined;
}

interface BTDGetSettingsResult extends BTDMessageEventBase {
  name: BTDMessages.GET_SETTINGS_RESULT;
  payload: BTDSettings;
}

interface BTDOpenSettings extends BTDMessageEventBase {
  name: BTDMessages.OPEN_SETTINGS;
  payload: undefined;
}

export type BTDMessageEventData =
  | BTDChirpResult
  | BTDChirpRemoval
  | BTDFetchThumbnail
  | BTDFetchThumbnailResult
  | BTDThumbnailResult
  | BTDMakeGifPickerRequest
  | BTDMakeGifPickerRequestResult
  | BTDReady
  | BTDSaveSettings
  | BTDGetSettings
  | BTDOpenSettings
  | BTDGetSettingsResult
  | BTDDownloadMediaRequest
  | BTDDownloadMediaRequestResult;
export interface BTDMessageEvent {
  data: BTDMessageEventData;
}

export function isBTDMessage(src: string): src is BTDMessages {
  return src in BTDMessages;
}
