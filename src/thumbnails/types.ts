export enum BTDUrlProviderResultTypeEnum {
  IMAGE = 'image',
  VIDEO = 'video',
  ERROR = 'error',
}

interface BTDUrlProviderBaseResult {
  type: string;
}

export interface BTDUrlProviderImageResult extends BTDUrlProviderBaseResult {
  type: BTDUrlProviderResultTypeEnum.IMAGE;
  thumbnailUrl: string;
  fullscreenImageUrl: string;
  url: string;
}

export interface BTDUrlProviderVideoResult extends BTDUrlProviderBaseResult {
  type: BTDUrlProviderResultTypeEnum.VIDEO;
  thumbnailUrl: string;
  url: string;
  html: string;
}

interface BTDUrlProviderErrorResult extends BTDUrlProviderBaseResult {
  type: BTDUrlProviderResultTypeEnum.ERROR;
  error: Error;
}

export type BTDThumbnailDataResults = BTDUrlProviderImageResult | BTDUrlProviderVideoResult;
export type BTDFetchResult = BTDThumbnailDataResults | BTDUrlProviderErrorResult;

export interface BTDThumbnailProvider {
  readonly name: string;
  readonly settingsKey: string;
  readonly matchUrl: (url: string) => boolean;
  readonly fetchData: (url: string) => Promise<BTDFetchResult>;
}
