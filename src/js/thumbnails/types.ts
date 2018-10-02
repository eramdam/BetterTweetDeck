export enum BTDUrlProviderResultTypeEnum {
  IMAGE = 'image',
  VIDEO = 'video',
  ERROR = 'error'
}

interface BTDUrlProviderBaseResult {
  type: string;
}

interface BTDUrlProviderImageResult extends BTDUrlProviderBaseResult {
  type: BTDUrlProviderResultTypeEnum.IMAGE;
  thumbnailUrl: string;
  url: string;
}

interface BTDUrlProviderVideoResult extends BTDUrlProviderBaseResult {
  type: BTDUrlProviderResultTypeEnum.VIDEO;
  thumbnailUrl: string;
  url: string;
  html: string;
}

interface BTDUrlProviderErrorResult extends BTDUrlProviderBaseResult {
  type: BTDUrlProviderResultTypeEnum.ERROR;
  error: Error;
}

export type BTDFetchResult = BTDUrlProviderImageResult | BTDUrlProviderVideoResult | BTDUrlProviderErrorResult;

export interface BTDUrlProvider {
  readonly name: string;
  readonly settingsKey: string;
  readonly matchUrl: (url: string) => boolean;
  readonly fetchData: (url: string) => Promise<BTDFetchResult>;
}
