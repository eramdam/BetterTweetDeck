import {Dictionary} from 'lodash';

import {ChirpAddedPayload} from '../services/chirpHandler';
import {BTDSettings} from './btdSettingsTypes';

/** Different kinds of messages that BTD can send/receive internally. */
export enum BTDMessages {
  BTD_READY = 'BTD_READY',
  CHIRP_RESULT = 'CHIRP_RESULT',
  CHIRP_REMOVAL = 'CHIRP_REMOVAL',
  MAKE_GIF_REQUEST = 'MAKE_GIF_REQUEST',
  GIF_REQUEST_RESULT = 'GIF_REQUEST_RESULT',
  DOWNLOAD_MEDIA = 'DOWNLOAD_MEDIA',
  DOWNLOAD_MEDIA_RESULT = 'DOWNLOAD_MEDIA_RESULT',
  SAVE_SETTINGS = 'SAVE_SETTINGS',
  OPEN_SETTINGS = 'OPEN_SETTINGS',
  PING = 'PING',
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

interface BTDOpenSettings extends BTDMessageEventBase {
  name: BTDMessages.OPEN_SETTINGS;
  payload: {
    selectedId?: string;
  };
}

interface BTDPing extends BTDMessageEventBase {
  name: BTDMessages.PING;
}

export type BTDMessageEventData =
  | BTDChirpResult
  | BTDChirpRemoval
  | BTDMakeGifPickerRequest
  | BTDMakeGifPickerRequestResult
  | BTDReady
  | BTDSaveSettings
  | BTDOpenSettings
  | BTDDownloadMediaRequest
  | BTDDownloadMediaRequestResult
  | BTDPing;
export interface BTDMessageEvent {
  data: BTDMessageEventData;
}

export function isBTDMessage(src: string): src is BTDMessages {
  return src in BTDMessages;
}
