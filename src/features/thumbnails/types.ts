export enum BTDUrlProviderResultTypeEnum {
  IMAGE = 'image',
  VIDEO = 'video',
  ERROR = 'error',
}

export interface BTDUrlProviderImageResult {
  type: BTDUrlProviderResultTypeEnum.IMAGE;
  thumbnailUrl: string;
  fullscreenImageUrl: string;
  url: string;
}

export interface BTDUrlProviderVideoResult {
  type: BTDUrlProviderResultTypeEnum.VIDEO;
  thumbnailUrl: string;
  html: string;
  url: string;
}

interface BTDUrlProviderErrorResult {
  type: BTDUrlProviderResultTypeEnum.ERROR;
  error: Error;
}

export type BTDFetchResult =
  | BTDUrlProviderImageResult
  | BTDUrlProviderVideoResult
  | BTDUrlProviderErrorResult;

export interface BTDThumbnailProvider {
  readonly name: string;
  readonly settingsKey: string;
  readonly matchUrl: (url: string) => boolean;
  readonly fetchData: (url: string) => Promise<BTDFetchResult>;
}
