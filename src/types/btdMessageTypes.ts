import {Dictionary} from 'lodash';

import {BTDSettings} from './btdSettingsTypes';

export enum BTDMessages {
  BTD_READY = 'BTD_READY',
  MAKE_GIF_REQUEST = 'MAKE_GIF_REQUEST',
  GIF_REQUEST_RESULT = 'GIF_REQUEST_RESULT',
  DOWNLOAD_MEDIA = 'DOWNLOAD_MEDIA',
  DOWNLOAD_MEDIA_RESULT = 'DOWNLOAD_MEDIA_RESULT',
  OPEN_SETTINGS = 'OPEN_SETTINGS',
  UPDATE_SETTINGS = 'UPDATE_SETTINGS',
  PING = 'PING',
  NOTIFICATION = 'NOTIFICATION',
  PROMPT_FOLLOW = 'PROMPT_FOLLOW',
}

export enum BTDNotificationTypes {
  UPDATE = 'UPDATE',
  FOLLOW_PROMPT = 'FOLLOW_PROMPT',
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

export interface BTDNotification extends BTDMessageEventBase {
  name: BTDMessages.NOTIFICATION;
  payload: {
    type: BTDNotificationTypes;
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

interface BTDOpenSettings extends BTDMessageEventBase {
  name: BTDMessages.OPEN_SETTINGS;
  payload: {
    selectedId?: string;
  };
}
interface BTDUpdateSettings extends BTDMessageEventBase {
  name: BTDMessages.UPDATE_SETTINGS;
  payload: Partial<BTDSettings>;
}

interface BTDPing extends BTDMessageEventBase {
  name: BTDMessages.PING;
}

interface BTDPromptFollow extends BTDMessageEventBase {
  name: BTDMessages.PROMPT_FOLLOW;
}

export type BTDMessageEventData =
  | BTDMakeGifPickerRequest
  | BTDMakeGifPickerRequestResult
  | BTDReady
  | BTDOpenSettings
  | BTDDownloadMediaRequest
  | BTDDownloadMediaRequestResult
  | BTDPing
  | BTDNotification
  | BTDPromptFollow
  | BTDUpdateSettings;
export interface BTDMessageEvent {
  data: BTDMessageEventData;
}

export function isBTDMessage(src: string): src is BTDMessages {
  return src in BTDMessages;
}
